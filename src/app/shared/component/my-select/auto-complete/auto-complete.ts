import { HttpClient } from "@angular/common/http";
import { Injectable, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

/**
 * provides auto-complete related utility functions
 */
@Injectable()
export class NguiAutoComplete {

    public source: string;
    public pathToData: string;
    public listFormatter: ( arg: any ) => string;

    constructor( @Optional() private http: HttpClient ) {
        // ...
    }

    filter( list: any[], keyword: string, matchFormatted: boolean, key: string ) {
        return list.filter( el => {
            const str=el[key].toLowerCase();
            keyword=(keyword && keyword.trim() ) ? keyword.trim(): keyword;
            ////console.log(str," ",keyword.toLowerCase()," resulta ",str.indexOf(keyword.toLowerCase()));
            if ( el ) {
                if ( !keyword ) {
                    const objStr = matchFormatted ? this.getFormattedListItem( el ).toLowerCase() : JSON.stringify( el ).toLowerCase();
                    return objStr.indexOf( keyword ) !== -1;
                }
                if ( !key ) {
                    const objStr = matchFormatted ? this.getFormattedListItem( el ).toLowerCase() : JSON.stringify( el ).toLowerCase();

                    return objStr.indexOf( keyword ) !== -1;
                } else { 
                    if ( el[key] && keyword && el[key].length > 0 && keyword.length > 0 ){
                        let str1=el[key].toLowerCase();
                        let str2=keyword.toLowerCase();
                            if( str1 && str2 && str1.length > 0 && str2.length > 0){

                                str1=str1.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                                str2=str2.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                                if(str1 && str2 && str1.length > 0 && str2.length > 0) return str1.indexOf( str2 )!==-1
                                else return el[key].indexOf( keyword ) !== -1;

                            }else return el[key].indexOf( keyword ) !== -1; 

                    }else return el[key].indexOf( keyword ) !== -1;
                }

            }

        }
        );
    }

    getFormattedListItem( data: any ) {
        let formatted;
        const formatter = this.listFormatter || '(id) value';
        if ( typeof formatter === 'function' ) {
            formatted = formatter.apply( this, [data] );
        } else if ( typeof data !== 'object' ) {
            formatted = data;
        } else if ( typeof formatter === 'string' ) {
            formatted = formatter;
            const matches = formatter.match( /[a-zA-Z0-9_\$]+/g );
            if ( matches && typeof data !== 'string' ) {
                matches.forEach( key => {
                    formatted = formatted.replace( key, data[key] );
                });
            }
        }
        return formatted;
    }

    /**
     * return remote data from the given source and options, and data path
     */
    getRemoteData( keyword: string ): Observable<Response> {
        if ( this.source ) {
            if ( typeof this.source !== 'string' ) {
                throw "Invalid type of source, must be a string. e.g. http://www.google.com?q=:my_keyword";
            } else if ( !this.http ) {
                throw "Http is required.";
            }

            const matches = this.source.match( /:[a-zA-Z_]+/ );
            if ( matches === null ) {
                throw "Replacement word is missing.";
            }

            const replacementWord = matches[0];
            const url = this.source.replace( replacementWord, keyword );

            return this.http.get( url )
                .pipe(map( resp => JSON.stringify(resp) )
                ,map( resp => {
                    let list = JSON.parse(resp).data || resp;

                    if ( this.pathToData ) {
                        const paths = this.pathToData.split( "." );
                        paths.forEach( prop => list = list[prop] );
                    }

                    return list;
                }));
        }
        
        return null;
    }
}

