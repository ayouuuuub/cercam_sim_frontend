import { RegionCriteria } from './../../../shared/model/region.criteria';
import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../../shared/component/base-component';
import { Subscription } from 'rxjs';
import { Parametrage } from '../../../shared/model/parametrage.model';
import { PaginatedList } from '../../../shared/model/paginated-list';
import { ParametrageCriteria } from '../../../shared/model/parametrage.criteria';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalCustomComponent } from '../../../shared/component/modalCustom/ModalCustom.component';
import { ActivatedRoute } from '@angular/router';
import { ParametrageService } from '../../../shared/services/parametrage.service';
import { ToasterService } from 'angular2-toaster';
import { RegionService } from '../../../shared/services/region.service';
import { Region } from '../../../shared/model/region.model';

@Component({
  selector: 'app-list-color',
  templateUrl: './list-color.component.html',
  styleUrls: ['./list-color.component.css']
})
export class ListColorComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild( 'deleteParametrageModal' , {static: false})
  public deleteParametrageModal: ModalCustomComponent;

  public subscription: Subscription = new Subscription();
  public parametrageList: Array<Parametrage>;
  public paginatedParametrageList: PaginatedList;
  public selectedParametrages: any[];
  public parametrageCriteria: ParametrageCriteria;
  public parametrageForm: FormGroup;

  public totalparametrage: number;
  public rowsParametrage;
  public firstParametrage;
  public sortFieldParametrage;
  public sortOrderParametrage;
  public collapsedInfo: boolean;

  public regions: Array<Region>;

  constructor( public fb: FormBuilder, public route: ActivatedRoute, vcRef: ViewContainerRef,
              parametrageService: ParametrageService, public regionService: RegionService,
               public toasterService: ToasterService) {

      super();
      this.createForm();
      this.toasterService = toasterService;
  }

  ngOnInit() {
      if ( this.hasRole( 'ROLE_READ_PARAMETRAGE' ) ) {
          this.init();
          this.parametrageCriteria.typeValeur = "COULEUR";
          this.loadParametragesData();
          // this.route
          //     .queryParams
          //     .subscribe( params => {
          //         if ( params['b_'] ) {
          //             const data: any = sessionStorage.getItem( "parametrageCriteria" );
          //             if ( data ) {
          //                 this.patchValues( data );
          //                 sessionStorage.removeItem("parametrageCriteria");
          //                 this.loadParametragesData();
          //             }
          //         }
          //     } );
      } else {
          this.showUnauthorizedError( true );
      }
  }
  init(){
    this.initData();
    this.loadRegions();
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

  initData(){
    this.parametrageCriteria = new ParametrageCriteria();
    this.parametrageList = [];
    this.paginatedParametrageList = null;
    this.collapsedInfo = false;
    this.initParametrageDataTable();
  }

  createForm() {
      this.parametrageForm = this.fb.group({
        codeLike: [ '' ],
        valeurLike: [ '' ],
        typeValeur: ['COULEUR'],
        region : [null]
      });
  }

  loadRegions() {
    let regionCriteria: RegionCriteria = new RegionCriteria();
    this.regionService.findRegionsByCriteria(regionCriteria).subscribe(list => {
      this.regions = list;
    });
  }

  loadParametragesData() {
     this.addBusy();
    const page: number = this.firstParametrage - 1;
        this.getPaginationParams( this.parametrageCriteria, page, this.rowsParametrage, this.sortFieldParametrage, this.sortOrderParametrage );
        sessionStorage.setItem( 'parametrageCriteria', JSON.stringify( this.parametrageCriteria ) );
        const subscription = this.parametrageService.listParametrages( this.parametrageCriteria )
          .subscribe( paginatedList => {
            console.log(paginatedList.list);
            this.populateData( paginatedList )
          }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
    this.subscription.add(subscription);
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

  public patchValues( data ) {
      this.parametrageCriteria = new ParametrageCriteria();
      Object.assign( this.parametrageCriteria, JSON.parse( data ) );
      this.firstParametrage = this.parametrageCriteria.page + 1;
      this.sortOrderParametrage = this.parametrageCriteria.sortOrder;
      this.sortFieldParametrage = this.parametrageCriteria.sortField;
      this.parametrageForm.patchValue( this.parametrageCriteria );
  }


  formToCriteria(parametrageForm: any) {
    this.parametrageCriteria = new ParametrageCriteria();
    if ( parametrageForm )
      Object.assign( this.parametrageCriteria, parametrageForm );
  }

  searchParametrages( parametrageForm?: any ) {
    this.initParametrageDataTable();
    this.formToCriteria( parametrageForm );
    if(this.parametrageForm.controls['region'].value)
      this.parametrageCriteria.regionId = this.parametrageForm.controls['region'].value.id;
    this.loadParametragesData();
  }

  exportParametrage( id, fileType ) {
    const columns: any[] = this.getTableColumns( id );
        if ( columns && columns.length > 0 ) {
          this.addBusy();
          this.formToCriteria( this.parametrageForm.value );
          this.parametrageCriteria.typeValeur = "COULEUR";
          if(this.parametrageForm.controls['region'].value)
            this.parametrageCriteria.regionId = this.parametrageForm.controls['region'].value.id;
          this.parametrageCriteria.exportModel = { 'columnModels': columns, 'fileType': fileType };
          const subscription = this.parametrageService.exportParametrages( this.parametrageCriteria )
          .subscribe(response => {
              this.downloadFile(response,'parametrage_'+id+'.'+fileType);
          }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
      this.subscription.add(subscription);
      }
  }

  reset() {
    this.parametrageForm.reset({ typeValeur: 'COULEUR' });

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
      this.router.navigate( ['/parametrage/view-color', event.region ? event.region.id : "national" ], { queryParams: { b_: 1 } });
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


 public ngOnDestroy() {

     this.initData();
  this.subscription.unsubscribe();
  }

}
