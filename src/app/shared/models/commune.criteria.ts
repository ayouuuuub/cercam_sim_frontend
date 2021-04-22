import { BaseCriteria } from "./base-criteria";

export class CommuneCriteria extends BaseCriteria{


	libelle: string;
	libelleLike: string;
	code: string;
	codeLike: string;
	codeHCP: string;
	codeHCPLike: string;
	description: string;
	descriptionLike: string;
	actif: string;
	provinceId: number;
	provincesIdIn: Array<number>;
	regionId : number;
	regionIdsin: Array<number>;
  cercleId: number;
  cercleIdsin: Array<number>;
	type: string;

    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }

}
