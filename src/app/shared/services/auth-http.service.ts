import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

const mergeHeaders = (Reqoptions : any) =>{
    const httpHeaders = { headers: new HttpHeaders()
            .set('Authorization','Bearer '+ localStorage.getItem('jwt'))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
    }
    if(Reqoptions){
        for(const i in Reqoptions){
            httpHeaders[i]=Reqoptions[i];
        }
    }
    //console.log(httpHeaders);
        // httpHeaders['responseType'] = 'blob';
    return httpHeaders;
}


@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

    constructor(public http: HttpClient) {
    }


    get(url: string, options?: any): Observable<any> {
        return this.http.get<any>(url, mergeHeaders(options) );
    }

    post(url: string, body: any, options?: any): Observable<any> {
        return this.http.post<any>(url, JSON.stringify(body), mergeHeaders(options));
    }

    blobGet(url: string, options?: any): Observable<Blob> {
        return this.http.get<Blob>(url, mergeHeaders(options) );
    }
    blobPost(url: string, body: any, options?: any): Observable<Blob> {
        return this.http.post<Blob>(url, JSON.stringify(body), mergeHeaders(options));
    }

    put(url: string, body: any, options?: any): Observable<any> {

        return this.http.put<any>(url, JSON.stringify(body), mergeHeaders(options));
    }

    delete(url: string, options?: any): Observable<any> {
        // console.log(mergeHeaders(options));
        return this.http.request<any>('delete',url, mergeHeaders(options));
    }

    patch(url: string, body: any, options?: any): Observable<any> {
        return this.http.patch<any>(url, JSON.stringify(body), mergeHeaders(options));
    }

    head(url: string, options?: any): Observable<any> {
        return this.http.head<any>(url, mergeHeaders(options));
    }
    request(method: string,url: string, options?: any): Observable<any> {
        return this.http.request<any>(method, url, mergeHeaders(options));
    }
}
