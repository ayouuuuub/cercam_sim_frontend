import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-barloader',
  templateUrl: './barloader.component.html',
  styleUrls: ['./barloader.component.scss'],

})
export class BarloaderComponent implements OnInit {

  @Input() progress: number;
  @Input() total: number;

  constructor() { }

  startCounter() {
    const remaining = 100 - this.progress;

    this.progress = this.progress + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));

    setTimeout(this.startCounter, 20);
  }

  ngOnInit() {
    this.startCounter();
   }


}
