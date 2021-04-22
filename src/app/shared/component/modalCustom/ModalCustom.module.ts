
import { NgModule } from "@angular/core";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalCustomComponent } from './ModalCustom.component';
@NgModule({
    imports: [
        ModalModule.forRoot(),
    ],
    declarations: [
        ModalCustomComponent
    ],
    providers: [

    ],
    exports:[ModalCustomComponent]
})
export class  ModuleModalCustom {
}
