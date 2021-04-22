
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "../../layout/layout.component";
import { AuthGuard } from "../../shared/services/auth-guard.service";

import { ParametrageAddComponent } from "./parametrage-add/parametrage-add.component";
import { ParametrageEditComponent } from "./parametrage-edit/parametrage-edit.component";
import { ParametrageListComponent } from "./parametrage-list/parametrage-list.component";
import { ParametrageViewComponent } from "./parametrage-view/parametrage-view.component";
import { ListNominationComponent } from './list-nomination/list-nomination.component';
import { ViewNominationComponent } from './view-nomination/view-nomination.component';
import { EditNominationComponent } from './edit-nomination/edit-nomination.component';
import { ViewColorComponent } from './view-color/view-color.component';
import { ListColorComponent } from './list-color/list-color.component';
import { EditColorComponent } from './edit-color/edit-color.component';


const ParametrageRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {path: 'add', component: ParametrageAddComponent},
            {path: 'list', component: ParametrageListComponent},
            {path: 'list-nomination', component: ListNominationComponent},
            {path: 'list-color', component: ListColorComponent},
            {path: 'view-color/national', component: ViewColorComponent},
            {path: 'view-color/:id', component: ViewColorComponent},
            {path: 'edit-color/national', component: EditColorComponent},
            {path: 'edit-color/:id', component: EditColorComponent},
            {path: 'view-nomination', component: ViewNominationComponent},
            {path: 'view/:id', component: ParametrageViewComponent},
            {path: 'edit/:id', component: ParametrageEditComponent},
           	{path: '', redirectTo: 'list', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ParametrageRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ParametrageRoutingModule {
}

