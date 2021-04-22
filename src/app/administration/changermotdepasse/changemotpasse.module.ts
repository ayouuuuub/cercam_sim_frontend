import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { ServiceLocator } from '../../core/service-locator';
import { LayoutModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { ChangemotpasseRoutingModule } from './changemotpasse-routing.module';
import { ChangemotpasseComponent } from './changemotpasse/changemotpasse.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LayoutModule,
    ChangemotpasseRoutingModule
  ],
  declarations: [
    ChangemotpasseComponent
  ]
})
export class ChangemotpasseModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
 }
