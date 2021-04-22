import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { VarieteCriteria } from "../models/variete.criteria";
import { Variete } from "../models/variete.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class VarieteService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveVariete(variete: Variete): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/variete`, variete);
    }

    updateVariete(variete: Variete): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/variete/${variete.id}`, variete);
    }

    getVariete( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Variete> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/variete/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }
    getVarieteList():  Observable<Array<Variete>> {
      return this.authHttp.get(this.settings.server.url + `/variete`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    deleteVariete(varieteListForDelete: Array<Variete>) {

        return this.authHttp.delete(this.settings.server.url + `/variete/delete`, {body : varieteListForDelete})
    }

    findMinimalVarietesByCriteria(varieteCriteria: VarieteCriteria): Observable<Array<Variete>> {
        return this.authHttp.post(this.settings.server.url + `/variete/minlistByCriteria`, varieteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findVarietesByCriteria(varieteCriteria: VarieteCriteria): Observable<Array<Variete>> {
        return this.authHttp.post(this.settings.server.url + `/variete/listByCriteria`, varieteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listVarietes(varieteCriteria: VarieteCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/variete/paginatedListByCriteria`, varieteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getVarietesDataSize(varieteCriteria: VarieteCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/variete/getVarietesDataSize`, varieteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportVarietes( varieteCriteria: VarieteCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/variete/exportVarietes/`, varieteCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
