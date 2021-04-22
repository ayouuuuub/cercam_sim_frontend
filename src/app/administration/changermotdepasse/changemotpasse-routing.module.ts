import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';


import { ChangemotpasseComponent } from './changemotpasse/changemotpasse.component';
import { AuthGuard } from '../../shared/services/auth-guard.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';

const ChangePasseRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {path: 'Change', component: ChangemotpasseComponent},
      {path: '', redirectTo: 'Change', pathMatch: 'full'}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(ChangePasseRoutes)],
  exports: [RouterModule],
  providers: [UtilisateurService]
})
export class ChangemotpasseRoutingModule { }
