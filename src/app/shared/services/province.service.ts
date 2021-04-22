import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { BusinessModel } from "../models/business-model";
import { PaginatedList } from "../models/paginated-list";
import { ProvinceCriteria } from "../models/province.criteria";
import { Province } from "../models/province.model";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";

@Injectable({
    providedIn: 'root'
})
export class ProvinceService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveProvince(province: Province): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/province`, province);
    }

    updateProvince(province: Province): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/province/${province.id}`, province);
    }

    getProvince( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Province> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/province/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    deleteProvince(provinceListForDelete: Array<Province>) {

        return this.authHttp.delete(this.settings.server.url + `/province/delete`, {body : provinceListForDelete})
    }

    findProvincesByCriteria(provinceCriteria: ProvinceCriteria): Observable<Array<Province>> {
      return this.authHttp.post(this.settings.server.url + `/province/listByCriteria`, provinceCriteria)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }
    findMinimalProvincesByCriteria(provinceCriteria: ProvinceCriteria): Observable<Array<Province>> {
        return this.authHttp.post(this.settings.server.url + `/province/minlistByCriteria`, provinceCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }
    listProvinces(provinceCriteria: ProvinceCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/province/paginatedListByCriteria`, provinceCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getProvincesDataSize(provinceCriteria: ProvinceCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/province/getProvincesDataSize`, provinceCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportProvinces( provinceCriteria: ProvinceCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/province/exportProvinces/`, provinceCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }

    getNextOrdre(): Observable<number> {
        return this.authHttp.get(this.settings.server.url + `/province/getNextOrdre`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getRegionList(): Observable<Array<BusinessModel>> {
        return this.authHttp.get(this.settings.server.url + `/province/getRegionList`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }


}
