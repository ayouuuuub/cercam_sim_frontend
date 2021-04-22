import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { CommuneCriteria } from "../models/commune.criteria";
import { Commune } from "../models/commune.model";
import { PaginatedList } from "../models/paginated-list";
import { Province } from "../models/province.model";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class CommuneService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveCommune(commune: Commune): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/commune`, commune);
    }

    updateCommune(commune: Commune): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/commune/${commune.id}`, commune);
    }

    getCommune(id: number): Observable<Commune> {
        return this.authHttp.get(this.settings.server.url + `/commune/${id}`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    deleteCommune(communeListForDelete: Array<Commune>) {

        return this.authHttp.delete(this.settings.server.url + `/commune/delete`, {body : communeListForDelete})
    }

    findMinimalCommunesByCriteria(communeCriteria: CommuneCriteria): Observable<Array<Commune>> {
        return this.authHttp.post(this.settings.server.url + `/commune/minlistByCriteria`, communeCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findCommunesByCriteria(communeCriteria: CommuneCriteria): Observable<Array<Commune>> {
        return this.authHttp.post(this.settings.server.url + `/commune/listByCriteria`, communeCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listCommunes(communeCriteria: CommuneCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/commune/paginatedListByCriteria`, communeCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getCommunesDataSize(communeCriteria: CommuneCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/commune/getCommunesDataSize`, communeCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportCommunes( communeCriteria: CommuneCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/commune/exportCommunes/`,  communeCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }

    getNextOrdre(): Observable<number> {
        return this.authHttp.get(this.settings.server.url + `/commune/getNextOrdre`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getProvinceList(): Observable<Array<Province>> {
        return this.authHttp.get(this.settings.server.url + `/commune/getProvinceList`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

}
