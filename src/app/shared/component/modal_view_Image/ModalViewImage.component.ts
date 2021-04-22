import { Component, Input } from '@angular/core';

declare let $: any;

@Component({
 selector: 'ModalViewImage', 
 templateUrl: './ModalViewImage.html',
 styleUrls: ['./ModalViewImage.component.scss'],
})

export class  ModalViewImageComponent     {

 @Input('TitreHeader')
 public TitreHeader ;

 @Input('size')
 public size ="modal-lg";

 @Input('closeIcon')
 public closeIcon = false;

 @Input('id-modal')
 public id="openModal";

@Input('ignoreBackdropClick') 
 ignoreBackdropClick=true;

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
    // //console.log(event.currentTarget , event.target)
 /*     if(event.currentTarget === event.target)  */
     if(!$(event.target).is('img')) if(this.ignoreBackdropClick) this.hideViewModal() ;
 }
constructor( ){
  
} 
 

}

