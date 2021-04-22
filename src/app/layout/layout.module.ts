import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthService } from '../shared/auth/auth.service';
import { AuthHttpService } from '../shared/services/auth-http.service';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { SharedModule } from '../shared/shared.module';
import { NotificationComponent } from './notification/notification.component';



@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    AuthHttpService,
    AuthService,
    UtilisateurService,

  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    // ChangemotpasseComponent,
  ],
  exports: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    // ChangemotpasseComponent,
  ]
})
export class LayoutModule { }
