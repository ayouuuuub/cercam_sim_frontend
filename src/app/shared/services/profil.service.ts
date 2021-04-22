import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ProfilCriteria } from "../models/profil.criteria";
import { Profil } from "../models/profil.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class ProfilService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveProfil(profil: Profil): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/profil`, profil);
    }

    updateProfil(profil: Profil): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/profil/${profil.id}`, profil);
    }

    getProfil( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Profil> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/profil/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    deleteProfil(profilListForDelete: Array<Profil>) {

        return this.authHttp.delete(this.settings.server.url + `/profil/delete`, {body : profilListForDelete})
    }

    findMinimalProfilsByCriteria(profilCriteria: ProfilCriteria): Observable<Array<Profil>> {
        return this.authHttp.post(this.settings.server.url + `/profil/minlistByCriteria`, profilCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findProfilsByCriteria(profilCriteria: ProfilCriteria): Observable<Array<Profil>> {
        return this.authHttp.post(this.settings.server.url + `/profil/listByCriteria`, profilCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listProfils(profilCriteria: ProfilCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/profil/paginatedListByCriteria`, profilCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getProfilsDataSize(profilCriteria: ProfilCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/profil/getProfilsDataSize`, profilCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportProfils( profilCriteria: ProfilCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/profil/exportProfils/`, profilCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
