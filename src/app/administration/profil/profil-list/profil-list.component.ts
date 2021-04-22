import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core";
import { CustomValidators } from "ng2-validation";
import { Subscription } from "rxjs";
import { BaseComponent } from "../../../shared/component/base-component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Params, ActivatedRoute } from "@angular/router";

import * as _ from "lodash";
import { ModalCustomComponent } from "../../../shared/component/modalCustom/ModalCustom.component";
import { ToasterService } from "angular2-toaster";
import { ProfilCriteria } from "../../../shared/model/profil.criteria";
import { Profil } from "../../../shared/model/profil.model";
import { PaginatedList } from "../../../shared/model/paginated-list";
import { ProfilService } from "../../../shared/services/profil.service";
declare let myExtObject: any;

@Component({
    selector: 'app-profil-list',
    templateUrl: './profil-list.component.html',
    styleUrls: ['./profil-list.component.scss'],
})
export class ProfilListComponent extends BaseComponent implements OnInit, OnDestroy {

    public subscription: Subscription = new Subscription();
    public profilList: Array<Profil>;
    public paginatedProfilList: PaginatedList;
    public selectedProfils: any[];
    public profilCriteria: ProfilCriteria;
    public profilForm: FormGroup;

    public totalprofil: number;
    public rowsProfil;
    public firstProfil;
    public sortFieldProfil;
    public sortOrderProfil;
    public collapsedInfo: boolean;

    @ViewChild( 'deleteProfilModal' ,{static: false}) Component;
    public deleteProfilModal: ModalCustomComponent;

    constructor( public fb: FormBuilder, public route: ActivatedRoute, vcRef: ViewContainerRef,
                 public toasterService: ToasterService,
                 public profilService: ProfilService) {

        super();
        this.createForm();
        this.toasterService = toasterService;
    }

    ngOnInit() {

        if ( this.hasRole( 'ROLE_READ_PROFIL' ) ) {
            this.init();
            this.route
                .queryParams
                .subscribe( params => {
                    if ( params['b_'] ) {
                        const data: any = sessionStorage.getItem( "profilCriteria" );
                        if ( data ) {
                            this.patchValues( data );
                            sessionStorage.removeItem("profilCriteria");
                            this.loadProfilsData();
                        }
                    }
                } );
        } else {
            this.showUnauthorizedError( true );
        }
    }
    init(){
		this.initData();

     }

	public	initProfilDataTable() {
		this.profilList = [];
        this.totalprofil = 0;
        this.rowsProfil = 10;
        this.firstProfil = 1;
        this.sortFieldProfil = 'id';
        this.sortOrderProfil = 'desc';
        this.selectedProfils = [];
	}

    initData(){
		this.profilList = [];
 		this.paginatedProfilList = null;
		this.collapsedInfo = false;
		this.initProfilDataTable();
    }
    createForm() {
        this.profilForm = this.fb.group({
			libelleLike: [ '' ],
			description: [ '' ],
			actif: ''
        });
    }

    loadProfilsData() {
     this.addBusy();
            console.log(this.currentUser.profil.ordre);
            if (this.currentUser.profil.ordre != 0)
                this.profilCriteria.regionIdsIn = myExtObject.inRegion
 			const page: number = this.firstProfil - 1;
        	this.getPaginationParams( this.profilCriteria, page, this.rowsProfil, this.sortFieldProfil, this.sortOrderProfil );
 			sessionStorage.setItem( 'profilCriteria', JSON.stringify( this.profilCriteria ) );
        	const subscription = this.profilService.listProfils( this.profilCriteria )
            .subscribe( paginatedList => {
                this.populateData( paginatedList )
            }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
			this.subscription.add(subscription);
    }

    public patchValues( data ) {
        this.profilCriteria = new ProfilCriteria();
        Object.assign( this.profilCriteria, JSON.parse( data ) );
        this.firstProfil = this.profilCriteria.page + 1;
        this.sortOrderProfil = this.profilCriteria.sortOrder;
        this.sortFieldProfil = this.profilCriteria.sortField;
        this.profilForm.patchValue( this.profilCriteria );

    }


	formToCriteria(profilForm: any){
        this.profilCriteria = new ProfilCriteria();
        if ( profilForm )
            Object.assign( this.profilCriteria, profilForm );

	}

    searchProfils( profilForm?: any ) {
    	this.initProfilDataTable();
   		this.formToCriteria( profilForm );
        this.loadProfilsData();
    }

    exportProfil( id, fileType ) {
		const columns: any[] = this.getTableColumns( id );
        if ( columns && columns.length > 0 ) {
	        this.addBusy();
	   		this.formToCriteria( this.profilForm.value );
            this.profilCriteria.exportModel = { 'columnModels': columns, 'fileType': fileType };
			const subscription = this.profilService.exportProfils( this.profilCriteria )
	        .subscribe(response => {
	            this.downloadFile(response, 'profil_'+id+'.'+fileType)
	        }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
			this.subscription.add(subscription);
	     }
    }

    reset() {
  		this.profilForm.reset({ actif: '' });

  		this.init();
    }

    onChangeProfil( event ) {
        const page: number = event.page - 1;
        this.firstProfil = event.page;
        this.rowsProfil = event.rows;
        this.sortFieldProfil = event.field;
        this.sortOrderProfil = event.order;
        this.loadProfilsData();
    }

    viewProfil( event: any ) {
        this.router.navigate( ['/profil/view', event.id], { queryParams: { b_: 1 } });
    }



    public populateData( paginatedList: PaginatedList ) {
        this.paginatedProfilList = paginatedList;
        if ( paginatedList && paginatedList.list.length > 0 ) {
            this.totalprofil = paginatedList.dataSize;
            this.profilList = paginatedList.list;
        } else {
            this.profilList = [];
        }
        this.removeBusy();
    }

    checkAllProfils( checked: boolean ) {

        if ( !checked ) {
            this.selectedProfils = [];
        } else {
            this.selectedProfils = [];
            for ( const item of this.profilList ) {
                this.selectedProfils.push( new Profil(item.id) );
            }
        }

    }

    isCheckedProfil( item: any ) {
        if ( this.selectedProfils && item && item.id ) {
            const index = this.selectedProfils.findIndex( element => element.id === item.id );
            if ( index >= 0 )
                return true;
        }
        return false;
    }

    checkProfil( checked: boolean, item: any ) {


        if ( checked ) {
            this.selectedProfils.push( new Profil(item.id) );
            const items: any[] = this.profilList;
            if ( items && this.selectedProfils && this.selectedProfils.length == items.length )
                this.checkAllProfils( true );
        } else {
            this.selectedProfils.splice( this.selectedProfils.findIndex( element => element.id === item.id ), 1 );
        }

    }

    isCheckedAllProfil() {

        if ( this.profilList && this.profilList.length > 0 && this.selectedProfils && this.selectedProfils.length > 0 ) {
            for ( const item of this.profilList ) {
                const index = this.selectedProfils.findIndex( element => element.id === item.id );
                if ( index < 0 )
                    return false;
            }
        } else {
            return false;
        }

        return true;
    }

    deleteProfils() {
        if ( this.hasRole( 'ROLE_DELETE_PROFIL' ) ) {
            const subscription = this.profilService.deleteProfil( this.selectedProfils )
                .subscribe(() => {
                    this.showInfo( "common.message.delete.info" );
                    this.initProfilDataTable();
                    this.loadProfilsData();
                }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
			this.subscription.add(subscription);
        } else {
            this.showUnauthorizedError();
        }
        this.deleteProfilModal.hideViewModal();
    }

 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }
}
