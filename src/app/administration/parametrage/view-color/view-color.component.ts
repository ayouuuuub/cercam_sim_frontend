import { ParametrageCriteria } from './../../../shared/model/parametrage.criteria';
import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../shared/component/base-component';
import { Subscription } from 'rxjs';
import { Parametrage } from '../../../shared/model/parametrage.model';
import { ParametrageService } from '../../../shared/services/parametrage.service';

@Component({
  selector: 'app-view-color',
  templateUrl: './view-color.component.html',
  styleUrls: ['./view-color.component.css']
})
export class ViewColorComponent extends BaseComponent implements OnInit, OnDestroy {

  public subscription: Subscription = new Subscription();
  public parametrages: Array<Parametrage> = [];

  constructor( public route: ActivatedRoute, vcRef: ViewContainerRef,
                parametrageService: ParametrageService) {

       super();
  }

  ngOnInit() {
    if ( this.hasRole( 'ROLE_READ_PARAMETRAGE' ) ) {
      this.loadParametrages();
    } else {
        this.showUnauthorizedError( true );
    }
  }



loadParametrages() {
  let parametrageCriteria: ParametrageCriteria = new ParametrageCriteria();
  console.log(this.route.snapshot.paramMap.keys.length > 0);
  if(this.route.snapshot.paramMap.keys.length == 0)
    parametrageCriteria.regionNull = "true";
  else
    parametrageCriteria.regionId = parseInt(this.route.snapshot.paramMap.get('id'));
  parametrageCriteria.typeValeur = "COULEUR";
    this.parametrageService.findParametragesByCriteria(parametrageCriteria)
        .subscribe(parametrage => {
                console.log(parametrage);
                this.parametrages = parametrage;
            }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
}

retour() {

  this.route.queryParams
          .subscribe(params => {
              if (params['b_'])
                  this.router.navigate(['/parametrage/list'], { queryParams: { b_: 1 } });
              else
                  this.router.navigate(['/parametrage/list']);

     });

  }
}
