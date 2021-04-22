
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { TranslatorService } from 'src/app/shared/core/translator/translator.service';
import { getValue } from 'src/app/shared/core/utility/util';

@Injectable()
export class TranslateService {

    defaultLanguage: string;
    _translations: any

    constructor( private http : HttpClient, private translator: TranslatorService ) {
        this.defaultLanguage = translator.defaultLanguage;
        this.translateModule();
    }


	private translateModule() {
      return this.http.get('./assets/i18n/utilisateur-lang-fr.json')
        .pipe(map(res => JSON.parse(JSON.stringify(res))))
        .subscribe(
            data => this._translations = data,
            err => console.log(err)
        );
  }

    public use( lang: string ): void {
        this.defaultLanguage = lang;
    }

    public instant( key: string ) {

        return getValue( this._translations, key );
    }

}
