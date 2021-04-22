import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ValorisationCriteria } from "../models/valorisation.criteria";
import { Valorisation } from "../models/valorisation.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class ValorisationService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveValorisation(valorisation: Valorisation): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/valorisation`, valorisation);
    }

    updateValorisation(valorisation: Valorisation): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/valorisation/${valorisation.id}`, valorisation);
    }

    getValorisation( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Valorisation> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/valorisation/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }
    getValorisationList():  Observable<Array<Valorisation>> {
      return this.authHttp.get(this.settings.server.url + `/valorisation`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    deleteValorisation(valorisationListForDelete: Array<Valorisation>) {

        return this.authHttp.delete(this.settings.server.url + `/valorisation/delete`, {body : valorisationListForDelete})
    }

    findMinimalValorisationsByCriteria(valorisationCriteria: ValorisationCriteria): Observable<Array<Valorisation>> {
        return this.authHttp.post(this.settings.server.url + `/valorisation/minlistByCriteria`, valorisationCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findValorisationsByCriteria(valorisationCriteria: ValorisationCriteria): Observable<Array<Valorisation>> {
        return this.authHttp.post(this.settings.server.url + `/valorisation/listByCriteria`, valorisationCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listValorisations(valorisationCriteria: ValorisationCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/valorisation/paginatedListByCriteria`, valorisationCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getValorisationsDataSize(valorisationCriteria: ValorisationCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/valorisation/getValorisationsDataSize`, valorisationCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportValorisations( valorisationCriteria: ValorisationCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/valorisation/exportValorisations/`, valorisationCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
