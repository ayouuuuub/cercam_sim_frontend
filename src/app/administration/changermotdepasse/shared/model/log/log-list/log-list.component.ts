import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';

import { BaseComponent } from '../../../../../../shared/component/base-component';
import { BaseCriteria } from '../../../../../../shared/model/base-criteria';
import { PaginatedList } from '../../../../../../shared/model/paginated-list';
import { Log } from '../../../../../../shared/model/log.model';
import { UtilityService } from '../../../../../../shared/utility/utility.service';
import { refindicateurService } from '../../../../../../shared/services/refindicateur.service';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent extends BaseComponent implements OnInit, OnDestroy {

  public subscription: Subscription = new Subscription();
  public rowslog;
  public firstlog;
  public sortFieldlog;
  public sortOrderlog;
  public collapsedInfo: boolean;

  public totalLog: number;
  public paginatedLogList: PaginatedList;
  public logList: Array<Log>;
  public logCriteria: BaseCriteria;

  public uploader: FileUploader;
  public uploadReset = false;
  public validFile = true;


  constructor(public refindicateurService: refindicateurService, public utilityService: UtilityService) {
    super();
    this.uploader = this.utilityService.uploadFile();
    this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
      this.validFile = true;
    };
    this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
      this.validFile = false;
      this.showError(status, 'common.errors.uploadfile');
    };
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.validFile = this.validateFile(file._file);
      if (!this.validFile) {
        this.uploader.clearQueue();
      } else {
        if (this.uploader && this.uploader.queue && this.uploader.queue.length > 0) {
          // this.uploader.queue[0].file.name = "Hello World";
          this.uploader.queue[0].upload();
        }
      }
    };
  }

  ngOnInit() {
    this.logCriteria = new BaseCriteria();
    this.initlogDataTable();
    this.loadlogsData();
  }

  public populateData( paginatedList: PaginatedList ) {
    this.paginatedLogList = paginatedList;
    if ( paginatedList && paginatedList.list.length > 0 ) {
      this.totalLog = paginatedList.dataSize;
      this.logList = paginatedList.list;

    } else {
      this.logList = [];
    }
    this.removeBusy();
  }

  public	initlogDataTable() {
    this.logList = [];
    this.totalLog = 0;
    this.rowslog = 10;
    this.firstlog = 1;
    this.sortFieldlog = 'id';
  }

  onChangeLog( event ) {
    this.firstlog = event.page;
    this.rowslog = event.rows;
    this.sortFieldlog = event.field;
    this.sortOrderlog = event.order;
    this.loadlogsData();
  }

  loadlogsData() {
     this.addBusy();
    const page: number = this.firstlog - 1;
    this.getPaginationParams( this.logCriteria, page, this.rowslog, this.sortFieldlog, this.sortOrderlog );

    const subscription = this.refindicateurService.getLog( this.logCriteria )
      .subscribe( paginatedList => {
        this.populateData( paginatedList );
        console.log(this.logList);
      }, error => this.showError( error.status, JSON.parse(JSON.stringify(error)).message ) );
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
