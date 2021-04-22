import { BaseModel } from "./base-model";
import { Role } from "./role.model";

export class Profil extends BaseModel{

	libelle: string;
	description: string;
	actif: boolean;
	selectedObject: boolean;
	rolesList: Array<Role>;
	code:string ;
	ordre: number;


    constructor( id?: number ) {
        super( id );
    }

    toString() { return JSON.stringify( this ); }


}
