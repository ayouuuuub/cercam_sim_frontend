import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { map, catchError } from 'rxjs/operators';
import { Base64 } from '../core/utility/webtoolkit.base64';
import { AuthHttpService } from '../services/auth-http.service';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private settings: SettingsService,
    private authHttp: AuthHttpService,
    private router: Router) {
  }

  login( username: string, password: string ): Observable<boolean> {
    //this.logout();
    return this.authHttp.post( this.settings.oauth.url + this.settings.oauth.loginUrl,
            { username: username, password: password }
        )
        .pipe(
            map( this.extractData ),
            catchError( this.handleError )
        );
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

  removeToken(): void {
    localStorage.removeItem( 'access_token' );
    localStorage.removeItem( 'currentUser' );
    localStorage.removeItem( 'dateExpiration' );
    localStorage.clear();
    sessionStorage.clear();
}

logout(): void {
    this.removeToken();
    this.router.navigate( ['/login'] );
}
  private extractData( res: Response ) {

    const token = JSON.parse(JSON.stringify(res)).token;
    console.log();
    if ( token ) {
        localStorage.setItem( 'access_token', token );
        localStorage.setItem( 'currentUser', Base64.encode(JSON.stringify(JSON.parse(JSON.stringify(res)).user)));
    } else {
        this.removeToken();
    }
   return true;
  }
  private handleError( error: Response | any ) {
    let errMsg: string;
    switch ( error.status ) {
        case 401:
            errMsg = "login.message.badCredentials";
            break;
        case 0:
            errMsg = "accesServeur.message.error";
            break;
        default:
            errMsg = error.message ? error.message : error.toString();
    }
    return throwError( errMsg );
  }
}

