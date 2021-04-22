import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { TechniciteCriteria } from "../models/technicite.criteria";
import { Technicite } from "../models/technicite.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class TechniciteService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveTechnicite(technicite: Technicite): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/technicite`, technicite);
    }

    updateTechnicite(technicite: Technicite): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/technicite/${technicite.id}`, technicite);
    }

    getTechnicite( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Technicite> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/technicite/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    getTechniciteList():  Observable<Array<Technicite>> {
      return this.authHttp.get(this.settings.server.url + `/technicite`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }
    deleteTechnicite(techniciteListForDelete: Array<Technicite>) {

        return this.authHttp.delete(this.settings.server.url + `/technicite/delete`, {body : techniciteListForDelete})
    }

    findMinimalTechnicitesByCriteria(techniciteCriteria: TechniciteCriteria): Observable<Array<Technicite>> {
        return this.authHttp.post(this.settings.server.url + `/technicite/minlistByCriteria`, techniciteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findTechnicitesByCriteria(techniciteCriteria: TechniciteCriteria): Observable<Array<Technicite>> {
        return this.authHttp.post(this.settings.server.url + `/technicite/listByCriteria`, techniciteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listTechnicites(techniciteCriteria: TechniciteCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/technicite/paginatedListByCriteria`, techniciteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getTechnicitesDataSize(techniciteCriteria: TechniciteCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/technicite/getTechnicitesDataSize`, techniciteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportTechnicites( techniciteCriteria: TechniciteCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/technicite/exportTechnicites/`, techniciteCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
