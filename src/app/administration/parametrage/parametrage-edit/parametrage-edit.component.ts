import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ParametrageCriteria } from './../../../shared/model/parametrage.criteria';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Params, ActivatedRoute } from "@angular/router";
import { switchMap} from 'rxjs/operators';
import { Parametrage } from "../../../shared/model/parametrage.model";
import { BusinessModel } from "../../../shared/model/business-model";
import { ParametrageService } from "../../../shared/services/parametrage.service";




@Component({
    selector: 'app-parametrage-edit',
    templateUrl: './parametrage-edit.component.html',
    styleUrls: ['./parametrage-edit.component.scss'],
})
export class ParametrageEditComponent extends BaseComponent implements OnInit, OnDestroy {

    public subscription: Subscription = new Subscription();
    public parametrage: Parametrage = new Parametrage();
    public parametrageForm: FormGroup;
    public typeValeurList: any[] = [];
    public categorieRoleList: Array<BusinessModel> = [];

    constructor( public fb: FormBuilder,
     			 public route: ActivatedRoute,
          parametrageService: ParametrageService, public toasterService: ToasterService) {
        super();
        this.createForm();
        this.toasterService = toasterService;
    }

    ngOnInit() {
        if ( this.hasRole( 'ROLE_UPDATE_PARAMETRAGE' ) ){
            this.loadParametrage();
            console.log(this.parametrage);
        }
        else
            this.showUnauthorizedError( true );
    }

    init() {
      this.initData();
      this.loadTypeValeurList();
    }

    initData(){
		this.typeValeurList = [];
		this.categorieRoleList = [];
    }

    createForm() {
        this.parametrageForm = this.fb.group({
          id: [],
          code: [  null, Validators.required ],
          valeur: [  null ],
          description: [  null ],
          //typeValeur: [null],
          categorieRole: null
        });
        this.changeFormInvalide(this.parametrageForm);
    }



    loadParametrage() {
      const subscription = this.route.params.pipe(switchMap((params: Params) =>
          this.parametrageService.getParametrage(+params['id']))).subscribe(parametrage => {
            		this.parametrage = new Parametrage();
                    this.parametrage = parametrage;
                    this.init();
                    this.patchValues();
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		  this.subscription.add(subscription);
    }

    public patchValues() {
      if(this.parametrage){
            this.parametrageForm.patchValue( this.parametrage );
        //this.parametrageForm.controls['typeValeur'].setValue( this.parametrage.typeValeur.name );
        this.loadCategorieRoleParametrage();
      }
    }

    updateParametrage(parametrageForm: any) {
    	this.validateFormParametrage(this.parametrageForm);
      if(this.parametrageForm.valid){
        if(this.hasRole('ROLE_UPDATE_PARAMETRAGE')) {
          this.addBusy();
              Object.assign(this.parametrage, parametrageForm);
              const subscription = this.parametrageService.updateParametrage(this.parametrage)
                  .subscribe(() => {
                      this.showInfo("common.message.update.info");
                      this.router.navigate( ['/parametrage/view', this.parametrage.id ] );
                  }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
          this.subscription.add(subscription);
              }else{
              this.showUnauthorizedError();
            }
      }
    }

 	validateFormParametrage(form){
  		this.detectInvalideFormControle(form);
     }


	loadCategorieRoleParametrage() {
	  this.pushInList( this.categorieRoleList, this.parametrage.categorieRole );
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
