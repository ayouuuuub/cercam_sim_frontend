import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FocusDirective } from "./directives/my-date-picker.focus.directive";
import { InputAutoFillDirective } from "./directives/my-date-picker.input.auto.fill.directive";
import { MyDatePicker } from "./my-date-picker.component";
//import {TextMaskModule} from "angular2-text-mask";


@NgModule({
    imports: [CommonModule, FormsModule
        //,TextMaskModule
    ],
    declarations: [MyDatePicker, FocusDirective, InputAutoFillDirective],
    exports: [MyDatePicker, FocusDirective, InputAutoFillDirective]
})
export class MyDatePickerModule {
}
