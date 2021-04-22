import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class TranslatorService {

  defaultLanguage = 'fr';
  availablelangs: any;

  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    console.log(this.defaultLanguage);
    translate.setDefaultLang(this.defaultLanguage);

    this.availablelangs = [
      {code: 'fr', text: 'French'}
    ];

    this.useLanguage();

  }

  useLanguage(lang: string = this.defaultLanguage) {
    this.translate.use(lang);
  }

  getAvailableLanguages() {
    return this.availablelangs;
  }

  public instant( key: string ) {
      return this.translate.instant(key);
  }

}
