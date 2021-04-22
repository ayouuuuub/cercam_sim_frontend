import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/component/base-component';

declare let $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BaseComponent implements OnInit {
  public mini = true;
  constructor() {
    super();
   }

  ngOnInit(): void {
    $('.sidebar a').hover(function() {
        if(!$(this).hasClass('disabled')) {
          $('.sidebar a').removeClass('hover prevsibling nextsibling');
          $(this).addClass('hover');
          $(this).prev().addClass('prevsibling')
          $(this).next().addClass('nextsibling')
        }
      })
      $('.sidebar a').click(function() {
        if(!$(this).hasClass('disabled')) {
          $('.sidebar a').removeClass('active hover prevsibling nextsibling');
          $(this).addClass('active');
          $(this).prev().addClass('prevsibling')
          $(this).next().addClass('nextsibling')
        }
    })
  }
}
