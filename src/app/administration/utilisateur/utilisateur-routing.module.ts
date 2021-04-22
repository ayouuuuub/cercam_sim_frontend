import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "src/app/layout/layout/layout.component";
import { AuthGuard } from "src/app/shared/auth/auth.guard";

import { UtilisateurAddComponent } from "./utilisateur-add/utilisateur-add.component";
const UtilisateurRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {path: 'add', component: UtilisateurAddComponent},
           	{path: '', redirectTo: 'list', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(UtilisateurRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class UtilisateurRoutingModule {
}
