import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { StabilitePrixCriteria } from "../models/stabilite_prix.criteria";
import { StabilitePrix } from "../models/stabilite_prix.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class StabilitePrixService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveStabilitePrix(stabilitePrix: StabilitePrix): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/stabilitePrix`, stabilitePrix);
    }

    updateStabilitePrix(stabilitePrix: StabilitePrix): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/stabilitePrix/${stabilitePrix.id}`, stabilitePrix);
    }

    getStabilitePrix( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<StabilitePrix> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/stabilitePrix/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    getStabilitePrixList():  Observable<Array<StabilitePrix>> {
      return this.authHttp.get(this.settings.server.url + `/stabilitePrix`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }
    deleteStabilitePrix(stabilitePrixListForDelete: Array<StabilitePrix>) {

        return this.authHttp.delete(this.settings.server.url + `/stabilitePrix/delete`, {body : stabilitePrixListForDelete})
    }

    findMinimalStabilitePrixsByCriteria(stabilitePrixCriteria: StabilitePrixCriteria): Observable<Array<StabilitePrix>> {
        return this.authHttp.post(this.settings.server.url + `/stabilitePrix/minlistByCriteria`, stabilitePrixCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findStabilitePrixsByCriteria(stabilitePrixCriteria: StabilitePrixCriteria): Observable<Array<StabilitePrix>> {
        return this.authHttp.post(this.settings.server.url + `/stabilitePrix/listByCriteria`, stabilitePrixCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listStabilitePrixs(stabilitePrixCriteria: StabilitePrixCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/stabilitePrix/paginatedListByCriteria`, stabilitePrixCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getStabilitePrixsDataSize(stabilitePrixCriteria: StabilitePrixCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/stabilitePrix/getStabilitePrixsDataSize`, stabilitePrixCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportStabilitePrixs( stabilitePrixCriteria: StabilitePrixCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/stabilitePrix/exportStabilitePrixs/`, stabilitePrixCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
