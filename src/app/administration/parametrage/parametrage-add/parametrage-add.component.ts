import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Parametrage } from "../../../shared/model/parametrage.model";
import { BusinessModel } from "../../../shared/model/business-model";
import { ParametrageService } from "../../../shared/services/parametrage.service";
import { ToasterService } from "angular2-toaster";




@Component({
    selector: 'app-parametrage-add',
    templateUrl: './parametrage-add.component.html',
    styleUrls: ['./parametrage-add.component.scss'],
})
export class ParametrageAddComponent extends BaseComponent implements OnInit, OnDestroy {

    public subscription: Subscription = new Subscription();
    public parametrage: Parametrage;
    public parametrageForm: FormGroup;
	public saveAndQuit: boolean;
    public typeValeurList: any[] = [];
    public categorieRoleList: Array<BusinessModel> = [];

    constructor( public fb: FormBuilder,
                  parametrageService: ParametrageService 			, public toasterService: ToasterService) {
        super();
        this.toasterService = toasterService;
        this.createForm();
        this.changeFormInvalide(this.parametrageForm);
    }

    ngOnInit() {

        if ( this.hasRole( 'ROLE_CREATE_PARAMETRAGE' ) )
            this.init();
        else
            this.showUnauthorizedError( true );
    }


    init(){
    	this.parametrage = new Parametrage();
   		this.initData();
     	this.loadTypeValeurList();
		this.saveAndQuit = false;
    }

    initData(){
		this.typeValeurList = [];
		this.categorieRoleList = [];
    }
    createForm() {
        this.parametrageForm = this.fb.group({
			code: [  null, Validators.required ],
			valeur: [  null ],
            typeValeur: [ 'TEXT' ],
			description: [  null ],
			categorieRole: null
        });
    }


    saveParametrage(parametrageForm: any) {

    	this.validateFormParametrage(this.parametrageForm);
    	if(this.parametrageForm.valid){
    		if(this.hasRole('ROLE_CREATE_PARAMETRAGE')) {
   				this.addBusy();
          Object.assign(this.parametrage, parametrageForm);
          this.parametrage.region = this.currentUser.region;
        	const subscription = this.parametrageService.saveParametrage( this.parametrage )
            		.subscribe( success => {
                		this.showInfo( "common.message.create.info" );
                		if ( this.saveAndQuit ) {
                    		const id: number = this.getResponseBody( success );
                    		this.router.navigate( ['/parametrage/list'] );
                    		this.saveAndQuit = false;
                		}
                		this.reset();
            		}, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
				this.subscription.add(subscription);

          }else{
             this.showUnauthorizedError();
          }
        }
    }

 	validateFormParametrage(form){
  		this.detectInvalideFormControle(form);
     }

    reset() {
        this.parametrageForm.reset({ typeValeur: 'TEXT', categorieRole: null });

		this.resetValidateForm(this.parametrageForm);
		this.init();
    }

    public loadCategorieRoleList(event) {
		const subscription = this.parametrageService.getCategorieRoleList()
            .subscribe(categorieRoleList => {
  					this.populateList(this.categorieRoleList, categorieRoleList);
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
        this.subscription.add(subscription);
    }

    public loadTypeValeurList() {
        const subscription = this.parametrageService.getTypeValeurList()
            .subscribe(typeValeurList => {
                this.typeValeurList = typeValeurList;
            }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
       this.subscription.add(subscription);
    }


 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }

}
