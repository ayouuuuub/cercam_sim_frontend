import { BaseModel } from "./base-model";

export class Region extends BaseModel{

    libelle: string;
    code: string;
    codeHCP: string;
    description: string;
    ordre: number;
    actif: boolean;

    constructor( id?: number ) {
        super( id );
    }

    toString() { return JSON.stringify( this ); }


}
