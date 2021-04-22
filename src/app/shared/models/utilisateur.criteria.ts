import {BaseCriteria} from "./base-criteria";

export class UtilisateurCriteria extends BaseCriteria{


	nom: string;
	nomLike: string;
	codeProfil:string;
	prenom: string;
	prenomLike: string;
	adresse: string;
	adresseLike: string;
	email: string;
	emailLike: string;
	telephone: string;
	telephoneLike: string;
	mobile: string;
	mobileLike: string;
	commentaire: string;
	commentaireLike: string;
	username: string;
	usernameLike: string;
	password: string;
	passwordLike: string;
	enabled = 'true';
	resetPassword: string;
	oldPassword: string;
	oldPasswordLike: string;
	newPassword: string;
	newPasswordLike: string;
	profilId: number;
	regionId: number;
	regionIdsin: Array<number>;
	organismeId:number;
  profilOrdre: number;
  greaterThanProfilOrder: number;

    constructor( order?: string, sortNameList?: Array<string> ) {
        super( order, sortNameList );
    }

}
