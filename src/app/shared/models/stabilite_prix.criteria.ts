import { BaseCriteria } from "./base-criteria";

export class StabilitePrixCriteria extends BaseCriteria{

	libelle: string;
	libelleLike: string;
	description: string;
	descriptionLike: string;

    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }

}
