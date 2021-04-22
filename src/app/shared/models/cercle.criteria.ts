import { BaseCriteria } from "./base-criteria";

export class CercleCriteria extends BaseCriteria{

	libelle: string;
	libelleLike: string;
	code: string;
	codeLike: string;
	codeHCP: string;
	codeHCPLike: string;
  provinceId: number;
	regionId : number;
	regionIdsin: Array<number>;

    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }

}
