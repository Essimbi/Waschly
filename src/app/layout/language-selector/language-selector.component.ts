import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block text-left">
      <select 
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        [value]="currentLocale"
        (change)="changeLanguage($event)"
      >
        <option *ngFor="let lang of languages" [value]="lang.code">
          {{ lang.label }}
        </option>
      </select>
    </div>
  `
})
export class LanguageSelectorComponent {
  languages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];

  constructor(@Inject(LOCALE_ID) public currentLocale: string) {}

  changeLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    const locale = select.value;
    
    // In a standard Angular i18n setup, we redirect to the specific base href
    // e.g., /de/, /en/, /fr/
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(new RegExp(`^/(${this.languages.map(l => l.code).join('|')})?`), `/${locale}`);
    window.location.href = newPath;
  }
}
