import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { de, TranslationKey } from './translations/de';
import { en } from './translations/en';

type Language = 'de' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'waschly_lang';
  
  // Signal holds the current language state
  public currentLang = signal<Language>('de');

  // Computed signal that returns the current translation dictionary
  public dict = computed(() => {
    return this.currentLang() === 'en' ? en : de;
  });

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initLang();
  }

  private initLang() {
    if (this.isBrowser) {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (stored === 'de' || stored === 'en') {
        this.currentLang.set(stored);
      } else {
        // Fallback to browser language if available
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'en') {
          this.currentLang.set('en');
        }
      }
    }
  }

  public setLanguage(lang: Language) {
    this.currentLang.set(lang);
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  public toggleLanguage() {
    this.setLanguage(this.currentLang() === 'de' ? 'en' : 'de');
  }

  /**
   * Retrieves a translation by dot notation path, e.g., 'hero.title1'
   */
  public t(path: string): string {
    const keys = path.split('.');
    let current: any = this.dict();

    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
      current = current[key];
    }

    return current as string;
  }
}
