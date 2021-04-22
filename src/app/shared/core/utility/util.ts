
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest  } from "@angular/common/http";

export function interpolate( expr: string, params?: any ): string {
    if ( typeof expr !== 'string' || !params ) {
        return expr;
    }

    return expr.replace( this.templateMatcher, ( substring: string, b: string ) => {
        const r = this.getValue( params, b );
        return isDefined( r ) ? r : substring;
    });
}

export function getValue( target: any, key: string ): string {
    const keys = key.split( '.' );
    key = '';
    do {
        key += keys.shift();
        if ( isDefined( target ) && isDefined( target[key] ) && ( typeof target[key] === 'object' || !keys.length ) ) {
            target = target[key];
            key = '';
        } else if ( !keys.length ) {
            target = undefined;
        } else {
            key += '.';
        }
    } while ( keys.length );

    return target;
}

export function equals( o1: any, o2: any ): boolean {
    if ( o1 === o2 ) return true;
    if ( o1 === null || o2 === null ) return false;
    if ( o1 !== o1 && o2 !== o2 ) return true; // NaN === NaN
    let t1 = typeof o1, t2 = typeof o2, length: number, key: any, keySet: any;
    if ( t1 == t2 && t1 == 'object' ) {
        if ( Array.isArray( o1 ) ) {
            if ( !Array.isArray( o2 ) ) return false;
            if ( ( length = o1.length ) == o2.length ) {
                for ( key = 0; key < length; key++ ) {
                    if ( !equals( o1[key], o2[key] ) ) return false;
                }
                return true;
            }
        } else {
            if ( Array.isArray( o2 ) ) {
                return false;
            }
            keySet = Object.create( null );
            for ( key in o1 ) {
                if ( !equals( o1[key], o2[key] ) ) {
                    return false;
                }
                keySet[key] = true;
            }
            for ( key in o2 ) {
                if ( !( key in keySet ) && typeof o2[key] !== 'undefined' ) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}
/* tslint:enable */

export function isDefined( value: any ): boolean {
    return typeof value !== 'undefined' && value !== null;
}


    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
    };
    
export function getFromLocalURL( http : HttpClient, url: string ): Observable<Response> {
    return http.get<Response>( `./app`+ url, httpOptions );
}
export function getNativeWindow(){
    return window;
}
