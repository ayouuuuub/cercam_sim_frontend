import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';

import { LogListComponent } from './log-list/log-list.component';
import { AuthGuard } from '../../shared/services/auth-guard.service';

const LogRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {path: 'list', component: LogListComponent},
      {path: '', redirectTo: 'list', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(LogRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LogRoutingModule {
}
