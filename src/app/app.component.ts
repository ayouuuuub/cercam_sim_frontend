import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SettingsService } from './shared/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  mySubscription: any;

  constructor(public settings: SettingsService, public router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
         // Trick the Router into believing it's last link wasn't previously loaded
         this.router.navigated = false;
      }
    });
  }
  title = 'CERCAM-FRONTEND';

  ngOnInit() {
    // $(document).on('click', '[href="#"]', e => e.preventDefault());

    // myExtObject.initMapPrint.printValueOfTheMap('Fonds        : Carte topographique');
    // myExtObject.init(this, null, true);
  }

  ngOnDestroy(){
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
