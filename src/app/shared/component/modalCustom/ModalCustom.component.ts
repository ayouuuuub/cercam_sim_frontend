import { Component, Input } from '@angular/core';


@Component({
 selector: 'modalCustom', 
 templateUrl: './ModalCustom.html',
 styleUrls: ['./ModalCustom.component.scss'],
})

export class  ModalCustomComponent     {

 @Input('TitreHeader')
 public TitreHeader ;

 @Input('size')
 public size ="modal-lg";

 @Input('closeIcon')
 public closeIcon = false;

 @Input('id-modal')
 public id="openModal";

@Input('ignoreBackdropClick') 
 ignoreBackdropClick=false;

 public show=false;
 
@Input('backgroundBackdrop')
 background="rgba(0,0,0,0.5)";

 public showViewModal():void {
     this.show=true
 }
 public hideViewModal():void {
   this.show=false
 }
 public hideback(event){
     if(event.currentTarget === event.target) if(this.ignoreBackdropClick) this.hideViewModal() ;
 }
constructor( ){
  
} 
 

}

