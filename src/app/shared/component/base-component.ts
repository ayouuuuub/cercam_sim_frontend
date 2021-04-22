import { CanalVenteCriteria } from './../models/canal_vente.criteria';
import { Marche } from './../models/marche.model';
import { enableProdMode } from '@angular/core';
import { UtilisateurService } from './../services/utilisateur.service';
import { NavigationEnd, Router } from "@angular/router";
import { ToasterService, ToasterConfig } from "angular2-toaster";

import { BusyComponent } from '../../shared/component/busy/busy.component';
import { saveAs as importedSaveAs } from "file-saver";
import { FormGroup, FormControl } from '@angular/forms';
import { OnDestroy, Component } from '@angular/core';
// import { IMyOptions } from "mydatepicker/dist/interfaces";
import { SettingsService } from "../services/settings.service";

import { Subject } from 'rxjs';
import { TranslatorService } from '../core/translator/translator.service';
import { BaseCriteria } from '../models/base-criteria';
import { BaseModel } from '../models/base-model';
import { Base64 } from '../core/utility/webtoolkit.base64';
import { ServiceLocator } from '../core/service-locator';
import { convertToCSV } from '../core/utility/helper';
import { IMyDpOptions } from './my-date-picker';
import { CercleCriteria } from '../models/cercle.criteria';
import { CommuneCriteria } from '../models/commune.criteria';
import { ProvinceCriteria } from '../models/province.criteria';
import { RegionCriteria } from '../models/region.criteria';
import { CercleService } from '../services/cercle.service';
import { CommuneService } from '../services/commune.service';
import { ProvinceService } from '../services/province.service';
import { RegionService } from '../services/region.service';

import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import { transform } from 'ol/proj';
import { Vector as VectorLayer} from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import {Stroke, Fill, Style, Text} from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import {Control, defaults as defaultControls} from 'ol/control';

import { MapControlService } from '../services/map-control.service';
import { EnumService } from '../services/enum.service';
import { CanalVente } from '../models/canal_vente.model';
import { Mechanisme } from '../models/mechanisme.model';
import { QualiteProduit } from '../models/qualite_produit.model';
import { StabilitePrix } from '../models/stabilite_prix.model';
import { Technicite } from '../models/technicite.model';
import { Valorisation } from '../models/valorisation.model';
import { ActiviteService } from '../services/activite.service';
import { CanalVenteService } from '../services/canal_vente.service';
import { DensiteService } from '../services/densite.service';
import { ExploitationService } from '../services/exploitation.service';
import { MarcheService } from '../services/marche.service';
import { MechanismeService } from '../services/mechanisme.service';
import { ProduitService } from '../services/produit.service';
import { QualiteProduitService } from '../services/qualite_produit.service';
import { StabilitePrixService } from '../services/stabilite_prix.service';
import { TechniciteService } from '../services/technicite.service';
import { ValorisationService } from '../services/valorisation.service';
import { VarieteService } from '../services/variete.service';

declare let myExtObject: any;
declare let $:any;
@Component({
  template: `
  <toaster-container></toaster-container>`
})
export class BaseComponent implements OnDestroy {
  protected translator: TranslatorService;
  settings: SettingsService;
  mapControlService :MapControlService;
  protected router: Router;
  public utilisateurService: UtilisateurService;
  protected regionService: RegionService;
  protected provinceService: ProvinceService;
  protected communeService: CommuneService;
  protected cercleService: CercleService;
  protected toasterService: ToasterService;
  public exploitationService: ExploitationService;
  public produitService: ProduitService;
  public varieteService: VarieteService;
  public densiteService: DensiteService;
  public mechanismeService: MechanismeService;
  public techniciteService: TechniciteService;
  public marcheService: MarcheService;
  public canalVenteService: CanalVenteService;
  public valorisationService: ValorisationService;
  public stabilitePrixService: StabilitePrixService;
  public qualiteProduitService: QualiteProduitService;
  public activiteService: ActiviteService;
  public enumService: EnumService;

  toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    showCloseButton: false,
  });
  public map: Map;
  initLayer: VectorLayer;
  protected busy: BusyComponent = new BusyComponent();
  locale = 'fr';
  protected validMessage = '';
  options: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    indicateInvalidDate: false
  };
  layerStyle = new Style({
    stroke: new Stroke({
      color: '#b4cdf5',
      width: 1,
    }),
    fill: new Fill({
      color : '#ccefb9'
    }),
    text: new Text({
      font: 'bold 10px Calibri,sans-serif',
      offsetX: '-20',
      offsetY: '-20',
      fill: new Fill({
          color: '#000'
      }),
      overflow: true,
    })
  });
  currentUser: any;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor() {
    this.settings = ServiceLocator.injector.get(SettingsService);
    this.router = ServiceLocator.injector.get(Router);
    this.toasterService = ServiceLocator.injector.get(ToasterService);
    this.translator = ServiceLocator.injector.get(TranslatorService);
    this.mapControlService = ServiceLocator.injector.get(MapControlService);

    this.enumService = ServiceLocator.injector.get(EnumService);

    this.utilisateurService = ServiceLocator.injector.get(UtilisateurService);

    this.regionService = ServiceLocator.injector.get(RegionService);
    this.provinceService = ServiceLocator.injector.get(ProvinceService);
    this.communeService = ServiceLocator.injector.get(CommuneService);
    this.cercleService = ServiceLocator.injector.get(CercleService);

    this.validMessage = this.translator.instant("common.message.valid.date");
    this.currentUser = this.getCurrentUser();
    // if(!this.currentUser)
    //   this.logout();
    //const token = this.getJWT();
    // this.getRegionIds();
    //myExtObject.init(this,true);
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        // This aborts all HTTP requests.
        this.ngUnsubscribe.next();
        // This completes the subject properlly.
        this.ngUnsubscribe.complete();
        this.removeBusy();
      }
    });
  }
  getMarcheList() {
    return new Promise((resolve)=> {
      this.marcheService.getMarcheList().subscribe((marches: Marche[]) => {
        resolve(marches);
      });
    })
  }
  getMechanisation() {
    return new Promise((resolve)=> {
      this.mechanismeService.getMechanismeList().subscribe((mechanismes: Mechanisme[]) => {
        resolve(mechanismes);
      });
    })
  }
  getTechnicite() {
    return new Promise((resolve)=> {
      this.techniciteService.getTechniciteList().subscribe((technicites: Technicite[]) => {
        resolve(technicites);
      });
    })
  }
  getCanalVentes(criteria: CanalVenteCriteria){
    return new Promise((resolve)=> {
      this.canalVenteService.findCanalVentesByCriteria(criteria).subscribe((canalVentes: CanalVente[]) => {
        resolve(canalVentes);
      });
    })
  }
  getValorisations() {
    return new Promise((resolve)=> {
      this.valorisationService.getValorisationList().subscribe((valorisations: Valorisation[]) => {
        resolve(valorisations);
      });
    })
  }
  getStabilitePrix() {
    return new Promise((resolve)=> {
      this.stabilitePrixService.getStabilitePrixList().subscribe((stabilitesPrix: StabilitePrix[]) => {
        resolve(stabilitesPrix);
      });
    })
  }
  getQualitesPrix() {
    return new Promise((resolve)=> {
      this.qualiteProduitService.getQualiteProduitList().subscribe((qualitesProduit: QualiteProduit[]) => {
        resolve(qualitesProduit);
      });
    })
  }

  calculZoomInitial() {
    let initialZoom;
    let windowWidth = $(window).width();
    if (windowWidth < 601) {
        initialZoom = 4.5;
    } else if (windowWidth < 993) {
        initialZoom = 5;
    } else if (windowWidth < 1537) {
        initialZoom = 5.4
    } else if (windowWidth < 2700) {
        initialZoom = 6
    } else {
        initialZoom = 6;
    }
    return initialZoom;
  }
  extentLayer() {
    let self = this;
    this.initLayer.getSource().on('change', function() {
      if (self.initLayer.getSource().getState() == 'ready') {
        var extent = self.initLayer.getSource().getExtent();
        self.map.getView().fit(extent, self.map.getSize());
      }
    })
  }


  initMap() {
    let self = this;
    let urlvector = this.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + this.settings.geo.dataBase + ':' + this.settings.geo.RegLayer + "&outputFormat=application%2Fjson";
        console.log(urlvector);


    var vectorSource = new VectorSource({
          format: new GeoJSON(),
          url: urlvector,
    });

    this.initLayer = new VectorLayer({
      source: vectorSource,
      style: function(feature) {
        self.layerStyle.getText().setText(feature.get('libelle'));
        return self.layerStyle;
      },
    });

    this.initLayer.setZIndex(10);
    this.map = new Map({
      layers: [
        this.initLayer
       ],
      target: 'map',
      view: new View({
        center: transform([-10.5, 29.05], 'EPSG:4326', 'EPSG:3857'),
        zoom: 5.6,
      }),
    });
    //filter and chart controls
    var leftElements = document.createElement('div');
    leftElements.className = 'ol-unselectable ol-control';
    leftElements.style.cssText = "top: 15px; left: .5em;z-index: 1";
    this.mapControlService.filterButton(leftElements);
    this.mapControlService.chartButton(leftElements);
    let addControl = new Control({
      element: leftElements
    });
    this.map.addControl(addControl);
    //home control
    var homeElement = document.createElement('div');
    homeElement.className = 'ol-unselectable ol-control';
    homeElement.style.cssText = "top: 15px; right: .5em;z-index: 1";
    this.mapControlService.homeButton(homeElement, this.initLayer, this.map);
    addControl = new Control({
      element: homeElement
    });
    this.map.addControl(addControl);
    //native Controls(Layer Switcher, measurement, x/y coordinates)
    var navigationElement = document.createElement('div');
    navigationElement.className = 'ol-unselectable ol-control';
    navigationElement.style.cssText = "top: 126px; right: .5em;z-index: 1";
    this.mapControlService.layerSwitcherButton(navigationElement);
    this.mapControlService.coordButton(navigationElement);
    this.mapControlService.measureButton(navigationElement);
    addControl = new Control({
      element: navigationElement
    });
    this.map.addControl(addControl);
    //legend + print
    var bottomElement = document.createElement('div');
    bottomElement.className = 'ol-unselectable ol-control';
    bottomElement.style.cssText = "bottom: 15px; right: .5em;z-index: 1";
    this.mapControlService.legendButton(bottomElement);
    this.mapControlService.printButton(bottomElement, this.map);
    addControl = new Control({
      element: bottomElement
    });
    this.map.addControl(addControl);
  }
  loadRegionMap() {
    let urlvector = this.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + this.settings.geo.dataBase + ':' + this.settings.geo.RegLayer + "&outputFormat=application%2Fjson";

    var vectorSource = new VectorSource({
          format: new GeoJSON(),
          url: urlvector,
    });
    this.initLayer.setSource(vectorSource);
    this.initLayer.setZIndex(10);
    this.extentLayer();
  }
  loadProvinceMap(idRegion) {
    let self = this;
    let urlvector = this.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + this.settings.geo.dataBase + ':' + this.settings.geo.RegPrvLayer + "&outputFormat=application%2Fjson&viewparams=regionid:"+idRegion;
    var vectorSource = new VectorSource({
          format: new GeoJSON(),
          url: urlvector,
    });
    this.initLayer.setSource(vectorSource);
    this.initLayer.setZIndex(10);
    this.extentLayer();
  }
  loadCercleMap(idProvince) {
    let self = this;
    let urlvector = this.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + this.settings.geo.dataBase + ':' + this.settings.geo.PrvCerLayer + "&outputFormat=application%2Fjson&viewparams=provinceid:"+idProvince;
        console.log(urlvector);
    var vectorSource = new VectorSource({
          format: new GeoJSON(),
          url: urlvector,
    });
    this.initLayer.setSource(vectorSource);
    this.initLayer.setZIndex(10);
    this.extentLayer();
  }
  loadCommuneMap(idCercle) {
    let self = this;
    let urlvector = this.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + this.settings.geo.dataBase + ':' + this.settings.geo.CerCmnLayer + "&outputFormat=application%2Fjson&viewparams=cercleid:"+idCercle;
        console.log(urlvector);
    var vectorSource = new VectorSource({
          format: new GeoJSON(),
          url: urlvector,
    });
    this.initLayer.setSource(vectorSource);
    this.extentLayer();
    this.initLayer.setZIndex(10);
  }

  //c
  // getPublicUser() {
  //   return new Promise((resolve) => {
  //     this.utilisateurService.getPublicUser().subscribe(
  //       list => {
  //         resolve(list);
  //       }
  //     )
  //   })
  // }
  getProvinces(criteria : ProvinceCriteria ){
    return new Promise((resolve) => {
      this.provinceService.findMinimalProvincesByCriteria(criteria).subscribe(
        list => {
          resolve(list);
        })
    })
  }

  getCommunes(criteria : CommuneCriteria ) {
    return new Promise((resolve) => {
      this.communeService.findMinimalCommunesByCriteria(criteria).subscribe(
        list => {
          resolve(list);
        })
    })
  }

  getCercles(criteria: CercleCriteria) {
    return new Promise((resolve) => {
      this.cercleService.findMinimalCerclesByCriteria(criteria).subscribe(
        list => {
          resolve(list);
        }
      )
    })
  }


  getRegions(criteria: RegionCriteria) {
    return new Promise((resolve) => {
      this.regionService.findMinimalRegionsByCriteria(criteria).subscribe(
        list => {
          resolve(list);
        }
      )
    })
  }

  // getRegion(id: number) {
  //   return new Promise((resolve) => {
  //     this.regionService.getRegion(id).subscribe(
  //       region => {
  //         resolve(region);
  //       }
  //     )
  //   })
  // }






  addBusy() {
    this.busy.addBusy();
  }

  removeBusy() {
    this.busy.removeBusy();
  }

  hasDefaultPassword(): boolean {
    if (this.currentUser && this.currentUser.defaultPassword) {
      return true
    }

    return false
  }
  /***
   * End Function
   */

  changeFormInvalide(form: FormGroup) {
    form.valueChanges.subscribe(data => {
      for (const inner in form.controls) {
        if (form.controls[inner].valid && form.controls[inner].enabled) {
          $("[formcontrolname='" + inner + "']").closest('.form-group').removeClass('has-error', 1000);
          $("[name='" + inner + "']").closest('.form-group').removeClass('has-error', 1000);
        }
      }
    })
  }

  resetValidateForm(form: FormGroup) {
    for (const inner in form.controls) {
      $("[formcontrolname='" + inner + "']").closest('.form-group').removeClass('has-error', 1000);
      $("[name='" + inner + "']").closest('.form-group').removeClass('has-error', 1000);
    }

  }

  detectInvalideFormControle(form: FormGroup, focus?: boolean, top?: number) {
    if (!top) top = 100
    let targetPremier = null;
    for (const target in form.controls) {
      if (form.controls[target] && !form.controls[target].valid && form.controls[target].enabled && form.controls[target] instanceof FormControl) {

        if (!targetPremier) {
          // //console.log(target,form.controls[target])
          targetPremier = target

        }
        if ($("[formcontrolname='" + target + "']")[0]) $("[formcontrolname='" + target + "']").closest('.form-group').addClass('has-error', 1000);
        if ($("[name='" + target + "']")[0]) $("[name='" + target + "']").closest('.form-group').addClass('has-error', 1000);

        form.get(target).markAsTouched();
        form.get(target).markAsDirty();
        form.get(target).updateValueAndValidity();
      } else {
        if ($("[formcontrolname='" + target + "']")[0]) $("[formcontrolname='" + target + "']").closest('.form-group').removeClass('has-error', 1000);
        if ($("[name='" + target + "']")[0]) $("[name='" + target + "']").closest('.form-group').removeClass('has-error', 1000);
      }
    }

    if (!focus && targetPremier) {
      if ($("[formcontrolname='" + targetPremier + "']")[0]) {
        $("[formcontrolname='" + targetPremier + "']").each(function () {
          this.focus();
          if ($(this).offset().top > 0 || $(this).offset().top > top) $('html,body').animate({ scrollTop: $(this).offset().top - top }, 'slow');
        });
      } else if ($("[name='" + targetPremier + "']")[0]) {

        $("[name='" + targetPremier + "']").each(function () {
          this.focus();

          if ($(this).offset().top > 0 || $(this).offset().top > top) $('html,body').animate({ scrollTop: $(this).offset().top - top }, 'slow');
        });
      }
      //  //console.log(targetPremier," test 1 ",focus)
      focus = true
    }

    return focus;
  }

  getFile(response: Response, name): File {

    let contentType = response.headers.get("Content-Type");
    const blob = new Blob([this.getResponseBody(response)], { type: contentType });
    if (contentType.lastIndexOf(";") >= 0)
      contentType = contentType.substring(0, contentType.indexOf(';'));
    const file = new File([blob], this.getFileName(name), { type: contentType, lastModified: Date.now() });

    return file;
  }

  getFileName(path) {
    return path.match(/[-_\w]+[.][\w]+$/i)[0];
  }

  protected showError(status: number, message: string | any) {
    this.removeBusy();
    switch (status) {
      case 401:
        this.showUnauthorizedError();
        this.logout()
        break;
      case 0:
        this.toasterService.pop('error', 'Erreur', this.translator.instant('accesServeur.message.error'));
        setTimeout(() => {
          this.logout();
        }, 2000);

        break;
      default:
//        this.toasterService.pop('error', 'Erreur', this.translator.instant(message));
          this.toasterService.pop('error', 'Erreur', (message));
    }
  }

  protected showFileError(status: number) {
    this.removeBusy();
    switch (status) {
      case 401:
        this.showUnauthorizedError();
        this.router.navigate(['/login']);
        break;
      case 404:
        this.toasterService.pop('error', 'Erreur', this.translator.instant('common.message.fileNotFound'));
        break;
      default:
        this.toasterService.pop('error', 'Erreur', this.translator.instant('erreur.message'));
    }
  }

  protected showErrorMessage(message: string | any) {
    this.removeBusy();
    if (message)
      this.toasterService.pop('error', 'Erreur', this.translator.instant(message));
  }


  protected showCustomError(message: string) {
    if (message) {
      this.toasterService.pop('error', 'Erreur', message);
    }
  }
  protected showCustomWarning(message: string) {
    if (message) {
      this.toasterService.pop('warning', 'Information', message);
    }
  }
  /**
   End Funtion
   */
  protected showCustomInfo(message: string) {
    if(message)
      this.toasterService.pop('success', 'Message', message);
  }


  protected showUnauthorizedError(redirect?: boolean) {
    this.removeBusy()
    console.log('re');
    this.toasterService.pop('error', this.translator.instant('accesControle.title'), this.translator.instant('accesControle.description'));
    console.log('red');
    if (redirect){
      console.log('redirecting');
      this.logout()
    }


  }

  showInfo(info: string | any) {
    this.removeBusy();
    this.toasterService.pop('success', this.translator.instant('common.text.info'), this.translator.instant(info));
  }

  showWarning(warning: string | any) {
    this.removeBusy();
    this.toasterService.pop('warning', this.translator.instant('common.text.warning'), this.translator.instant(warning));
  }

  download(dataList: Array<any>) {
    const csvData = convertToCSV(dataList);
    const a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    const blob = new Blob([csvData], { type: 'text/csv;charset=UTF-8' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'export.csv';
    a.click();
  }

  downloadFile(response: Blob,filename :string) {
    console.log(response);
    const blob = new Blob([this.getResponseBody(response)], { type: response.type });
    this.removeBusy();
    // let fileName: any = response.headers.get("etag");
    importedSaveAs(response, filename);
  }


  getPaginationParams(Criteria: BaseCriteria, first: number, rows: number, sortField: string, sortOrder: string) {
    if (Criteria) {
      Criteria.page = first;
      Criteria.maxResults = rows;
      Criteria.sortField = sortField;
      Criteria.sortOrder = sortOrder;
    }
  }

  // confirmDialog(modal: Modal, message?: string, title?: string, okBtn?: string, cancelBtn?: string) {
  //   title = !title ? 'common.text.confirmation' : title;
  //   okBtn = !okBtn ? 'common.text.yes' : okBtn;
  //   cancelBtn = !cancelBtn ? 'common.text.no' : cancelBtn;
  //   message = !message ? 'common.message.confirm.deleteAll' : message;
  //   return modal.confirm()
  //     .showClose(true)
  //     .title(this.translator.instant(title))
  //     .keyboard(27)
  //     .okBtn(this.translator.instant(okBtn))
  //     .cancelBtn(this.translator.instant(cancelBtn))
  //     .message("<h5>" + this.translator.instant(message) + "</h5>");
  // }

  idsToObjects(items: any[]) {
    if (items) {
      const results: any[] = [];
      for (const item of items) {
        results.push(new BaseModel(item.id));
      }
      return results;
    }

    return null;

  }

  objectToIds(items: any[]) {
    if (items) {
      const results: Array<number> = [];
      for (const item of items) {
        results.push(item);
      }
      return results;
    }

    return null;

  }

  uniqueID() {

    const id = Date.now() + Math.random();

    return Math.floor(id);
  }

  renameFile(fileName: string) {
    try {
      const extension = fileName.substring(fileName.lastIndexOf('.'));
      return this.uniqueID() + extension;

    } catch (e) {
      return this.uniqueID() + '';
    }
  }


  validateFile(file: File): boolean {
    console.log( file );
    const accept = {
      binary: ["image/*"],
      text: ["image/jpeg", "image/gif", "image/png", "image/jpg", "image/bmp", "text/plain", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "application/json"]
    };
    // if (accept.text.indexOf(file.type) == -1) {

    //   this.showErrorMessage('common.message.formatNotSopported');
    //   return false;
    // } else if (file.size > 10485760) {
    //   this.showErrorMessage('common.message.invalidSizeMessage');
    //   return false;
    // } else if (file.size <= 0) {
    //   this.showErrorMessage('common.message.invalidSize');
    //   return false;
    // }

    return true;
  }

  validateImage(file: File): boolean {

    const accept = {
      binary: ["image/*"],
      text: ["image/jpeg", "image/gif", "image/png", "image/jpg"]
    };
    ////console.log( file.type );
    if (accept.text.indexOf(file.type) == -1) {
      this.showErrorMessage('common.message.formatNotSopported');
      return false;
    } else if (file.size == 0 || file.size > 10485760) {
      this.showErrorMessage('common.message.invalidSizeMessage');
      return false;
    }

    return true;
  }

  strToHex(str: string) {
    let clr;
    if (str === 'BLEU') {
      clr = '#4286f4';
    } else if (str === 'ROUGE') {
      clr = '#f45241';
    } else if (str === 'ORANGE') {
      clr = '#f4b241';
    } else if (str === 'JAUNE') {
      clr = '#f4e541';
    } else if (str === 'VERT') {
      clr = '#46f441';
    } else if (str === 'VIOLET') {
      clr = '#9a41f4';
    } else {
      clr = '#6d6d6d';
    }
    return clr;
  }
  getResponseBody(response: any) {
    return response['_body'];
  }

  getCurrentUser() {
    if (localStorage.getItem('currentUser'))
      return JSON.parse(Base64.decode(localStorage.getItem('currentUser')));
    return null;
  }
  getNominationsCache( ) {
    if (localStorage.getItem('nominations'))
      return JSON.parse(Base64.decode(localStorage.getItem('nominations')));
    return null;
  }
  getJWT() {
    if (localStorage.getItem('jwt'))
      return JSON.parse(Base64.decode(localStorage.getItem('jwt')));
    return null;
  }

  getRegionIds() {
    if (localStorage.getItem('regionIds'))
      myExtObject.inRegion = JSON.parse(Base64.decode(localStorage.getItem('regionIds')));
    if (localStorage.getItem('regionsIds'))
      myExtObject.inRegions = JSON.parse(Base64.decode(localStorage.getItem('regionsIds')));
    if (localStorage.getItem('decoupageId'))
      myExtObject.decoupageId = JSON.parse(Base64.decode(localStorage.getItem('decoupageId')));
    if (localStorage.getItem('decoupageIdsin'))
      myExtObject.decoupageIdsin = JSON.parse(Base64.decode(localStorage.getItem('decoupageIdsin')));

    // console.log(myExtObject.inRegion, myExtObject.inRegions, myExtObject.decoupageId, myExtObject.decoupageIdsin);
  }

  hasRole(role_: string) {
    if (this.currentUser) {
      const roles: string[] = this.currentUser.rolesByDomain;
      if (roles) {
        const index = roles.findIndex(element => element === role_);
        if (index >= 0)
          return true;
      }
    }
    return false;
  }

  hasAnyRoles(roles: string[]) {
    if (roles && roles.length > 0) {
      for (const role of roles) {
        if (role && role != '' && this.hasRole(role)) {
          return true;
        }
      }
    }

    return false;
  }

  hasCategorieRole(categorieRole_: string) {
    if (this.currentUser) {
      const categorieRoles: string[] = this.currentUser.categorieRoles;
      if (categorieRoles) {
        const index = categorieRoles.findIndex(element => element === categorieRole_);
        if (index >= 0)
          return true;
      }
    }
    return false;
  }

  hasAnyCategorieRole(categorieRoles: string[]) {
    if (categorieRoles && categorieRoles.length > 0) {
      for (const categorieRole of categorieRoles) {
        if (categorieRole && categorieRole != '' && this.hasCategorieRole(categorieRole)) {
          return true;
        }
      }
    }
    return false;
  }


  hasRolesOrCategorie(item: any) {

    if (item.bypass) {
      return true;
    } else if (item.roles && item.roles.length > 0) {
      return this.hasAnyRoles(item.roles);

    } else if (item.categories && item.categories.length > 0)

      return this.hasAnyCategorieRole(item.categories);

    return false;
  }

  getTableColumns(id): any[] {
    const list: any[] = [];
    const dataTable: any = document.getElementById(id);
    const columns = dataTable.getElementsByClassName('column');
    let label = '';
    let format = '';
    for (let columnIt = 0; columnIt < columns.length; columnIt++) {
      const column = columns[columnIt];
      if (column && column.hasAttribute("columnName"))
        label = columns[columnIt].innerText;
      if (column && column.hasAttribute("format"))
        format = column.getAttribute("format");
      list.push({ 'name': column.getAttribute("columnName"), 'label': label, 'format': format });
    }
    if (!list || list.length <= 0)
      console.error("no (column class or columnName attribute) found in " + id + " !!");
    return list;
  }

  removeToken(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('dateExpiration');
    localStorage.clear();
    sessionStorage.clear();
  }

  clearRegionsToken(): void {
    localStorage.removeItem( 'regionids' );
    localStorage.removeItem( 'regionsIds' );
    localStorage.removeItem( 'decoupageIdsin' );
  }

  logout(): void {
    this.removeToken();
    // let guest = {username: 'guest_'+this.settings.app.region , password:'guest_'+this.settings.app.region }

    this.router.navigate(['/login']);
  }

  pushInList(list: Array<any>, obj: any) {

    if (obj) {
      if (!list)
        list = [];

      const index = list.findIndex(element => element.id === obj.id);
      if (index < 0)
        list.unshift(obj);
    }

  }

  removeExistInList(list: Array<any>, srcList: Array<any>) {

    if (list && list.length > 0 && srcList && srcList.length > 0) {
      for (const obj of srcList) {
        const index = list.findIndex(element => element.id === obj.id);
        if (index > -1)
          list.splice(index, 1);
      }
    }
  }

  populateList(list: Array<any>, srcList: Array<any>) {
    if (!list)
      list = [];

    this.removeExistInList(list, srcList);

    if (srcList)
      list.push.apply(list, srcList);
  }


  public ngOnDestroy() {
    this.toasterconfig = null;
    this.locale = null;
    this.validMessage = null;
    this.options = null;
    this.currentUser = null;

  }

  openFile(response: Blob,Name : string) {
    const fileType = response["Content-Type"];
    const blob = new Blob([this.getResponseBody(response)], { type: fileType });
    if (fileType && fileType.indexOf('pdf') != -1) {
      const bloburl = URL.createObjectURL(blob);
      return bloburl;
    } else {
      //let fileName: any = response.headers.get("etag");
      importedSaveAs(response, Name);
      return null;
    }
  }

  openFilePdfImage(response: Blob) {
    const objc = {
      url: '',
      type: ''
    };
    let obj: any;
    // const fileType = response.type;
    // const blob = new Blob([this.getResponseBody(response)], { type: 'application/pdf' });

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      obj = reader.result;
      // here you can save base64-image to session/localStorage
     // localStorage.setItem('item', this.imageToShow);
    }, false);

    if (response) {
      console.log(response);
      reader.readAsDataURL(response);
      importedSaveAs(response, 'file.'+ response.type.indexOf('pdf') ? "pdf" : "png" );
    }
    return obj;
    // if (fileType && (fileType.indexOf('pdf') != -1 || fileType.indexOf('jpeg') != -1 || fileType.indexOf('jpg') != -1 || fileType.indexOf('png') != -1)) {
    //   console.log("File Type", fileType)
    //   objc.type = fileType.split(';').shift().split('/').pop();
    //   console.log("Url Bob", blob)
    //   const bloburl = window.URL.createObjectURL(blob);
    //   objc.url = bloburl;
    //   console.log("Obejct : ", objc)
    //   return objc;
    // } else {
    //   const fileName: any = response.headers.get("etag");
    //   importedSaveAs(blob, fileName);
    //   return null;
    // }
  }


}
