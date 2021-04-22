import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: 'root'
})
export class EnumService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    getNivEtudes(): Observable<Array<Object>> {
        return this.authHttp.get(this.settings.server.url + `/enum/getNivEtudes`)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getTypeActivite(): Observable<Array<Object>> {
      return this.authHttp.get(this.settings.server.url + `/enum/getTypeActivite`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getNatureSol(): Observable<Array<Object>> {
      return this.authHttp.get(this.settings.server.url + `/enum/getNatureSol`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getTypeIrrigation(): Observable<Array<Object>> {
      return this.authHttp.get(this.settings.server.url + `/enum/getTypeIrrigation`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

}
