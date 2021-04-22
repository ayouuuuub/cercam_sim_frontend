import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { CanalVenteCriteria } from "../models/canal_vente.criteria";
import { CanalVente } from "../models/canal_vente.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class CanalVenteService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveCanalVente(canalVente: CanalVente): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/canalVente`, canalVente);
    }

    updateCanalVente(canalVente: CanalVente): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/canalVente/${canalVente.id}`, canalVente);
    }

    getCanalVente( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<CanalVente> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/canalVente/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }
    getCanalVenteList():  Observable<Array<CanalVente>> {
      return this.authHttp.get(this.settings.server.url + `/canalVente`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    deleteCanalVente(canalVenteListForDelete: Array<CanalVente>) {

        return this.authHttp.delete(this.settings.server.url + `/canalVente/delete`, {body : canalVenteListForDelete})
    }

    findMinimalCanalVentesByCriteria(canalVenteCriteria: CanalVenteCriteria): Observable<Array<CanalVente>> {
        return this.authHttp.post(this.settings.server.url + `/canalVente/minlistByCriteria`, canalVenteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findCanalVentesByCriteria(canalVenteCriteria: CanalVenteCriteria): Observable<Array<CanalVente>> {
        return this.authHttp.post(this.settings.server.url + `/canalVente/listByCriteria`, canalVenteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listCanalVentes(canalVenteCriteria: CanalVenteCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/canalVente/paginatedListByCriteria`, canalVenteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getCanalVentesDataSize(canalVenteCriteria: CanalVenteCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/canalVente/getCanalVentesDataSize`, canalVenteCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportCanalVentes( canalVenteCriteria: CanalVenteCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/canalVente/exportCanalVentes/`, canalVenteCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
