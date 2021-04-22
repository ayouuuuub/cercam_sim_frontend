import { BaseCriteria } from "./base-criteria";

export class ProfilCriteria extends BaseCriteria{

	libelle: string;
	libelleLike: string;
	code:string;
	description: string;
	descriptionLike: string;
	actif: string;	
	rolesSelected: Array<number>;
	regionId: number;
	regionIdsIn: Array<number>;

    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }
    
}