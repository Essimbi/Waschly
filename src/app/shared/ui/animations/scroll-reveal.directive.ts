import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

export interface ScrollRevealConfig {
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input('appScrollReveal') set config(value: ScrollRevealConfig | string | '') {
    if (typeof value === 'string' && value !== '') {
      try {
        this._config = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        this._config = {};
      }
    } else if (typeof value === 'object' && value !== null) {
      this._config = value as ScrollRevealConfig;
    } else {
      this._config = {};
    }
  }
  private _config: ScrollRevealConfig = {};

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setupInitialStyles();
    this.setupIntersectionObserver();
  }

  private setupInitialStyles() {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'filter', 'blur(5px)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)');
    
    if (this._config.delay) {
      this.renderer.setStyle(this.el.nativeElement, 'transition-delay', `${this._config.delay}ms`);
    }

    let transform = 'translateY(30px)'; // default 'up'
    if (this._config.direction === 'left') {
      transform = 'translateX(30px)';
    } else if (this._config.direction === 'right') {
      transform = 'translateX(-30px)';
    } else if (this._config.direction === 'down') {
      transform = 'translateY(-30px)';
    }

    this.renderer.setStyle(this.el.nativeElement, 'transform', transform);
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
          this.renderer.setStyle(this.el.nativeElement, 'filter', 'blur(0)');
          this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate(0)');
          this.observer.unobserve(this.el.nativeElement);
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
