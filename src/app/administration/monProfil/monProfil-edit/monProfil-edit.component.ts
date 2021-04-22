import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Params, ActivatedRoute } from "@angular/router";
import { switchMap} from 'rxjs/operators';

import { IndicateurCriteria } from "../../../shared/model/indicateur.criteria";
import { Utilisateur } from "../../../shared/model/utilisateur.model";
import { BusinessModel } from "../../../shared/model/business-model";
import { Indicateur } from "../../../shared/model/indicateur.model";
import { UtilisateurService } from "../../../shared/services/utilisateur.service";
import { ToasterService } from "angular2-toaster";


@Component({
    selector: 'app-monprofil-edit',
    templateUrl: './monProfil-edit.component.html',
    styleUrls: ['./monProfil-edit.component.scss'],
})
export class ProfilEditComponent extends BaseComponent implements OnInit, OnDestroy {

    public subscription: Subscription = new Subscription();
    public utilisateur: Utilisateur = new Utilisateur();
    public utilisateurForm: FormGroup;
    public profilList: Array<BusinessModel> = [];
    public organismeList: Array<BusinessModel> = [];

    public indicateurList: Array<Indicateur> = [];

    constructor( public fb: FormBuilder,
     			 public route: ActivatedRoute,
                 public utilisateurService: UtilisateurService, public toasterService: ToasterService) {
        super();
        this.toasterService = toasterService;
        this.createForm();
    }

    ngOnInit() {

        if ( this.hasRole( 'ROLE_UPDATE_MONPROFIL' ) )
            this.loadUtilisateur();
        else
            this.showUnauthorizedError( true );

    }

    init(){
		this.initData();

    }
    initData(){
        this.profilList = [];
        this.organismeList = [];
		this.indicateurList = [];
    }
    createForm() {
      this.utilisateurForm = this.fb.group({
        id: [],
        nom: [  null, Validators.required ],
        prenom: [  null, Validators.required ],
        adresse: [  null ],
        email: [  null, Validators.required ],
        telephone: [  null ],
        mobile: [  null ],
        commentaire: [  null ],
        username: [  null, ],
        enabled: [ false ],
        profil: [ null,  ],
        organisme: [ null,  ]
      });
      this.changeFormInvalide(this.utilisateurForm);
    }



    // public loadIndicateursList() {
		// 	const indicateurCriteria: IndicateurCriteria =new IndicateurCriteria();
		// 	indicateurCriteria.personneContactId = this.utilisateur.id;
		// 	indicateurCriteria.orderByDesc = [ "id" ];
		// 	const subscription = this.utilisateurService.findIndicateursByCriteria(indicateurCriteria)
	  //           .subscribe(indicateurList => {
	  //           		if( indicateurList ) {
	  //                   	this.indicateurList = indicateurList;
	  //                   }
	  //               }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		// 	this.subscription.add(subscription);
    //      }


    loadUtilisateur() {
        const subscription = this.utilisateurService.getUtilisateur(this.currentUser.id)
            .subscribe(utilisateur => {
                //console.log("utilisateur ...........:",utilisateur);
            		this.utilisateur = new Utilisateur();
                    this.utilisateur = utilisateur;
                    this.init();
                    this.patchValues();

                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		    this.subscription.add(subscription);
    }

    public patchValues() {
		if(this.utilisateur) {
        this.utilisateurForm.patchValue( this.utilisateur );
			  // this.loadIndicateursList();
			  this.loadProfilUtilisateur();
		  }
    }


    updateUtilisateur(utilisateurForm: any) {

    	this.validateFormUtilisateur(this.utilisateurForm);
      if(this.utilisateurForm.valid){
        if(this.hasRole('ROLE_UPDATE_MONPROFIL')) {
          this.addBusy();
              Object.assign(this.utilisateur, utilisateurForm);
              // this.utilisateur.indicateurList = this.indicateurList;
              const subscription = this.utilisateurService.updateUtilisateur(this.utilisateur)
                  .subscribe(() => {
                          this.showInfo("common.message.update.info");
                      this.router.navigate( ['/monProfil/view'] );
                  }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
          this.subscription.add(subscription);
        } else {
            this.showUnauthorizedError();
        }
      }
    }

 	validateFormUtilisateur(form){
  		this.detectInvalideFormControle(form);
     }

    public loadProfilList(event) {
		const subscription = this.utilisateurService.getProfilList()
            .subscribe(profilList => {
  					this.populateList(this.profilList, profilList);
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		this.subscription.add(subscription);
    }

    public loadOrganismList(event) {
		const subscription = this.utilisateurService.getOrganismeList()
            .subscribe(organismeList => {
  					this.populateList(this.organismeList,organismeList);
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		this.subscription.add(subscription);
    }


	loadProfilUtilisateur() {
	  this.pushInList( this.profilList, this.utilisateur.profil );
    }
    loadOrganismeUtilisateur() {
        this.pushInList( this.organismeList, this.utilisateur.organisme );
      }

 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }
}
