import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-background-particles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="particles-container fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-page transition-colors duration-300">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
      <div class="bubble bubble-4"></div>
      <div class="bubble bubble-5"></div>
      <div class="bubble bubble-6"></div>
    </div>
  `,
  styles: [`
    .particles-container {
      /* Base bg is handled by Tailwind bg-page */
    }
    
    .bubble {
      position: absolute;
      bottom: -100px;
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), rgba(173, 216, 230, 0.2), transparent);
      border-radius: 50%;
      opacity: 0.5;
      animation: rise 15s infinite ease-in;
    }

    /* Dark mode subtle bubbles */
    .dark .bubble {
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), rgba(30, 144, 255, 0.1), transparent);
      opacity: 0.3;
    }

    .bubble-1 { width: 40px; height: 40px; left: 10%; animation-duration: 12s; animation-delay: 0s; }
    .bubble-2 { width: 80px; height: 80px; left: 30%; animation-duration: 18s; animation-delay: 2s; }
    .bubble-3 { width: 20px; height: 20px; left: 50%; animation-duration: 10s; animation-delay: 5s; }
    .bubble-4 { width: 60px; height: 60px; left: 70%; animation-duration: 15s; animation-delay: 1s; }
    .bubble-5 { width: 30px; height: 30px; left: 85%; animation-duration: 11s; animation-delay: 4s; }
    .bubble-6 { width: 50px; height: 50px; left: 20%; animation-duration: 14s; animation-delay: 7s; }

    @keyframes rise {
      0% {
        bottom: -100px;
        transform: translateX(0);
      }
      50% {
        transform: translateX(20px);
      }
      100% {
        bottom: 110vh;
        transform: translateX(-20px);
      }
    }
  `]
})
export class BackgroundParticlesComponent {}
