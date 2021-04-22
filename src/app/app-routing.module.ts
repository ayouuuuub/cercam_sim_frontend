import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },{
    path: 'utilisateur',
    loadChildren: () => import('./administration/utilisateur/utilisateur.module').then(m => m.UtilisateurModule)
  },{
    path: 'exploitation',
    loadChildren: () => import('./exploitation/exploitation.module').then(m => m.ExploitationModule)
  },{
    path: 'exploitant',
    loadChildren: () => import('./administration/exploitant/exploitant.module').then(m => m.ExploitantModule)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes , { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
