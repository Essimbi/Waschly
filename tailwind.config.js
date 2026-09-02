/** @type {import('tailwindcss').Config} */

/**
 * ══════════════════════════════════════════════════════════════
 *  WASCHLY — DESIGN TOKEN REFERENCE
 *  This file is the single source of truth for all design tokens.
 *  All modules (client, washer, admin) must derive from these values.
 * ══════════════════════════════════════════════════════════════
 *
 *  PALETTE: Single-family desaturated corporate blue (hue 214°)
 *  —————————————————————————————————————————————————————————————
 *  Replaces the previous sky/slate split. One brand color family,
 *  with enough lightness range for backgrounds, text, and CTAs.
 *
 *  WCAG AA contrast ratios (on #FFFFFF white background):
 *    accent-500 (#2F67B1)  →  5.12:1  ✓ AA (body text, links)
 *    accent-600 (#205497)  →  6.83:1  ✓ AA/AAA (buttons, strong text)
 *    accent-700 (#174280)  →  9.42:1  ✓ AAA
 *    White on accent-500   →  5.12:1  ✓ AA
 *    White on accent-600   →  6.83:1  ✓ AA/AAA
 *
 *  SHADOWS: Multi-layer, on-brand color (accent-800 = #0F2D58)
 *  —————————————————————————————————————————————————————————————
 *  Near shadow (proximity):  y=1-4,  blur=3-8,   opacity=0.04
 *  Far shadow (diffuse):     y=8-24, blur=24-48, opacity=0.06-0.10
 *
 *  BORDER RADIUS SCALE:
 *  —————————————————————————————————————————————————————————————
 *  xs  = rounded-lg   (8px)  → chips, small tags
 *  sm  = rounded-xl   (12px) → inputs, badges, nav items
 *  md  = rounded-2xl  (16px) → buttons, cards
 *  lg  = rounded-3xl  (24px) → modals, bottom sheets, large cards
 *  pill= rounded-full        → avatars, pills, toggle
 *
 *  ANIMATION STANDARD:
 *  —————————————————————————————————————————————————————————————
 *  Duration: 200ms (fast), 300ms (base), 400ms (enter), 500ms (page)
 *  Easing: cubic-bezier(0.16, 1, 0.3, 1) — spring-like ease-out
 *  Reference: ToastComponent animation (300ms ease-out) as baseline.
 */

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // ─── Color Palette ─────────────────────────────────────────────────
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        'text-main': 'var(--color-text-main)',
        'text-muted': 'var(--color-text-muted)',
        
        accent: {
          50:  '#EEF4FF',  // hsl(214, 100%, 97%) — page tint, lightest bg
          100: '#D5E5FB',  // hsl(214, 88%, 91%)  — hover bg, badge bg
          200: '#A8C9F0',  // hsl(214, 72%, 81%)  — tinted borders
          300: '#6FA5DC',  // hsl(214, 60%, 70%)  — decorative, disabled
          400: '#4082C6',  // hsl(214, 52%, 51%)  — secondary interactive
          500: '#2F67B1',  // hsl(214, 58%, 44%)  — links, text (5.1:1 AA ✓)
          600: '#205497',  // hsl(214, 65%, 36%)  — primary CTA (6.8:1 AA ✓)
          700: '#174280',  // hsl(214, 68%, 30%)  — hover CTA, dark text
          800: '#0F2D58',  // hsl(214, 70%, 21%)  — shadow color base
          900: '#091D3A',  // hsl(214, 70%, 14%)  — darkest brand text
        },
        primary: {
          50:  '#EEF4FF',
          100: '#D5E5FB',
          200: '#A8C9F0',
          300: '#6FA5DC',
          400: '#4082C6',
          500: '#2F67B1',
          600: '#205497',
          700: '#174280',
          800: '#0F2D58',
          900: '#091D3A',
        },
      },

      // ─── Shadow Tokens ─────────────────────────────────────────────────
      // Multi-layer soft shadows. Shadow color derives from accent-800
      // (#0F2D58 = rgb(15,45,88)) for on-brand, warm depth.
      boxShadow: {
        'soft-xs': '0 1px 2px rgba(15, 45, 88, 0.04)',
        'soft-sm': [
          '0 1px 3px rgba(15, 45, 88, 0.04)',
          '0 4px 12px rgba(15, 45, 88, 0.06)',
        ].join(', '),
        'soft-md': [
          '0 2px 4px rgba(15, 45, 88, 0.04)',
          '0 8px 24px rgba(15, 45, 88, 0.07)',
        ].join(', '),
        'soft-lg': [
          '0 4px 8px rgba(15, 45, 88, 0.04)',
          '0 12px 32px rgba(15, 45, 88, 0.09)',
        ].join(', '),
        'soft-xl': [
          '0 8px 16px rgba(15, 45, 88, 0.04)',
          '0 24px 48px rgba(15, 45, 88, 0.10)',
        ].join(', '),
        // Sidebar: lateral shadow only (no top/bottom bleed)
        'sidebar-r': '4px 0 20px rgba(15, 45, 88, 0.06)',
        // Overlay/modal/toast
        'overlay': [
          '0 4px 8px rgba(15, 45, 88, 0.06)',
          '0 16px 40px rgba(15, 45, 88, 0.10)',
        ].join(', '),
        // Interactive card hover state
        'card-hover': [
          '0 4px 8px rgba(15, 45, 88, 0.05)',
          '0 16px 40px rgba(15, 45, 88, 0.09)',
        ].join(', '),
      },

      // ─── Animation Tokens ──────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up':          'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':          'fade-in 0.3s ease-out both',
        'slide-in-right':   'slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left':    'slide-in-left 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
