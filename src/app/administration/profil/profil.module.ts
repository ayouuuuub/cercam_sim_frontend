import { CommonModule } from "@angular/common";
import { Injector, NgModule } from "@angular/core";
import { TreeModule } from 'angular-tree-component';
import { DataTableModule } from "ng2-data-table";
import { ServiceLocator } from "../../core/service-locator";
import { LayoutModule } from "../../layout/layout.module";
import { MyDataTableModule } from '../../shared/component/my-datatable/DataTableModule';
import { SharedModule } from "../../shared/shared.module";
import { ProfilAddComponent } from "./profil-add/profil-add.component";
import { ProfilEditComponent } from "./profil-edit/profil-edit.component";
import { ProfilListComponent } from "./profil-list/profil-list.component";
import { ProfilRoutingModule } from "./profil-routing.module";
import { ProfilViewComponent } from "./profil-view/profil-view.component";
import { RoleComponent } from './role/role.component';

import { TranslatePipe } from './translate/translate.pipe';
import { ProfilService } from "../../shared/services/profil.service";
import { TranslateService } from './translate/translate.service';
import { NgSelectModule } from "@ng-select/ng-select";
import { RegionService } from "../../shared/services/region.service";


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        ProfilRoutingModule,
        LayoutModule,
        DataTableModule,
        MyDataTableModule,
        TreeModule.forRoot(),             
        NgSelectModule
    ],
    exports: [],
    declarations: [
        ProfilAddComponent,
        ProfilEditComponent,
        ProfilViewComponent,
        ProfilListComponent,
        TranslatePipe,
        RoleComponent
    ],
    providers: [
 		ProfilService,
        TranslateService,
        RegionService
    ],
})
export class ProfilModule {
    constructor(private injector: Injector) {
        ServiceLocator.injector = this.injector;
    }    
}
