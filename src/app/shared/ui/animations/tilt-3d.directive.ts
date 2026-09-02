import { Directive, ElementRef, HostListener, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appTilt3D]',
  standalone: true
})
export class Tilt3DDirective implements OnInit {
  @Input() tiltMax = 15;
  @Input() glare = true;

  private readonly perspective = 1000;
  private readonly scale = 1.05;
  private glareElement?: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.1s ease-out');
    this.renderer.setStyle(this.el.nativeElement, 'transform-style', 'preserve-3d');
    
    // Position relative is required to contain the absolute glare element
    const currentPosition = getComputedStyle(this.el.nativeElement).position;
    if (currentPosition === 'static') {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    }

    if (this.glare) {
      this.glareElement = this.renderer.createElement('div');
      this.renderer.setStyle(this.glareElement, 'position', 'absolute');
      this.renderer.setStyle(this.glareElement, 'top', '0');
      this.renderer.setStyle(this.glareElement, 'left', '0');
      this.renderer.setStyle(this.glareElement, 'width', '100%');
      this.renderer.setStyle(this.glareElement, 'height', '100%');
      this.renderer.setStyle(this.glareElement, 'opacity', '0');
      this.renderer.setStyle(this.glareElement, 'pointer-events', 'none');
      this.renderer.setStyle(this.glareElement, 'transition', 'opacity 0.5s ease');
      this.renderer.setStyle(this.glareElement, 'border-radius', 'inherit'); // Match parent's border radius
      this.renderer.setStyle(this.glareElement, 'z-index', '10');
      
      this.renderer.appendChild(this.el.nativeElement, this.glareElement);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    requestAnimationFrame(() => {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotate values
      const rotateX = ((y - centerY) / centerY) * -this.tiltMax;
      const rotateY = ((x - centerX) / centerX) * this.tiltMax;

      const transform = `perspective(${this.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.scale}, ${this.scale}, ${this.scale})`;
      this.renderer.setStyle(this.el.nativeElement, 'transform', transform);

      if (this.glare && this.glareElement) {
        const percentageX = (x / rect.width) * 100;
        const percentageY = (y / rect.height) * 100;
        const bg = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`;
        
        this.renderer.setStyle(this.glareElement, 'background', bg);
        this.renderer.setStyle(this.glareElement, 'opacity', '1');
      }
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    requestAnimationFrame(() => {
      // Smoothly transition back to original state
      this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.5s ease-out');
      this.renderer.setStyle(this.el.nativeElement, 'transform', `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
      
      if (this.glare && this.glareElement) {
        this.renderer.setStyle(this.glareElement, 'transition', 'opacity 0.5s ease');
        this.renderer.setStyle(this.glareElement, 'opacity', '0');
      }

      // Reset transition to faster one after resetting position is complete
      setTimeout(() => {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.1s ease-out');
      }, 500);
    });
  }
}
