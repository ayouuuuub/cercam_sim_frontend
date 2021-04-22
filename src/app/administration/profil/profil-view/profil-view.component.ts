import { Component, OnInit, OnDestroy } from "@angular/core";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";
import { Params, ActivatedRoute } from "@angular/router";
import { switchMap} from 'rxjs/operators';


import { Subscription } from "rxjs";
import { ViewContainerRef } from '@angular/core';
import { Profil } from "../../../shared/model/profil.model";
import { ProfilService } from "../../../shared/services/profil.service";

@Component({
    selector: 'app-profil-view',
    templateUrl: './profil-view.component.html',
    styleUrls: ['./profil-view.component.scss'],
})
export class ProfilViewComponent extends BaseComponent implements OnInit, OnDestroy {

 	public subscription: Subscription = new Subscription();
    public profil: Profil = new Profil();
    public rolesList: Array<any> = [];

    constructor( public route: ActivatedRoute, vcRef: ViewContainerRef,
                 public profilService: ProfilService) {

        super();
    }

    ngOnInit() {
        if ( this.hasRole( 'ROLE_READ_PROFIL' ) ) {
           	this.init();
			this.loadProfil();
        } else{
            this.showUnauthorizedError( true );
        }
    }

    init(){
		this.initData();
    }

    initData(){

	}

    loadProfil() {
        const subscription = this.route.params.pipe(switchMap((params: Params) => this.profilService.getProfil(params['id'])))
            .subscribe(profil => {
                    this.profil = profil;
					this.loadRolesProfilList();
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
        this.subscription.add(subscription);
    }

      deleteProfil() {

      	if(this.hasRole('ROLE_DELETE_PROFIL')) {
	            	this.addBusy();
	                const subscription = this.profilService.deleteProfil([this.profil])
	                    .subscribe(() => {
	                        this.showInfo( "common.message.delete.info" );
	                        this.retour();
	                    }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
					this.subscription.add(subscription);
         }else{
             this.showUnauthorizedError();
         }
    }


    public loadRolesProfilList() {

		const subscription = this.profilService.getRolesProfil(this.profil.id)
            .subscribe(rolesList => {
                    this.rolesList = rolesList;
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message)
            );
		this.subscription.add(subscription);
    }


    retour() {

		this.route.queryParams
            .subscribe(params => {
                if (params['b_'])
                    this.router.navigate(['/profil/list'], { queryParams: { b_: 1 } });
                else
                    this.router.navigate(['/profil/list']);

     	});

    }

 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }
}
