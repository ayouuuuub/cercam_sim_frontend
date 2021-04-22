
import { Injectable } from '@angular/core';
import { isDefined, getValue, getFromLocalURL } from "../../../shared/utility/util";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { TranslatorService } from '../../../core/translator/translator.service';

@Injectable()
export class TranslateService {

    defaultLanguage: string;
    _translations: any

    constructor( private http : HttpClient, private translator: TranslatorService ) {
        this.defaultLanguage = translator.defaultLanguage;
        this.translateModule();
    }


	private translateModule() {
        return this.http.get('./assets/i18n/parametrage-lang-fr.json')
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
