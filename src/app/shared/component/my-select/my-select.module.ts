import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NguiAutoCompleteModule } from "./auto-complete/auto-complete.module";
import { MySelectComponent } from "./my-select.component";
/**
 * Created by SoftAjd on 4/21/2017.
 */
@NgModule({
    imports: [
        NguiAutoCompleteModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        MySelectComponent
    ],
    exports:  [
        MySelectComponent,
        NguiAutoCompleteModule
    ]

})
export class MySelectModule {
}
