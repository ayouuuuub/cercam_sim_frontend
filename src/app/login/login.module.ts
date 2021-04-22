import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../shared/auth/auth.guard';
import { AuthService } from '../shared/auth/auth.service';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { ServiceLocator } from '../shared/core/service-locator';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    LoginRoutingModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    UtilisateurService
  ]
})
export class LoginModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
