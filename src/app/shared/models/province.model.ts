import { BaseModel } from "./base-model";
import { Region } from "./region.model";

export class Province extends BaseModel{

    libelle: string;
    code: string;
    codeHCP: string;
    description: string;
    ordre: number;
    actif: boolean;
    region: Region;
    type: string;

    constructor( id?: number ) {
        super( id );
    }

    toString() { return JSON.stringify( this ); }


}
