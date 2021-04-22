import { BaseModel } from "./base-model";
import { Province } from "./province.model";
export class Commune extends BaseModel{

    libelle: string;
    code: string;
    codeHCP: string;
    description: string;
    actif: boolean;
    selectedObject: boolean;
   	province: Province;

   constructor( id?: number ) {
       super( id );
   }

   toString() { return JSON.stringify( this ); }


}



