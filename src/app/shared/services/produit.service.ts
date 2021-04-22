import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ProduitCriteria } from "../models/produit.criteria";
import { Produit } from "../models/produit.model";
import { PaginatedList } from "../models/paginated-list";
import { Province } from "../models/province.model";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class ProduitService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveProduit(produit: Produit): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/produit`, produit);
    }

    updateProduit(produit: Produit): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/produit/${produit.id}`, produit);
    }

    getProduit(id: number): Observable<Produit> {
        return this.authHttp.get(this.settings.server.url + `/produit/${id}`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    deleteProduit(produitListForDelete: Array<Produit>) {

        return this.authHttp.delete(this.settings.server.url + `/produit/delete`, {body : produitListForDelete})
    }

    findProduitsByCriteria(produitCriteria?: ProduitCriteria): Observable<Array<Produit>> {
        return this.authHttp.post(this.settings.server.url + `/produit/listByCriteria`, produitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listProduits(produitCriteria: ProduitCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/produit/paginatedListByCriteria`, produitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getProduitsDataSize(produitCriteria: ProduitCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/produit/getProduitsDataSize`, produitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportProduits( produitCriteria: ProduitCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/produit/exportProduits/`,  produitCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }

    getNextOrdre(): Observable<number> {
        return this.authHttp.get(this.settings.server.url + `/produit/getNextOrdre`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getProvinceList(): Observable<Array<Province>> {
        return this.authHttp.get(this.settings.server.url + `/produit/getProvinceList`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

}
