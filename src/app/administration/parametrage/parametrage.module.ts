import { CommonModule } from "@angular/common";
import { Injector, NgModule } from "@angular/core";
import { DataTableModule } from "ng2-data-table";
import { ServiceLocator } from "../../core/service-locator";
import { LayoutModule } from "../../layout/layout.module";
import { MyDataTableModule } from '../../shared/component/my-datatable/DataTableModule';
import { SharedModule } from "../../shared/shared.module";
import { ParametrageAddComponent } from "./parametrage-add/parametrage-add.component";
import { ParametrageEditComponent } from "./parametrage-edit/parametrage-edit.component";
import { ParametrageHistListComponent } from "./parametrage-hist/parametrage-hist.component";
import { ParametrageListComponent } from "./parametrage-list/parametrage-list.component";
import { ParametrageRoutingModule } from "./parametrage-routing.module";
import { ParametrageViewComponent } from "./parametrage-view/parametrage-view.component";


import { TranslatePipe } from './translate/translate.pipe';
import { ParametrageService } from "../../shared/services/parametrage.service";
import { ParametrageHistService } from "../../shared/services/parametrage-hist.service";
import { TranslateService } from './translate/translate.service';
import { ListNominationComponent } from './list-nomination/list-nomination.component';
import { ViewNominationComponent } from './view-nomination/view-nomination.component';
import { EditNominationComponent } from './edit-nomination/edit-nomination.component';
import { ViewColorComponent } from './view-color/view-color.component';
import { ListColorComponent } from './list-color/list-color.component';
import { EditColorComponent } from './edit-color/edit-color.component';



@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        ParametrageRoutingModule,
        LayoutModule,
        DataTableModule,
        MyDataTableModule,
    ],
    exports: [],
    declarations: [
        ParametrageAddComponent,
        ParametrageEditComponent,
        ParametrageViewComponent,
        ParametrageListComponent,
        ParametrageHistListComponent,
        TranslatePipe,
        ListNominationComponent,
        ViewNominationComponent,
        EditNominationComponent,
        ViewColorComponent,
        ListColorComponent,
        EditColorComponent,
    ],
    providers: [
 		  ParametrageService,
 		  ParametrageHistService,
      TranslateService
    ],
})
export class ParametrageModule {
    constructor(private injector: Injector) {
        ServiceLocator.injector = this.injector;
    }
}
