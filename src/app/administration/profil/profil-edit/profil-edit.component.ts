import { ToasterService } from 'angular2-toaster';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Params, ActivatedRoute } from "@angular/router";
import { switchMap} from 'rxjs/operators';
import { Profil } from "../../../shared/model/profil.model";
import { ProfilService } from "../../../shared/services/profil.service";
import { Role } from "../../../shared/model/role.model";
import { Region } from '../../../shared/model/region.model';
import { RegionCriteria } from '../../../shared/model/region.criteria';
import { RegionService } from '../../../shared/services/region.service';




@Component({
    selector: 'app-profil-edit',
    templateUrl: './profil-edit.component.html',
    styleUrls: ['./profil-edit.component.scss'],
})
export class ProfilEditComponent extends BaseComponent implements OnInit, OnDestroy {

    public subscription: Subscription = new Subscription();
    public profil: Profil = new Profil();
    public profilForm: FormGroup;
    public rolesSelected: Array<any> = [];
    public Regions: Array<Region> = [];

    constructor( public fb: FormBuilder,
     			 public route: ActivatedRoute,
           public profilService: ProfilService, public regionService: RegionService,
           public toasterService:ToasterService	) {
        super();
        this.createForm();
        this.toasterService = toasterService;
    }

    ngOnInit() {

        if ( this.hasRole( 'ROLE_UPDATE_PROFIL' ) )
            this.loadProfil();
        else
            this.showUnauthorizedError( true );

    }

    init(){
      this.initData();

    }
    initData(){
      this.rolesSelected = [];
      this.loadRegionList();
    }
    public loadRegionList(){
      const regionCriteria: RegionCriteria = new RegionCriteria();

      this.regionService.findRegionsByCriteria(regionCriteria).subscribe(Regions =>{
          this.Regions = Regions;
      });
  }
    createForm() {
        this.profilForm = this.fb.group({
            id: [],
            libelle: [  null, Validators.required ],
            description: [  null ],
            actif: [ true ],
            ordre: [null, Validators.compose([
              Validators.min(this.currentUser.profil.ordre),
              Validators.required
            ])],
            regions: [this.profil.regions]
        });
        this.changeFormInvalide(this.profilForm);
    }


    putRolesList(rolesListSelected: Array<Role>) {
        this.rolesSelected = rolesListSelected;
    }


    loadProfil() {
        const subscription = this.route.params.pipe(switchMap((params: Params) => this.profilService.getProfil(+params['id'])))
            .subscribe(profil => {
            		this.profil = new Profil();
                    this.profil = profil;
                    this.init();
                    this.patchValues();
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		this.subscription.add(subscription);
    }

    public patchValues() {
		if(this.profil){
        	this.profilForm.patchValue( this.profil );
    		this.loadRolesProfilList();

		}
    }

    public loadRolesProfilList() {

		const subscription = this.profilService.getRolesProfil(this.profil.id)
            .subscribe(rolesList => {
            		if( rolesList ){
                    	this.rolesSelected = rolesList;
                    }
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		this.subscription.add(subscription);
    }


    updateProfil(profilForm: any) {

    	this.validateFormProfil(this.profilForm);
		if(this.profilForm.valid){
			if(this.hasRole('ROLE_UPDATE_PROFIL')) {
				this.addBusy();
        		Object.assign(this.profil, profilForm);
        		this.profil.rolesList = this.rolesSelected;
        		this.profil.rolesList = this.rolesSelected;
        		const subscription = this.profilService.updateProfil(this.profil)
            		.subscribe(() => {
                		this.showInfo("common.message.update.info");
                		this.router.navigate( ['/profil/view', this.profil.id ] );
            		}, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
				this.subscription.add(subscription);
            }else{
             this.showUnauthorizedError();
          }
		}
    }

 	validateFormProfil(form){
  		this.detectInvalideFormControle(form);
     }

 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }
}
