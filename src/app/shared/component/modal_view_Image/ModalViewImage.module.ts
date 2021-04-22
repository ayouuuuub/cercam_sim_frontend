
import { NgModule } from "@angular/core";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalViewImageComponent } from './ModalViewImage.component';
@NgModule({
    imports: [
        ModalModule.forRoot(),
    ],
    declarations: [
        ModalViewImageComponent
    ],
    providers: [

    ],
    exports:[ModalViewImageComponent]
})
export class  ModuleModalViewImage {
}
