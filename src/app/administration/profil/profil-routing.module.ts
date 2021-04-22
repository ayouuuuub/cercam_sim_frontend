import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "../../layout/layout.component";

import { ProfilAddComponent } from "./profil-add/profil-add.component";
import { ProfilEditComponent } from "./profil-edit/profil-edit.component";
import { ProfilListComponent } from "./profil-list/profil-list.component";
import { ProfilViewComponent } from "./profil-view/profil-view.component";
import { AuthGuard } from "../../shared/services/auth-guard.service";
const ProfilRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {path: 'add', component: ProfilAddComponent},
            {path: 'list', component: ProfilListComponent},
            {path: 'view/:id', component: ProfilViewComponent},
            {path: 'edit/:id', component: ProfilEditComponent},
           	{path: '', redirectTo: 'list', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ProfilRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProfilRoutingModule {
}
