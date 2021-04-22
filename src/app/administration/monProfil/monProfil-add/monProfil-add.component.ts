import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Profil } from "../../../shared/model/profil.model";
import { ProfilService } from "../../../shared/services/profil.service";
import { Role } from "../../../shared/model/role.model";
import { ToasterService } from "angular2-toaster";




@Component({
    selector: 'app-monprofil-add',
    templateUrl: './monProfil-add.component.html',
    styleUrls: ['./monProfil-add.component.scss'],
})
export class ProfilAddComponent extends BaseComponent implements OnInit, OnDestroy {

    public subscription: Subscription = new Subscription();
    public profil: Profil;
    public profilForm: FormGroup;
	public saveAndQuit: boolean;
    public rolesSelected: Array<any> = [];

    constructor( public fb: FormBuilder,
                 public profilService: ProfilService 			, public toasterService: ToasterService) {
        super();
        this.toasterService = toasterService;
        this.createForm();
        this.changeFormInvalide(this.profilForm);
    }

    ngOnInit() {

        if ( this.hasRole( 'ROLE_CREATE_PROFIL' ) )
            this.init();
        else
            this.showUnauthorizedError( true );
    }


    init(){
    	this.profil = new Profil();
   		this.initData();
		this.saveAndQuit = false;
    }

    initData(){
		this.rolesSelected = [];
    }
    createForm() {
        this.profilForm = this.fb.group({
			libelle: [  null, Validators.required ],
			description: [  null ],
			actif: [ true ]
        });
    }


    putRolesList(rolesListSelected: Array<Role>) {
        this.rolesSelected = rolesListSelected;
    }

    saveProfil(profilForm: any) {

    	this.validateFormProfil(this.profilForm);
    	if(this.profilForm.valid){
    		if(this.hasRole('ROLE_CREATE_PROFIL')) {
   				this.addBusy();
        		Object.assign(this.profil, profilForm);
        		this.profil.rolesList = this.rolesSelected;
        		const subscription = this.profilService.saveProfil( this.profil )
            		.subscribe( success => {
                		this.showInfo( "common.message.create.info" );
                		if ( this.saveAndQuit ) {
                    		const id: number = this.getResponseBody( success );
                    		this.router.navigate( ['/profil/list']);
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

 	validateFormProfil(form){
  		this.detectInvalideFormControle(form);
     }

    reset() {
        this.profilForm.reset({ actif: true });

		this.resetValidateForm(this.profilForm);
		this.init();
    }


 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }

}
