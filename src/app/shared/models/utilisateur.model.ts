import { BaseModel } from "./base-model";

export class Utilisateur extends BaseModel{

	libelle: string;
	// profil: Profil;
	// organisme: Organisme;
	email: string;
	mobile: string;
	commentaire: string;
	adresse: string;
	telephone: string;
	password?: string;
	enabled: boolean;
	resetPassword: boolean;
	oldPassword: string;
	newPassword: string;
	nomComplet: string;

  constructor( id?: number ) {
      super( id );
  }

  toString() { return JSON.stringify( this ); }


}
