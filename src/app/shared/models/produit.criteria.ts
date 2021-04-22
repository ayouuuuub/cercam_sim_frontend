import { BaseCriteria } from "./base-criteria";

export class ProduitCriteria extends BaseCriteria{

	libelle: string;
	libelleLike: string;
	description: string;
	descriptionLike: string;
  familleId: number;
  type: string;

    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }

}
