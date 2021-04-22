import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { BusinessModel } from "../models/business-model";
import { PaginatedList } from "../models/paginated-list";
import { RoleCriteria } from "../models/role.criteria";
import { Role } from "../models/role.model";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";



@Injectable()
export class RoleService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveRole(role: Role): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/role`, role);
    }

    updateRole(role: Role): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/role/${role.id}`, role);
    }

    getRole( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Role> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/role/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    deleteRole(roleListForDelete: Array<Role>) {

        return this.authHttp.delete(this.settings.server.url + `/role/delete`, {body : roleListForDelete})
    }

    findRolesByCriteria(roleCriteria: RoleCriteria): Observable<Array<Role>> {
        return this.authHttp.post(this.settings.server.url + `/role/listByCriteria`, roleCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listRoles(roleCriteria: RoleCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/role/paginatedListByCriteria`, roleCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getRolesDataSize(roleCriteria: RoleCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/role/getRolesDataSize`,roleCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportRoles( roleCriteria: RoleCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/role/exportRoles/`, roleCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }


    getCategorieRoleList(): Observable<Array<BusinessModel>> {
        return this.authHttp.get(this.settings.server.url + `/role/getCategorieRoleList`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }


}
