import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceLocator } from './shared/core/service-locator';
import { AuthHttpService } from './shared/services/auth-http.service';
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './shared/core/core.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { APP_BASE_HREF } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { JwtModule } from '@auth0/angular-jwt';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader (http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule,
    SharedModule.forRoot(),
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
    }),
  ],
  providers: [
    AuthHttpService,
    ToasterService,
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
      ServiceLocator.injector = this.injector;
  }
}
