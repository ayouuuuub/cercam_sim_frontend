import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { DensiteCriteria } from "../models/densite.criteria";
import { Densite } from "../models/densite.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class DensiteService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveDensite(densite: Densite): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/densite`, densite);
    }

    updateDensite(densite: Densite): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/densite/${densite.id}`, densite);
    }

    getDensite( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Densite> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/densite/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    deleteDensite(densiteListForDelete: Array<Densite>) {

        return this.authHttp.delete(this.settings.server.url + `/densite/delete`, {body : densiteListForDelete})
    }

    findMinimalDensitesByCriteria(densiteCriteria: DensiteCriteria): Observable<Array<Densite>> {
        return this.authHttp.post(this.settings.server.url + `/densite/minlistByCriteria`, densiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findDensitesByCriteria(densiteCriteria: DensiteCriteria): Observable<Array<Densite>> {
        return this.authHttp.post(this.settings.server.url + `/densite/listByCriteria`, densiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listDensites(densiteCriteria: DensiteCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/densite/paginatedListByCriteria`, densiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getDensitesDataSize(densiteCriteria: DensiteCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/densite/getDensitesDataSize`, densiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportDensites( densiteCriteria: DensiteCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/densite/exportDensites/`, densiteCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
