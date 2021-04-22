import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ScoreCriteria } from "../models/score.criteria";
import { Score } from "../models/score.model";
import { PaginatedList } from "../models/paginated-list";
import { AuthHttpService } from "./auth-http.service";
import { SettingsService } from "./settings.service";


@Injectable({
    providedIn: 'root'
})
export class ScoreService {

    constructor(private settings: SettingsService,
                private authHttp: AuthHttpService) {
    }

    saveScore(score: Score): Observable<Response> {
        return this.authHttp.post(this.settings.server.url + `/score`, score);
    }

    updateScore(score: Score): Observable<Response> {
        return this.authHttp.put(this.settings.server.url + `/score/${score.id}`, score);
    }

    getScore( id: number, includes?: Array<string>, excludes?: Array<string> ): Observable<Score> {
        const p_includes: string = includes ? '?includes=' + includes : '';
        const p_excludes: string = excludes ? '&excludes=' + excludes : '';
        const params = p_includes + p_excludes;
        return this.authHttp.get( this.settings.server.url + `/score/${id}` + params )
            .pipe(map(( res: Response ) => JSON.parse(JSON.stringify(res)) ));
    }
    getScoreList():  Observable<Array<Score>> {
      return this.authHttp.get(this.settings.server.url + `/score`)
          .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    deleteScore(scoreListForDelete: Array<Score>) {

        return this.authHttp.delete(this.settings.server.url + `/score/delete`, {body : scoreListForDelete})
    }

    findMinimalScoresByCriteria(scoreCriteria: ScoreCriteria): Observable<Array<Score>> {
        return this.authHttp.post(this.settings.server.url + `/score/minlistByCriteria`, scoreCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    findScoresByCriteria(scoreCriteria: ScoreCriteria): Observable<Array<Score>> {
        return this.authHttp.post(this.settings.server.url + `/score/listByCriteria`, scoreCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    listScores(scoreCriteria: ScoreCriteria): Observable<PaginatedList> {
        return this.authHttp.post(this.settings.server.url + `/score/paginatedListByCriteria`, scoreCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    getScoresDataSize(scoreCriteria: ScoreCriteria): Observable<number> {
        return this.authHttp.post(this.settings.server.url + `/score/getScoresDataSize`, scoreCriteria)
            .pipe(map((res: Response) => JSON.parse(JSON.stringify(res))));
    }

    exportScores( scoreCriteria: ScoreCriteria ): Observable<any> {

        return this.authHttp.post( this.settings.server.url + `/score/exportScores/`, scoreCriteria , { responseType: 'blob' })
            .pipe(map( res => res ));
    }



}
