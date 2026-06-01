import { Injectable, signal, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<'en' | 'ar'>('en');

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') as 'en' | 'ar';
    const initialLang = savedLang || 'en';
    
    this.currentLang.set(initialLang);
    this.translate.setDefaultLang('en');
    this.translate.use(initialLang);

    // Update document direction and language code
    effect(() => {
      const lang = this.currentLang();
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
    });
  }

  toggleLanguage() {
    this.currentLang.update(l => l === 'en' ? 'ar' : 'en');
  }

  setLanguage(lang: 'en' | 'ar') {
    this.currentLang.set(lang);
  }
}
