import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { FamilleProduitCriteria } from "../models/famille_produit.criteria";
import { FamilleProduit } from "../models/famille_produit.model";
import { PaginatedList } from "../models/paginated-list";
import { Province } from "../models/province.model";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class FamilleProduitService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveFamilleProduit(familleProduit: FamilleProduit): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/familleProduit`, familleProduit);
    }

    updateFamilleProduit(familleProduit: FamilleProduit): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/familleProduit/${familleProduit.id}`, familleProduit);
    }

    getFamilleProduit(id: number): Observable<FamilleProduit> {
        return this.authHttp.get(this.settings.server.url + `/familleProduit/${id}`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }
    getFamilleProduitList():  Observable<Array<FamilleProduit>> {
      return this.authHttp.get(this.settings.server.url + `/familleProduit`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    deleteFamilleProduit(familleProduitListForDelete: Array<FamilleProduit>) {

        return this.authHttp.delete(this.settings.server.url + `/familleProduit/delete`, {body : familleProduitListForDelete})
    }

    findFamilleProduitsByCriteria(familleProduitCriteria?: FamilleProduitCriteria): Observable<Array<FamilleProduit>> {
        return this.authHttp.post(this.settings.server.url + `/familleProduit/listByCriteria`, familleProduitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listFamilleProduits(familleProduitCriteria: FamilleProduitCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/familleProduit/paginatedListByCriteria`, familleProduitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getFamilleProduitsDataSize(familleProduitCriteria: FamilleProduitCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/familleProduit/getFamilleProduitsDataSize`, familleProduitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportFamilleProduits( familleProduitCriteria: FamilleProduitCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/familleProduit/exportFamilleProduits/`,  familleProduitCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }

    getNextOrdre(): Observable<number> {
        return this.authHttp.get(this.settings.server.url + `/familleProduit/getNextOrdre`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getProvinceList(): Observable<Array<Province>> {
        return this.authHttp.get(this.settings.server.url + `/familleProduit/getProvinceList`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

}
