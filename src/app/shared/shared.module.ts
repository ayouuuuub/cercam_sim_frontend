import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarloaderComponent } from './barloader/barloader.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ServiceLocator } from './core/service-locator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { BusyModule } from './component/busy/busy.module';
import { MySelectModule } from './component/my-select/my-select.module';
import { RouterModule } from '@angular/router';
import { AccessDeniedModule } from './component/access-denied/access-denied.module';
import { UploadComponent } from './component/file-upload/upload.component';
import { ModuleModalCustom } from './component/modalCustom/ModalCustom.module';
import { ModuleModalViewImage } from './component/modal_view_Image/ModalViewImage.module';
import { MyDatePickerModule } from './component/my-date-picker';
import { TranslateModule } from '@ngx-translate/core';
import { UtilityService } from './core/utility/utility.service';
import { BaseComponent } from './component/base-component';
import { FileUploadModule } from 'ng2-file-upload';
import { DebounceClickDirective } from './directives/debounce/debounce-click.directive';
import { DebounceMoveDirective } from './directives/debounce/debounce-move.directive';
import { DebounceOutDirective } from './directives/debounce/debounce-mouseout.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { MapControlService } from './services/map-control.service';
import { EnumService } from './services/enum.service';



@NgModule({
  declarations: [
    BarloaderComponent,
    UploadComponent,
    BaseComponent,
    DebounceClickDirective,
    DebounceMoveDirective,
    DebounceOutDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MySelectModule,
    BusyModule,
    ToasterModule.forRoot(),
    TranslateModule,
    FileUploadModule,
    ToasterModule.forRoot(),
    MatProgressBarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    AccessDeniedModule,
    MySelectModule,
    MyDatePickerModule,
    BusyModule,
    FileUploadModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    ToasterModule,
    ModuleModalCustom,
    ModuleModalViewImage,
    UploadComponent,
    NgSelectModule,
    DebounceClickDirective,
    DebounceMoveDirective,
    DebounceOutDirective
],
providers: [
    UtilityService,
    ToasterService,
    EnumService,
    MapControlService
],

})
export class SharedModule {
    constructor(private injector: Injector) {
        ServiceLocator.injector = this.injector;
    }
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}
