import { BaseCriteria } from "./base-criteria";

export class RegionCriteria extends BaseCriteria {

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
	decoupageId: number;
	
    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }
    
}