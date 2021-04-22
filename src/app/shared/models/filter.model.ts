import { QualiteProduit } from './qualite_produit.model';
import { BaseModel } from "./base-model";
import { CanalVente } from "./canal_vente.model";
import { Cercle } from "./cercle.model";
import { Commune } from "./commune.model";
import { Densite } from "./densite.model";
import { Exploitation } from "./exploitation.model";
import { Marche } from "./marche.model";
import { Mechanisme } from "./mechanisme.model";
import { Produit } from "./produit.model";
import { Province } from "./province.model";
import { Region } from "./region.model";
import { Score } from "./score.model";
import { StabilitePrix } from "./stabilite_prix.model";
import { Technicite } from "./technicite.model";
import { Valorisation } from "./valorisation.model";
import { Variete } from "./variete.model";

export class Filter extends BaseModel {

	marge_nette: number;
  dotation_ammoritssement: number;
  frais_financiers: number;
  valeur_locative: number;
  autres_charges_fixes: number;
  nature_sol: string;
  type_irrigation: string;
  exploitation: Exploitation;
  produit: Produit;
  variete: Variete;
  stabilitePrix: StabilitePrix;
  qualiteProduit: QualiteProduit;
  marche: Marche;
  valorisation: Valorisation;
  mechansime: Mechanisme;
  technicite: Technicite;
  densite: Densite;
  score: Score;
  canalVente: CanalVente;

  total: number;
  region: Region;
  province: Province;
  cercle: Cercle;
  commune: Commune;

  constructor( id?: number ) {
      super( id );
  }

  toString() { return JSON.stringify( this ); }


}
