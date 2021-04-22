import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
// 
// 
// import {TranslatePipe} from './translate/translate.pipe';
import { TreeModule } from 'angular-tree-component';
//import {Ng2BootstrapModule} from 'ngx-bootstrap';
import { DataTableModule } from 'ng2-data-table';
import { ServiceLocator } from '../../../../../core/service-locator';
import { LayoutModule } from '../../../../../layout/layout.module';

import { MyDataTableModule } from '../../../../../shared/component/my-datatable/DataTableModule';
import { SharedModule } from '../../../../../shared/shared.module';
import { LogListComponent } from './log-list/log-list.component';
import { LogRoutingModule } from './log-routing.module';
import { refindicateurService } from '../../../../../shared/services/refindicateur.service';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LogRoutingModule,
    LayoutModule,
    DataTableModule,
    MyDataTableModule,
    TreeModule.forRoot()
  ],
  exports: [],
  declarations: [
    LogListComponent,
    // TranslatePipe,
  ],
  providers: [
    refindicateurService
    // ProfilService,
    // TranslateService
  ],
})
export class LogModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
