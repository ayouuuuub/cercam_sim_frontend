
import { CommonModule } from "@angular/common";
import { Injector, NgModule } from "@angular/core";
import { DataTableModule } from "ng2-data-table";
import { LayoutModule } from "../../layout/layout.module";

import { MyDataTableModule } from '../../shared/component/my-datatable/DataTableModule';
import { SharedModule } from "../../shared/shared.module";

import { TranslatePipe } from './translate/translate.pipe';

import { UtilisateurAddComponent } from "./utilisateur-add/utilisateur-add.component";
import { UtilisateurRoutingModule } from "./utilisateur-routing.module";
import { UtilisateurService } from "../../shared/services/utilisateur.service";

import { TranslateService } from './translate/translate.service';
import { ServiceLocator } from "src/app/shared/core/service-locator";
import { UtilityService } from "src/app/shared/core/utility/utility.service";


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        UtilisateurRoutingModule,
        LayoutModule,
        DataTableModule,
        MyDataTableModule,
    ],
    exports: [TranslatePipe],
    declarations: [
        UtilisateurAddComponent,
        TranslatePipe
    ],
    providers: [
 		    UtilisateurService,
        TranslateService,
        UtilityService,
    ],
})

export class UtilisateurModule {
    constructor(private injector: Injector) {
        ServiceLocator.injector = this.injector;
    }
}
