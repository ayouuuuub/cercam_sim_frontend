import { CommonModule } from "@angular/common";
import { Injector, NgModule } from "@angular/core";
import { TreeModule } from 'angular-tree-component';
import { DataTableModule } from "ng2-data-table";
import { ServiceLocator } from "../../core/service-locator";
import { LayoutModule } from "../../layout/layout.module";
import { MyDataTableModule } from '../../shared/component/my-datatable/DataTableModule';
import { SharedModule } from "../../shared/shared.module";
import { ProfilAddComponent } from "./monProfil-add/monProfil-add.component";
import { ProfilEditComponent } from "./monProfil-edit/monProfil-edit.component";
import { ProfilListComponent } from "./monProfil-list/monProfil-list.component";
import { monProfilRoutingModule } from "./monProfil-routing.module";
import { ProfilViewComponent } from "./monProfil-view/monProfil-view.component";
import { RoleComponent } from './role/role.component';


import { TranslatePipe } from './translate/translate.pipe';
import { ProfilService } from "../../shared/services/profil.service";
import { TranslateService } from './translate/translate.service';
import { UtilisateurService } from "../../shared/services/utilisateur.service";



@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        monProfilRoutingModule,
        LayoutModule,
        DataTableModule,
        MyDataTableModule,
		    TreeModule.forRoot()
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
        UtilisateurService,
    ],
})
export class monProfilModule {
    constructor(private injector: Injector) {
        ServiceLocator.injector = this.injector;
    }
}
