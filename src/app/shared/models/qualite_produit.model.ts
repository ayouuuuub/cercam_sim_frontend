import { FamilleProduit } from './famille_produit.model';
import { BaseModel } from "./base-model";

export class QualiteProduit extends BaseModel {

	libelle: string;
	description: string;

  constructor( id?: number ) {
      super( id );
  }

  toString() { return JSON.stringify( this ); }


}
