import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AccessDeniedComponent } from "./access-denied.component";

@NgModule( {
    imports: [
        CommonModule
    ],
    declarations: [
        AccessDeniedComponent
    ],
    exports: [
        AccessDeniedComponent,
      
    ],
    providers: [],
})
export class AccessDeniedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AccessDeniedModule
        };
    }
}
