import { BaseModel } from "./base-model";
// import { CategorieRole } from "./categorie-role.model";


export class Role extends BaseModel{

	libelle: string;
	description: string;
	domaine: number;
	actif: boolean;
	selectedObject: boolean;
	// categorieRole: CategorieRole;

    constructor( id?: number ) {
        super( id );
    }

    toString() { return JSON.stringify( this ); }


}
