import { BaseCriteria } from "./base-criteria";

export class RoleCriteria extends BaseCriteria{

	libelle: string;
	libelleLike: string;
	description: string;
	descriptionLike: string;
	domaine: string;	
	actif: string;	
	categorieRoleId: number;
    
    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }
    
}