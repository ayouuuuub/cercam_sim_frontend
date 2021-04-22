import { Component, OnInit, OnDestroy } from "@angular/core";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";
import { Params, ActivatedRoute } from "@angular/router";
import { switchMap} from 'rxjs/operators';


import { Subscription } from "rxjs";
import { ViewContainerRef } from '@angular/core';
import { Parametrage } from "../../../shared/model/parametrage.model";
import { ParametrageService } from "../../../shared/services/parametrage.service";

@Component({
    selector: 'app-parametrage-view',
    templateUrl: './parametrage-view.component.html',
    styleUrls: ['./parametrage-view.component.scss'],
})
export class ParametrageViewComponent extends BaseComponent implements OnInit, OnDestroy {

 	public subscription: Subscription = new Subscription();
    public parametrage: Parametrage = new Parametrage();

    constructor( public route: ActivatedRoute, vcRef: ViewContainerRef,
                parametrageService: ParametrageService) {

        super();
    }

    ngOnInit() {
        if ( this.hasRole( 'ROLE_READ_PARAMETRAGE' ) ) {
           	this.init();
			this.loadParametrage();
        } else{
            this.showUnauthorizedError( true );
        }
    }

    init(){
		this.initData();
    }

    initData(){

	}

    loadParametrage() {
        const subscription = this.route.params.pipe(switchMap((params: Params) => this.parametrageService.getParametrage(params['id'])))
            .subscribe(parametrage => {
                    this.parametrage = parametrage;
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		this.subscription.add(subscription);
    }

      deleteParametrage() {

      	if(this.hasRole('ROLE_DELETE_PARAMETRAGE')) {
	            	this.addBusy();
	                const subscription = this.parametrageService.deleteParametrage([this.parametrage])
	                    .subscribe(() => {
	                        this.showInfo( "common.message.delete.info" );
	                        this.retour();
	                    }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
					this.subscription.add(subscription);
         }else{
             this.showUnauthorizedError();
         }
    }



    retour() {

		this.route.queryParams
            .subscribe(params => {
                if (params['b_'])
                    this.router.navigate(['/parametrage/list'], { queryParams: { b_: 1 } });
                else
                    this.router.navigate(['/parametrage/list']);

     	});

    }

 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }
}
