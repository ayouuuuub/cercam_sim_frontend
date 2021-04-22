import { ToasterService } from 'angular2-toaster';
import { Component, HostBinding, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/component/base-component';

declare var $: any;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends BaseComponent implements OnInit {
  hiddenvalue : boolean = true;
  constructor(public toasterService: ToasterService) {
    super();
    this.toasterService = toasterService
   }

  ngOnInit(): void {
  }

  showSidebar() {
    if(this.hiddenvalue) {
      document.getElementById("mySidebar").style.width = "250px";
      this.hiddenvalue = false;
    }
  }
  onClickOutside(event) {
    const menuValue: number = event['text'];
    const n = menuValue ;
    if(event && event['value'] === true  && n == 1 && this.hiddenvalue === true) {
     this.hiddenvalue = false;
      $('section').css({ 'padding-left' : '0px'});
      $('#footer').css({ 'padding-left' : '0px'})
    }
  }
}
