export class BusinessModel {

    id: number;
    label: string;
    selectedObject?: boolean;
    constructor( id?: number , label?: string ) {
        this.id = id;
        this.label = label;
    }

    toString() { return JSON.stringify( this ); }

}
