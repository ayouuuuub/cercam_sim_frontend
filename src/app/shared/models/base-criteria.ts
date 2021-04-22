export class BaseCriteria {

    id?: number;
    notId?: number;
    orderByAsc?: Array<string>;
    orderByDesc?: Array<string>;
    idsIn?: Array<number>;
    idsNotIn?: Array<number>;
    log?: boolean;
    maxResults?: number;
    page?: number;
    sortField?: string;
    sortOrder?: string;
    filterName?: string;
    filterWord?: string;
    exportModel?: any;
    includes?: Array<string>;
    excludes?: Array<string>;    
    

    constructor( order?: string, sortNameList?: Array<string> ) {
        if ( order != null && order == 'asc' ) {
            this.orderByAsc = sortNameList;
        } else if ( order != null && order == 'desc' ) {
            this.orderByDesc = sortNameList;
        }
    }
}