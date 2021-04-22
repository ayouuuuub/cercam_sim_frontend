import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { CercleCriteria } from "../models/cercle.criteria";
import { Cercle } from "../models/cercle.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class CercleService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveCercle(cercle: Cercle): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/cercle`, cercle);
    }

    updateCercle(cercle: Cercle): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/cercle/${cercle.id}`, cercle);
    }

    getCercle( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Cercle> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/cercle/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    deleteCercle(cercleListForDelete: Array<Cercle>) {

        return this.authHttp.delete(this.settings.server.url + `/cercle/delete`, {body : cercleListForDelete})
    }

    findMinimalCerclesByCriteria(cercleCriteria: CercleCriteria): Observable<Array<Cercle>> {
        return this.authHttp.post(this.settings.server.url + `/cercle/minlistByCriteria`, cercleCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findCerclesByCriteria(cercleCriteria: CercleCriteria): Observable<Array<Cercle>> {
        return this.authHttp.post(this.settings.server.url + `/cercle/listByCriteria`, cercleCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listCercles(cercleCriteria: CercleCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/cercle/paginatedListByCriteria`, cercleCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getCerclesDataSize(cercleCriteria: CercleCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/cercle/getCerclesDataSize`, cercleCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportCercles( cercleCriteria: CercleCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/cercle/exportCercles/`, cercleCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
