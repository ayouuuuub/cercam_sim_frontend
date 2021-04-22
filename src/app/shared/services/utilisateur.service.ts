import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { BusinessModel } from "../models/business-model";
import { PaginatedList } from "../models/paginated-list";
// import { BusinessModel } from "../models/business-model";
// import { IndicateurCriteria } from "../models/indicateur.criteria";
// import { Indicateur } from "../models/indicateur.model";
// import { PaginatedList } from "../models/paginated-list";
// import { Producteur } from "../models/producteur.model";
import { UtilisateurCriteria } from "../models/utilisateur.criteria";
import { Utilisateur } from "../models/utilisateur.model";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveUtilisateur(utilisateur: Utilisateur): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/utilisateur`, utilisateur);
    }

    updateUtilisateur(utilisateur: Utilisateur): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/utilisateur/${utilisateur.id}`, utilisateur);
    }

    getUtilisateur( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Utilisateur> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/utilisateur/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    deleteUtilisateur(utilisateurListForDelete: Array<Utilisateur>) {

        return this.authHttp.delete(this.settings.server.url + `/utilisateur/delete`, {body : utilisateurListForDelete})
    }

    findUtilisateursByCriteria(utilisateurCriteria: UtilisateurCriteria): Observable<Array<Utilisateur>> {
        return this.authHttp.post(this.settings.server.url + `/utilisateur/listByCriteria`, utilisateurCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listUtilisateurs(utilisateurCriteria: UtilisateurCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/utilisateur/paginatedListByCriteria`, utilisateurCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getUtilisateursDataSize(utilisateurCriteria: UtilisateurCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/utilisateur/getUtilisateursDataSize`, utilisateurCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportUtilisateurs( utilisateurCriteria: UtilisateurCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/utilisateur/exportUtilisateurs/`, utilisateurCriteria, { responseType: 'blob' })
            .pipe(map( res => res ));
    }


    getProfilList(): Observable<Array<BusinessModel>> {
        return this.authHttp.get(this.settings.server.url + `/utilisateur/getProfilList`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    resetUtilisateurPassword(id: number): Observable<Response> {
        return this.authHttp.get(this.settings.server.url + `/utilisateur/resetPassword/{id}`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    forgotPassword(email: string): Observable<Response> {
        return this.authHttp.get(this.settings.server.url + `/forgot-password/${email}/`)
            .pipe(map( res => res));
    }
    validatePasswordResetToken(token: string) : Observable<Utilisateur> {
        return this.authHttp.get(this.settings.server.url + `/utilisateur/getUserByToken/${token}/`)
            .pipe(map( res => res));
    }

    updateUtilisateurPassword(utilisateur: Utilisateur): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/utilisateur/changePassword/${utilisateur.id}`, (utilisateur));
    }

    findUtilisateurByCriteria(utilisateurCriteria: UtilisateurCriteria): Observable<Array<Utilisateur>> {
        return this.authHttp.post(this.settings.server.url + `/utilisateur/listByCriteria`, utilisateurCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }
    getPublicUser() :Observable<Utilisateur> {
        return this.authHttp.get(this.settings.server.url + `/utilisateur/publicUser`)
              .pipe(map(res => res));
    }

}
