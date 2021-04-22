import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { MechanismeCriteria } from "../models/mechanisme.criteria";
import { Mechanisme } from "../models/mechanisme.model";

import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class MechanismeService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveMechanisme(mechanisme: Mechanisme): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/mechanisme`, mechanisme);
    }

    updateMechanisme(mechanisme: Mechanisme): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/mechanisme/${mechanisme.id}`, mechanisme);
    }

    getMechanisme( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Mechanisme> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/mechanisme/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }
    getMechanismeList():  Observable<Array<Mechanisme>> {
      return this.authHttp.get(this.settings.server.url + `/mechanisme`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }


    deleteMechanisme(mechanismeListForDelete: Array<Mechanisme>) {

        return this.authHttp.delete(this.settings.server.url + `/mechanisme/delete`, {body : mechanismeListForDelete})
    }

    findMinimalMechanismesByCriteria(mechanismeCriteria: MechanismeCriteria): Observable<Array<Mechanisme>> {
        return this.authHttp.post(this.settings.server.url + `/mechanisme/minlistByCriteria`, mechanismeCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findMechanismesByCriteria(mechanismeCriteria: MechanismeCriteria): Observable<Array<Mechanisme>> {
        return this.authHttp.post(this.settings.server.url + `/mechanisme/listByCriteria`, mechanismeCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listMechanismes(mechanismeCriteria: MechanismeCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/mechanisme/paginatedListByCriteria`, mechanismeCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getMechanismesDataSize(mechanismeCriteria: MechanismeCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/mechanisme/getMechanismesDataSize`, mechanismeCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportMechanismes( mechanismeCriteria: MechanismeCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/mechanisme/exportMechanismes/`, mechanismeCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
