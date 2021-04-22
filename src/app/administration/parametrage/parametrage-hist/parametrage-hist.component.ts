import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { CustomValidators } from "ng2-validation";
import { BaseComponent } from "../../../shared/component/base-component";
import { FormBuilder, FormGroup } from "@angular/forms";



import { HistCriteria } from "../../../shared/model/hist-Criteria";

import { Subscription } from "rxjs";
import * as _ from "lodash";
import * as moment from 'moment';
import { HistModel } from "../../../shared/model/hist-model";
import { PaginatedList } from "../../../shared/model/paginated-list";
import { Utilisateur } from "../../../shared/model/utilisateur.model";
import { ParametrageHistService } from "../../../shared/services/parametrage-hist.service";

@Component({
    selector: 'app-parametrage-hist',
    templateUrl: './parametrage-hist.component.html',
    styleUrls: ['./parametrage-hist.component.scss'],
})
export class ParametrageHistListComponent extends BaseComponent implements OnInit, OnDestroy {

    public subscription: Subscription = new Subscription();
    public parametrageHistList: Array<HistModel>;
    public paginatedParametrageHistList: PaginatedList;
    public histModelCriteria: HistCriteria;
    public parametrageHistForm: FormGroup;
    public typeactionList: any[] = [];
    public utilisateurList: Array<Utilisateur> = [];

    public totalparametrageHist: number;
    public rowsParametrageHist;
    public firstParametrageHist;
    public sortFieldParametrageHist;
    public sortOrderParametrageHist;
    @Input() parametrageId: number;

    constructor( public fb: FormBuilder,
                 public parametrageHistService: ParametrageHistService) {

        super();
        this.createForm();
    }

    ngOnInit() {

 		this.init();
    }

    init(){
		this.initData();
		this.loadUtilisateurList();
     }

	public	initParametrageDataTable() {
		this.parametrageHistList = [];
        this.totalparametrageHist = 0;
        this.rowsParametrageHist = 10;
        this.firstParametrageHist = 1;
        this.sortFieldParametrageHist = 'date';
        this.sortOrderParametrageHist = 'desc';
	}

	initData(){
		this.parametrageHistList = [];
		this.paginatedParametrageHistList = null;
		this.initParametrageDataTable();
	}

    createForm() {
        this.parametrageHistForm = this.fb.group({
			typeactionLike: null,
			dateFrom: [  null  ],
			dateTo: [  null ],
 			utilisateur: [ null ]
        });
    }

    loadParametragesData() {
    	if(this.parametrageId && this.parametrageId != null){
    		if(this.hasRole('ROLE_HIST_PARAMETRAGE')) {
    			this.histModelCriteria.objectId = this.parametrageId;
    			 if ( this.parametrageHistForm.controls['utilisateur'].value )
                    this.histModelCriteria.userId = this.parametrageHistForm.controls['utilisateur'].value.id;
                else
                    this.histModelCriteria.userId = null;
 				const page: number = this.firstParametrageHist - 1;
        		this.getPaginationParams( this.histModelCriteria, page, this.rowsParametrageHist, this.sortFieldParametrageHist, this.sortOrderParametrageHist );
        		this.addBusy();
        		const subscription = this.parametrageHistService.listHistParametrages( this.histModelCriteria )
            		.subscribe( paginatedList => {
                		this.populateData( paginatedList )
            		}, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
            	this.subscription.add(subscription);
    		}
    	}
    }

	formToCriteria(parametrageHistForm: any){
			this.histModelCriteria = new HistCriteria();
        	this.histModelCriteria = parametrageHistForm;
			const dateFrom: any = this.parametrageHistForm.controls['dateFrom'].value;
   			if (dateFrom && typeof dateFrom != 'string') this.histModelCriteria.dateFrom = moment(dateFrom).format('DD/MM/YYYY HH:mm');
			const dateTo: Date = this.parametrageHistForm.controls['dateTo'].value;
   			if (dateTo && typeof dateTo != 'string') this.histModelCriteria.dateTo = moment(dateTo).format('DD/MM/YYYY HH:mm');
	}

    searchHistParametrages( parametrageHistForm: any ) {
    	if(this.parametrageId && this.parametrageId != null){
    		this.initParametrageDataTable();
   			this.formToCriteria( parametrageHistForm );
        	this.loadParametragesData();
        }
    }

	exportParametrageHist( id, fileType ) {
		const columns: any[] = this.getTableColumns( id );
        if ( columns && columns.length > 0 ) {
	        this.addBusy();
	   		this.formToCriteria( this.parametrageHistForm.value );
            this.histModelCriteria.exportModel = { 'columnModels': columns, 'fileType': fileType };
	        const subscription = this.parametrageHistService.exportParametragesHist( this.histModelCriteria )
	        .subscribe(response => {
	            this.downloadFile(response, 'parametrage_'+id+'.'+fileType)
	        }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
	        this.subscription.add(subscription);
	     }
    }

    onChangeParametrageHist( event ) {
        const page: number = event.page - 1;
        this.firstParametrageHist = event.page;
        this.rowsParametrageHist = event.rows;
        this.sortFieldParametrageHist = event.field;
        this.sortOrderParametrageHist = event.order;
        this.loadParametragesData();
    }

    reset() {
  		this.parametrageHistForm.reset({ utilisateur: null,typeaction: '' });

  		this.init();
    }

    public loadUtilisateurList() {
		const subscription = this.parametrageHistService.getUtilisateurHistList()
            .subscribe(utilisateurList => {
                    this.utilisateurList = utilisateurList;
                }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
		this.subscription.add(subscription);
    }


    public populateData( paginatedList: PaginatedList ) {
        this.paginatedParametrageHistList = paginatedList;
        if ( paginatedList && paginatedList.list.length > 0 ) {
            this.totalparametrageHist = paginatedList.dataSize;
            this.parametrageHistList = paginatedList.list;
        } else {
            this.parametrageHistList = [];
        }
		this.removeBusy();
    }

 	public ngOnDestroy() {

   		this.initData();
		this.subscription.unsubscribe();
    }

}
