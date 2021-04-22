import { Injectable } from "@angular/core";

import { HttpResponse, HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { FileUploader } from "ng2-file-upload";
import { AuthHttpService } from "../../services/auth-http.service";
import { SettingsService } from "../../services/settings.service";

@Injectable()
export class UtilityService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    getCurrentDate(): Observable<string> {
        return this.authHttp.get(this.settings.server.url + `/utility/getCurrentDate`)
            .pipe(map((res: Response) =>  res['_body']));
    }

    getMyDate(): Observable<any> {
        return this.authHttp.get(this.settings.server.url + `/utility/getMyDate`)
            .pipe(map((res: Response) => res));
    }

    uploadFile(): FileUploader {
        return new FileUploader( {
            url: this.settings.server.url + `/utility/uploadFile`,
            headers: [{ name: 'Authorization', value: 'Bearer ' + localStorage.getItem( 'jwt' ) }]
        });
    }
    uploadFileWmc(): FileUploader {
        return new FileUploader( {
            url: this.settings.server.url + `/indicateur/uploadWMC`,
            headers: [{ name: 'Authorization', value: 'Bearer ' + localStorage.getItem( 'jwt' ) }]
        });
    }

    uploadImage(): FileUploader {

        return new FileUploader( {
            url: this.settings.server.url + `/utility/uploadImage`,
            headers: [{ name: 'Authorization', value: 'Bearer ' + localStorage.getItem( 'jwt' ) }]
        });
    }
    downloadImage(data:any): Observable<Blob> {
      return this.authHttp.blobPost(this.settings.server.url + `/utility/downloadImage`, data, { responseType : 'blob'  as 'json' });
    }

    downloadTempImage(data:any): Observable<Blob> {
      return this.authHttp.blobPost(this.settings.server.url + `/utility/downloadTempImage`, data, { responseType : 'blob'  as 'json' });
    }
    uploadNewlogo(): FileUploader {

      return new FileUploader( {
          url: this.settings.server.url + `/parametrage/uploadLogo`,
          headers: [{ name: 'Authorization', value: 'Bearer ' + localStorage.getItem( 'jwt' ) }],

      });
  }

    uploadLogoMinistere() {
      return new FileUploader( {
        url: this.settings.server.url + `/utility/uploadLogoMinistre`,
        headers: [{ name: 'Authorization', value: 'Bearer ' + localStorage.getItem( 'jwt' ) }]
      });
    }

    uploadLogoMinistreLogin() {
      return new FileUploader( {
        url: this.settings.server.url + `/utility/uploadLogoMinistreLogin`,
        headers: [{ name: 'Authorization', value: 'Bearer ' + localStorage.getItem( 'jwt' ) }]
      });
    }

    uploadLogoMinistreEntete() {
      return new FileUploader( {
        url: this.settings.server.url + `/utility/uploadLogoMinistreEntete `,
        headers: [{ name: 'Authorization', value: 'Bearer ' + localStorage.getItem( 'jwt' ) }]
      });
    }

     getNativeWindow(){
        return window;
    }
}
