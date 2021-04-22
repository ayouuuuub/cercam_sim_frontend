import { BaseModel } from "./base-model";

export class Mechanisme extends BaseModel {

	libelle: string;
	description: string;

  constructor( id?: number ) {
      super( id );
  }

  toString() { return JSON.stringify( this ); }


}
