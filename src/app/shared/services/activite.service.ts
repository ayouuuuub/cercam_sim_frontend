import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ActiviteCriteria } from "../models/activite.criteria";
import { Activite } from "../models/activite.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class ActiviteService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveActivite(activite: Activite): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/activite`, activite);
    }

    updateActivite(activite: Activite): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/activite/${activite.id}`, activite);
    }

    getActivite( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Activite> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/activite/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    deleteActivite(activiteListForDelete: Array<Activite>) {

        return this.authHttp.delete(this.settings.server.url + `/activite/delete`, {body : activiteListForDelete})
    }

    sumByRegion(activiteCriteria: ActiviteCriteria): Observable<Array<Activite>> {
      return this.authHttp.post(this.settings.server.url + `/activite/sumByRegion`, activiteCriteria)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    sumByProvince(activiteCriteria: ActiviteCriteria): Observable<Array<Activite>> {
        return this.authHttp.post(this.settings.server.url + `/activite/sumByProvince`, activiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    sumByCercle(activiteCriteria: ActiviteCriteria): Observable<Array<Activite>> {
        return this.authHttp.post(this.settings.server.url + `/activite/sumByCercle`, activiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    sumByCommune(activiteCriteria: ActiviteCriteria): Observable<Array<Activite>> {
        return this.authHttp.post(this.settings.server.url + `/activite/sumByCommune`, activiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findActivitesByCriteria(activiteCriteria: ActiviteCriteria): Observable<Array<Activite>> {
        return this.authHttp.post(this.settings.server.url + `/activite/listByCriteria`, activiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listActivites(activiteCriteria: ActiviteCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/activite/paginatedListByCriteria`, activiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getActivitesDataSize(activiteCriteria: ActiviteCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/activite/getActivitesDataSize`, activiteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportActivites( activiteCriteria: ActiviteCriteria ): Observable<any> {
        return this.authHttp.post( this.settings.server.url + `/activite/exportActivites/`, activiteCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
