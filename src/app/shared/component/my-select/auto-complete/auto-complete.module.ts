import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiAutoComplete } from './auto-complete';
import { FocusOnInit, NguiAutoCompleteComponent } from './auto-complete.component';
import { NguiAutoCompleteDirective } from './auto-complete.directive';


@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [NguiAutoCompleteComponent, NguiAutoCompleteDirective,FocusOnInit],
  exports:  [NguiAutoCompleteComponent, NguiAutoCompleteDirective,FocusOnInit],
  entryComponents: [NguiAutoCompleteComponent]
})
export class NguiAutoCompleteModule {
  static forRoot() {
    return {
      ngModule: NguiAutoCompleteModule,
      providers: [NguiAutoComplete]
    }
  }
}

