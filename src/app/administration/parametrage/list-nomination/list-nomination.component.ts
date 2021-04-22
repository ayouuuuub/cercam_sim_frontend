import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../../shared/component/base-component';
import { Subscription } from 'rxjs';
import { Parametrage } from '../../../shared/model/parametrage.model';
import { PaginatedList } from '../../../shared/model/paginated-list';
import { ParametrageCriteria } from '../../../shared/model/parametrage.criteria';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BusinessModel } from '../../../shared/model/business-model';
import { ModalCustomComponent } from '../../../shared/component/modalCustom/ModalCustom.component';
import { ActivatedRoute } from '@angular/router';
import { ParametrageService } from '../../../shared/services/parametrage.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-list-nomination',
  templateUrl: './list-nomination.component.html',
  styleUrls: ['./list-nomination.component.css']
})
export class ListNominationComponent extends BaseComponent implements OnInit, OnDestroy {

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

  @ViewChild( 'deleteParametrageModal' , {static: false})
  public deleteParametrageModal: ModalCustomComponent;

  constructor( public fb: FormBuilder, public route: ActivatedRoute, vcRef: ViewContainerRef,
                parametrageService: ParametrageService,
               public toasterService: ToasterService) {

      super();
      this.createForm();
      this.toasterService = toasterService;
  }

  ngOnInit() {
      console.log('inited');
      if ( this.hasRole( 'ROLE_READ_PARAMETRAGE' ) ) {
          this.init();
          console.log('loading');
          this.parametrageCriteria.typeValeur = "NOMINATION";
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
      });
  }

  loadParametragesData() {
     this.addBusy();
     const page: number = this.firstParametrage - 1;
        this.getPaginationParams( this.parametrageCriteria, page, this.rowsParametrage, this.sortFieldParametrage, this.sortOrderParametrage );
        sessionStorage.setItem( 'parametrageCriteria', JSON.stringify( this.parametrageCriteria ) );
        const subscription = this.parametrageService.listParametrages( this.parametrageCriteria )
          .subscribe( paginatedList => {
              console.log(paginatedList);
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

  }


formToCriteria(parametrageForm: any){
      this.parametrageCriteria = new ParametrageCriteria();
      if ( parametrageForm )
          Object.assign( this.parametrageCriteria, parametrageForm );

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
            this.downloadFile(response,'parametrage_'+id+'.'+fileType);
        }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
    this.subscription.add(subscription);
     }
  }

  reset() {
    this.parametrageForm.reset({ actif: '' });

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
