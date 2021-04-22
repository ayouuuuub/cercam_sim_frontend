import { BaseCriteria } from "./base-criteria";

export class CanalVenteCriteria extends BaseCriteria{

	libelle: string;
	libelleLike: string;
	description: string;
	descriptionLike: string;
  produitId: number;

    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }

}
