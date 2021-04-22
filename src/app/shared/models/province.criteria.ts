import { BaseCriteria } from "./base-criteria";

export class ProvinceCriteria extends BaseCriteria{

	libelle: string;
	libelleLike: string;
	code: string;
	codeLike: string;
	codeHCP: string;
	codeHCPLike: string;
	description: string;
	descriptionLike: string;
	ordre: string;
	actif: string;
	regionId: number;
	regionIdsin: Array<number>;

    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }

}
