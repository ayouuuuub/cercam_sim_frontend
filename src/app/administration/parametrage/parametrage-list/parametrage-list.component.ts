import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core";
import { CustomValidators } from "ng2-validation";
import { Subscription } from "rxjs";
import { BaseComponent } from "../../../shared/component/base-component";

import { FormBuilder, FormGroup } from "@angular/forms";
import { Params, ActivatedRoute } from "@angular/router";


import * as _ from "lodash";
import { ModalCustomComponent } from "../../../shared/component/modalCustom/ModalCustom.component";
import { ParametrageCriteria } from "../../../shared/model/parametrage.criteria";
import { Parametrage } from "../../../shared/model/parametrage.model";
import { PaginatedList } from "../../../shared/model/paginated-list";
import { BusinessModel } from "../../../shared/model/business-model";
import { ParametrageService } from "../../../shared/services/parametrage.service";
import { CategorieParametrage } from "../../../shared/model/categorie-parametrage.model";

declare let myExtObject: any;
@Component({
    selector: 'app-parametrage-list',
    templateUrl: './parametrage-list.component.html',
    styleUrls: ['./parametrage-list.component.scss'],
})
export class ParametrageListComponent extends BaseComponent implements OnInit, OnDestroy {

    public subscription: Subscription = new Subscription();
    public parametrageList: Array<Parametrage>;
    public paginatedParametrageList: PaginatedList;
    public selectedParametrages: any[];
    public parametrageCriteria: ParametrageCriteria;
    public parametrageForm: FormGroup;
    public typeValeurList: any[] = [];
    public categorieRoleList: Array<BusinessModel> = [];

    public totalparametrage: number;
    public rowsParametrage;
    public firstParametrage;
    public sortFieldParametrage;
    public sortOrderParametrage;
    public collapsedInfo: boolean;

    //image bs64
    previewImg: any;

    @ViewChild( 'deleteParametrageModal', {static: false}) Component;
    public deleteParametrageModal: ModalCustomComponent;

    @ViewChild( 'showImageModal', {static: false})
    public showImageModal: ModalCustomComponent;

    constructor( public fb: FormBuilder, public route: ActivatedRoute, vcRef: ViewContainerRef,
                parametrageService: ParametrageService) {

        super();
        this.createForm();
    }

    ngOnInit() {

      if ( this.hasRole( 'ROLE_READ_PARAMETRAGE' ) ) {
            this.init();
            this.route
                .queryParams
                .subscribe( params => {
                    if ( params['b_'] ) {
                        const data: any = sessionStorage.getItem( "parametrageCriteria" );
                        if ( data ) {
                            this.patchValues( data );
                            sessionStorage.removeItem("parametrageCriteria");
                            this.loadParametragesData();
                        }
                    }
                } );
        } else {
            this.showUnauthorizedError( true );
        }
    }
    init() {
      this.initData();
      this.loadTypeValeurList();
    }

	public	initParametrageDataTable() {
		this.parametrageList = [];
        this.totalparametrage = 0;
        this.rowsParametrage = 10;
        this.firstParametrage = 1;
        this.sortFieldParametrage = 'id';
        this.sortOrderParametrage = 'desc';
        this.selectedParametrages = [];
	}

    initData() {
      this.parametrageList = [];
      this.paginatedParametrageList = null;
      this.collapsedInfo = false;
      this.initParametrageDataTable();
    }
    createForm() {
        this.parametrageForm = this.fb.group({
          codeLike: [ '' ],
          valeurLike: [ '' ],
          typeValeur: null,
          description: [ '' ],
          categorieRole: [ null ]
        });
    }
    Loadimage(item) {
      //this.isImageLoading = true;
      //load image per region
      let nomLogo = item.code;
      console.log(nomLogo)
      const subscription = this.parametrageService.loadLogoOdt({nomLogo : nomLogo}).subscribe(Image => {
        console.log("image head");
        //console.log(Image);
        this.createImageFromBlob(Image);
        this.showImageModal.showViewModal();
        // this.isImageLoading = false;
      }, error => {
        //   this.isImageLoading = false;
      });
      this.subscription.add(subscription);
    }

