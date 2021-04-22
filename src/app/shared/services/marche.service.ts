import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { MarcheCriteria } from "../models/marche.criteria";
import { Marche } from "../models/marche.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class MarcheService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveMarche(marche: Marche): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/marche`, marche);
    }

    updateMarche(marche: Marche): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/marche/${marche.id}`, marche);
    }

    getMarche( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Marche> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/marche/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    getMarcheList():  Observable<Array<Marche>> {
      return this.authHttp.get(this.settings.server.url + `/marche`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }
    deleteMarche(marcheListForDelete: Array<Marche>) {

        return this.authHttp.delete(this.settings.server.url + `/marche/delete`, {body : marcheListForDelete})
    }

    findMinimalMarchesByCriteria(marcheCriteria: MarcheCriteria): Observable<Array<Marche>> {
        return this.authHttp.post(this.settings.server.url + `/marche/minlistByCriteria`, marcheCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findMarchesByCriteria(marcheCriteria: MarcheCriteria): Observable<Array<Marche>> {
        return this.authHttp.post(this.settings.server.url + `/marche/listByCriteria`, marcheCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listMarches(marcheCriteria: MarcheCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/marche/paginatedListByCriteria`, marcheCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getMarchesDataSize(marcheCriteria: MarcheCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/marche/getMarchesDataSize`, marcheCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportMarches( marcheCriteria: MarcheCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/marche/exportMarches/`, marcheCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
