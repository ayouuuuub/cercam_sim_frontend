import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Parametrage } from '../../../shared/model/parametrage.model';
import { ActivatedRoute } from '@angular/router';
import { ParametrageService } from '../../../shared/services/parametrage.service';
import { ParametrageCriteria } from '../../../shared/model/parametrage.criteria';
import { BaseComponent } from '../../../shared/component/base-component';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-edit-color',
  templateUrl: './edit-color.component.html',
  styleUrls: ['./edit-color.component.css']
})
export class EditColorComponent extends BaseComponent implements OnInit, OnDestroy {

  public subscription: Subscription = new Subscription();
  public parametrages: Array<Parametrage> = [];
  public colorForm: FormGroup;

  constructor( public route: ActivatedRoute, vcRef: ViewContainerRef, public fb: FormBuilder,
               public toasterService: ToasterService, parametrageService: ParametrageService) {
       super();
       this.toasterService = toasterService;
  }

  ngOnInit() {
    if ( this.hasRole( 'ROLE_UPDATE_PARAMETRAGE' ) ) {
      this.initForm();
      this.loadParametrages();

    } else {
        this.showUnauthorizedError( true );
    }
  }

  initForm() {
    this.colorForm = this.fb.group({
      colors: this.fb.array([])
    })
  }

  get colors() : FormArray {
    return this.colorForm.get("colors") as FormArray
  }

  updateColors() {
    let loadingColor = this.colors.value.filter( color => color.code == "Loading Couleur").map( color => color.valeur)[0];
    let sideColor = this.colors.value.filter( color => color.code == "Couleur de bord").map( color => color.valeur)[0];
    let textColor = this.colors.value.filter( color => color.code == "Couleur de texte").map( color => color.valeur)[0];
    let bgColor = this.colors.value.filter( color => color.code == "Couleur de l'arriere plan (Menu)").map( color => color.valeur)[0];
    let fgColor = this.colors.value.filter( color => color.code=== "Couleur de selection (Menu)").map( color => color.valeur)[0];
    document.documentElement.style.setProperty('--backgroundcolor',bgColor);
    document.documentElement.style.setProperty('--textcolor',textColor);
    document.documentElement.style.setProperty('--darker-sidecolor',fgColor);
    document.documentElement.style.setProperty('--loadingcolor',loadingColor);
    document.documentElement.style.setProperty('--sidecolor',sideColor);
  }
  updateParametrages() {
    let parametrage: Parametrage = new Parametrage();
    for(let color of this.colors.value) {
      Object.assign(parametrage, color);
      parametrage.typeValeur = "COULEUR";

        this.parametrageService.updateParametrage(parametrage).subscribe(() => {
        this.showInfo("common.message.update.info");

      }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
    }
  }

  loadParametrages() {
    let parametrageCriteria: ParametrageCriteria = new ParametrageCriteria();
    if(this.route.snapshot.paramMap.keys.length == 0)
      parametrageCriteria.regionNull = "true";
    else
      parametrageCriteria.regionId = parseInt(this.route.snapshot.paramMap.get('id'));
    parametrageCriteria.typeValeur = "COULEUR";
      this.parametrageService.findParametragesByCriteria(parametrageCriteria)
        .subscribe(parametrage => {
          this.parametrages = parametrage;
          const colors = this.colorForm.get('colors') as FormArray;
          for (let color of this.parametrages) {
            colors.push(this.fb.group({
              id: new FormControl(color.id),
              code : new FormControl(color.code),
              valeur: new FormControl(color.valeur),
              region: new FormControl(color.region)
            }))
          }
          console.log(this.colorForm.controls.colors.value[0].valeur);
          // console.log(this.colorForm.controls[0].value.valeur);
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
