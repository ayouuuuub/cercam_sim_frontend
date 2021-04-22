import { Component, OnInit, OnDestroy } from "@angular/core";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";
import { Params, ActivatedRoute } from "@angular/router";

import { Subscription } from "rxjs";
import { ViewContainerRef } from '@angular/core';
import { IndicateurCriteria } from "../../../shared/model/indicateur.criteria";
import { Utilisateur } from "../../../shared/model/utilisateur.model";
import { Indicateur } from "../../../shared/model/indicateur.model";
import { UtilisateurService } from "../../../shared/services/utilisateur.service";
import { ToasterService } from "angular2-toaster";

@Component({
    selector: 'app-monprofil-view',
    templateUrl: './monProfil-view.component.html',
    styleUrls: ['./monProfil-view.component.scss'],
})
export class ProfilViewComponent extends BaseComponent implements OnInit, OnDestroy {

 	public subscription: Subscription = new Subscription();
    public utilisateur: Utilisateur = new Utilisateur();
    public indicateurList: Array<Indicateur> = [];

    constructor( public route: ActivatedRoute, vcRef: ViewContainerRef,
                 public utilisateurService: UtilisateurService, public toasterService: ToasterService) {

        super();
        this.toasterService = toasterService;
    }

    ngOnInit() {
        if ( this.hasRole( 'ROLE_READ_MONPROFIL' ) ) {
           	this.init();
			this.loadUtilisateur();
        } else{
            this.showUnauthorizedError( true );
        }
    }

    init(){
		this.initData();
    }

    initData(){

	}

    loadUtilisateur() {
        const subscription = this.utilisateurService.getUtilisateur(this.currentUser.id)
            .subscribe(utilisateur => {
                    this.utilisateur = utilisateur;
                    //console.log(this.utilisateur);
					// this.loadIndicateursList()
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		this.subscription.add(subscription);
    }

      deleteUtilisateur() {

      	if(this.hasRole('ROLE_DELETE_MONPROFIL')) {
	            	this.addBusy();
	                const subscription = this.utilisateurService.deleteUtilisateur([this.utilisateur])
	                    .subscribe(() => {
	                        this.showInfo( "common.message.delete.info" );
	                        this.retour();
	                    }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
					this.subscription.add(subscription);
         }else{
             this.showUnauthorizedError();
         }
    }



    // public loadIndicateursList() {
		// 	const indicateurCriteria: IndicateurCriteria =new IndicateurCriteria();
		// 	indicateurCriteria.personneContactId = this.utilisateur.id;
		// 	indicateurCriteria.orderByDesc = [ "id" ];
		// 	const subscription = this.utilisateurService.findIndicateursByCriteria(indicateurCriteria)
	  //           .subscribe(indicateurList => {
	  //           		if( indicateurList ){
	  //                   	this.indicateurList = indicateurList;
	  //                   }
	  //               }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message)
	  //           );
		// 	this.subscription.add(subscription);
    // }

    retour() {

		this.route.queryParams
            .subscribe(params => {
                if (params['b_'])
                    this.router.navigate(['/utilisateur/list'], { queryParams: { b_: 1 } });
                else
                    this.router.navigate(['/utilisateur/list']);

     	});

    }

 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }



    quitAuEspace(){
      this.router.navigate(['/indicateur']);
    }
}
