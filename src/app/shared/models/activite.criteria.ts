import { NumberValueAccessor } from "@angular/forms";
import { BaseCriteria } from "./base-criteria";

export class ActiviteCriteria extends BaseCriteria{

	marge_nette: number;
  dotation_ammoritssement: number;
  frais_financiers: number;
  valeur_locative: number;
  autres_charges_fixes: number;
  nature_sol: string;
  type_irrigation: string;

  regionId: number;
  provinceId: number;
  cercleId: number;
  communeId: number;

  exploitationId: number;
  scoreId: number;
  techniciteId: number;
  mechanismeId: number;
  marcheId: number;
  qualiteProduitId: number;
  valorisationId: number;
  densiteId: number;
  stabilitePrixId: number;
  canalVenteId: number;
  familleProduitId: number;
  produitId: number;
  varieteId: number;

  familleProduitType: string;


    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }

}
