import { FamilleProduit } from './famille_produit.model';
import { BaseModel } from "./base-model";
import { CanalVente } from './canal_vente.model';

export class Produit extends BaseModel {

	libelle: string;
	description: string;
  famille: FamilleProduit;
  listCanalVente: Array<CanalVente>;

  constructor( id?: number ) {
      super( id );
  }

  toString() { return JSON.stringify( this ); }


}