    createImageFromBlob(image: Blob) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.previewImg = reader.result;
        console.log(this.previewImg);
        // here you can save base64-image to session/localStorage
       // localStorage.setItem('item', this.imageToShow);
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      }
    }
    loadParametragesData() {
     this.addBusy();
 			const page: number = this.firstParametrage - 1;
        	this.getPaginationParams( this.parametrageCriteria, page, this.rowsParametrage, this.sortFieldParametrage, this.sortOrderParametrage );
 			      sessionStorage.setItem( 'parametrageCriteria', JSON.stringify( this.parametrageCriteria ) );
             if(this.parametrageForm.controls['typeValeur'].value == "NOMINATION"){
              this.parametrageCriteria.regionNull = "true";
              this.parametrageCriteria.regionidsIn = [];
             }
             else {
              this.parametrageCriteria.regionNull = "false";
              this.parametrageCriteria.regionidsIn = myExtObject.inRegions;
             }
            const subscription = this.parametrageService.listParametrages( this.parametrageCriteria )
                .subscribe( paginatedList => {
                    this.populateData( paginatedList )
                }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
			this.subscription.add(subscription);
    }

    public patchValues( data ) {
        this.parametrageCriteria = new ParametrageCriteria();
        Object.assign( this.parametrageCriteria, JSON.parse( data ) );
        this.firstParametrage = this.parametrageCriteria.page + 1;
        this.sortOrderParametrage = this.parametrageCriteria.sortOrder;
        this.sortFieldParametrage = this.parametrageCriteria.sortField;
        this.parametrageForm.patchValue( this.parametrageCriteria );
      	this.parametrageForm.controls['categorieRole'].setValue(this.parametrageCriteria.categorieRoleId ? new CategorieParametrage(this.parametrageCriteria.categorieRoleId) : null);

    }


	formToCriteria(parametrageForm: any){
        this.parametrageCriteria = new ParametrageCriteria();
        if ( parametrageForm )
            Object.assign( this.parametrageCriteria, parametrageForm );
      	this.parametrageCriteria.categorieRoleId = this.parametrageForm.controls['categorieRole'].value ? this.parametrageForm.controls['categorieRole'].value['id'] : null;

	}

    searchParametrages( parametrageForm?: any ) {
    	this.initParametrageDataTable();
   		this.formToCriteria( parametrageForm );
        this.loadParametragesData();
    }

    exportParametrage( id, fileType ) {
		const columns: any[] = this.getTableColumns( id );
        if ( columns && columns.length > 0 ) {
	        this.addBusy();
	   		this.formToCriteria( this.parametrageForm.value );
            this.parametrageCriteria.exportModel = { 'columnModels': columns, 'fileType': fileType };
			const subscription = this.parametrageService.exportParametrages( this.parametrageCriteria )
	        .subscribe(response => {
	            this.downloadFile(response, 'parametrage_'+id+'.'+fileType)
	        }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
			this.subscription.add(subscription);
	     }
    }

    reset() {
  		this.parametrageForm.reset({ categorieRole: null });

  		this.init();
    }

    onChangeParametrage( event ) {
        const page: number = event.page - 1;
        this.firstParametrage = event.page;
        this.rowsParametrage = event.rows;
        this.sortFieldParametrage = event.field;
        this.sortOrderParametrage = event.order;
        this.loadParametragesData();
    }

    viewParametrage( event: any ) {
        this.router.navigate( ['/parametrage/view', event.id], { queryParams: { b_: 1 } });
    }

    public loadCategorieRoleList(event) {
		const subscription = this.parametrageService.getCategorieRoleList()
            .subscribe(categorieRoleList => {
                    this.categorieRoleList = categorieRoleList;
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message)
            );
		this.subscription.add(subscription);
    }

    public loadTypeValeurList() {
        const subscription = this.parametrageService.getTypeValeurList()
            .subscribe(typeValeurList => {
                this.typeValeurList = typeValeurList;
            }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		this.subscription.add(subscription);
    }



    public populateData( paginatedList: PaginatedList ) {
        this.paginatedParametrageList = paginatedList;
        if ( paginatedList && paginatedList.list.length > 0 ) {
            this.totalparametrage = paginatedList.dataSize;
            this.parametrageList = paginatedList.list;
        } else {
            this.parametrageList = [];
        }
        this.removeBusy();
    }

    checkAllParametrages( checked: boolean ) {

        if ( !checked ) {
            this.selectedParametrages = [];
        } else {
            this.selectedParametrages = [];
            for ( const item of this.parametrageList ) {
                this.selectedParametrages.push( new Parametrage(item.id) );
            }
        }

    }

    isCheckedParametrage( item: any ) {
        if ( this.selectedParametrages && item && item.id ) {
            const index = this.selectedParametrages.findIndex( element => element.id === item.id );
            if ( index >= 0 )
                return true;
        }
        return false;
    }

    checkParametrage( checked: boolean, item: any ) {


        if ( checked ) {
            this.selectedParametrages.push( new Parametrage(item.id) );
            const items: any[] = this.parametrageList;
            if ( items && this.selectedParametrages && this.selectedParametrages.length == items.length )
                this.checkAllParametrages( true );
        } else {
            this.selectedParametrages.splice( this.selectedParametrages.findIndex( element => element.id === item.id ), 1 );
        }

    }

    isCheckedAllParametrage() {

        if ( this.parametrageList && this.parametrageList.length > 0 && this.selectedParametrages && this.selectedParametrages.length > 0 ) {
            for ( const item of this.parametrageList ) {
                const index = this.selectedParametrages.findIndex( element => element.id === item.id );
                if ( index < 0 )
                    return false;
            }
        } else {
            return false;
        }

        return true;
    }

    deleteParametrages() {
        if ( this.hasRole( 'ROLE_DELETE_PARAMETRAGE' ) ) {
            const subscription = this.parametrageService.deleteParametrage( this.selectedParametrages )
                .subscribe(() => {
                    this.showInfo( "common.message.delete.info" );
                    this.initParametrageDataTable();
                    this.loadParametragesData();
                }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
			this.subscription.add(subscription);
        } else {
            this.showUnauthorizedError();
        }
        this.deleteParametrageModal.hideViewModal();
    }

 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }
}
