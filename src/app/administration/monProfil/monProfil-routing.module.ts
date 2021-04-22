import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "../../layout/layout.component";

import { ProfilAddComponent } from "./monProfil-add/monProfil-add.component";
import { ProfilEditComponent } from "./monProfil-edit/monProfil-edit.component";
import { ProfilListComponent } from "./monProfil-list/monProfil-list.component";
import { ProfilViewComponent } from "./monProfil-view/monProfil-view.component";
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
            {path: 'view', component: ProfilViewComponent},
            {path: 'edit', component: ProfilEditComponent},
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
export class monProfilRoutingModule {
}
