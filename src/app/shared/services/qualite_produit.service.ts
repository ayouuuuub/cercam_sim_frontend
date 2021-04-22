import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { QualiteProduitCriteria } from "../models/qualite_produit.criteria";
import { QualiteProduit } from "../models/qualite_produit.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class QualiteProduitService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveQualiteProduit(qualiteProduit: QualiteProduit): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/qualiteProduit`, qualiteProduit);
    }

    updateQualiteProduit(qualiteProduit: QualiteProduit): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/qualiteProduit/${qualiteProduit.id}`, qualiteProduit);
    }

    getQualiteProduit( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<QualiteProduit> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/qualiteProduit/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }
    getQualiteProduitList():  Observable<Array<QualiteProduit>> {
      return this.authHttp.get(this.settings.server.url + `/qualiteProduit`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    deleteQualiteProduit(qualiteProduitListForDelete: Array<QualiteProduit>) {

        return this.authHttp.delete(this.settings.server.url + `/qualiteProduit/delete`, {body : qualiteProduitListForDelete})
    }

    findMinimalQualiteProduitsByCriteria(qualiteProduitCriteria: QualiteProduitCriteria): Observable<Array<QualiteProduit>> {
        return this.authHttp.post(this.settings.server.url + `/qualiteProduit/minlistByCriteria`, qualiteProduitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findQualiteProduitsByCriteria(qualiteProduitCriteria: QualiteProduitCriteria): Observable<Array<QualiteProduit>> {
        return this.authHttp.post(this.settings.server.url + `/qualiteProduit/listByCriteria`, qualiteProduitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listQualiteProduits(qualiteProduitCriteria: QualiteProduitCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/qualiteProduit/paginatedListByCriteria`, qualiteProduitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getQualiteProduitsDataSize(qualiteProduitCriteria: QualiteProduitCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/qualiteProduit/getQualiteProduitsDataSize`, qualiteProduitCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportQualiteProduits( qualiteProduitCriteria: QualiteProduitCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/qualiteProduit/exportQualiteProduits/`, qualiteProduitCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
