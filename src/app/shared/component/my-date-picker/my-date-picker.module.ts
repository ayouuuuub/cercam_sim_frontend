import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FocusDirective } from "./directives/my-date-picker.focus.directive";
import { MyDatePicker } from "./my-date-picker.component";

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [MyDatePicker, FocusDirective],
    exports: [MyDatePicker, FocusDirective]
})
export class MyDatePickerModule {
}
