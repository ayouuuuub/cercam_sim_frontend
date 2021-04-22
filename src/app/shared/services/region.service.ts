import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { PaginatedList } from "../models/paginated-list";
import { RegionCriteria } from "../models/region.criteria";
import { Region } from "../models/region.model";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class RegionService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveRegion(region: Region): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/region`, region);
    }

    updateRegion(region: Region): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/region/${region.id}`, region);
    }

    getRegion( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Region> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/region/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }

    deleteRegion(regionListForDelete: Array<Region>) {

        return this.authHttp.delete(this.settings.server.url + `/region/delete`, { body : regionListForDelete })
    }

    findMinimalRegionsByCriteria(regionCriteria: RegionCriteria): Observable<Array<Region>> {
      return this.authHttp.post(this.settings.server.url + `/region/minlistByCriteria`, regionCriteria)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findRegionsByCriteria(regionCriteria: RegionCriteria): Observable<Array<Region>> {
        return this.authHttp.post(this.settings.server.url + `/region/listByCriteria`, regionCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listRegions(regionCriteria: RegionCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/region/paginatedListByCriteria`, regionCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getRegionsDataSize(regionCriteria: RegionCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/region/getRegionsDataSize`, regionCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportRegions( regionCriteria: RegionCriteria ): Observable<any> {
        return this.authHttp.post( this.settings.server.url + `/region/exportRegions/`, regionCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }

    getRegionList(): Observable<Array<Region>> {
        return this.authHttp.get(this.settings.server.url + `/region/getRegionList`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }
    getNextOrdre(): Observable<number> {
        return this.authHttp.get(this.settings.server.url + `/region/getNextOrdre`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getLastDecoupage(): Observable<number> {
        return this.authHttp.get(this.settings.server.url + `/region/getLastDecoupage`)
            .pipe(map(res => res));
    }
}
