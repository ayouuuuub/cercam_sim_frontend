import { Injectable } from '@angular/core';

import { AuthHttpService } from './auth-http.service';
import { SettingsService } from './settings.service';
import Observable from 'ol/Observable';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

declare let $: any;
declare let Slider: any;

@Injectable({
  providedIn: 'root'
})
export class MapControlService {

  constructor(private settings: SettingsService,
    private authHttp: AuthHttpService) {
    }

  filterButton(element) {
    var filterButton = document.createElement('button');
    filterButton.setAttribute('id', 'filterButton');
    filterButton.className = "btnMap material-icons"
    filterButton.textContent = "filter_alt";
    filterButton.style.color = "#ae892e";
    $('#filterMenu').hide();
    filterButton.title = "Filtrage";

    var handleLayerControl = function (evt) {
      if ($('#filterMenu').is(":hidden")) {
        filterButton.textContent = "chevron_left"
        $("#filterMenu").css({
          "display": "block"
        });
        $('#filterMenu').show();
        var slider = new Slider("#slider", {tooltip: 'show'});
      } else {
        $('#filterMenu').hide();

        $("#filterMenu").css({
          "display": "none"
        });
        filterButton.textContent = "filter_alt";
      }
    };

    filterButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(filterButton);
  }
  chartButton(element) {
    var chartButton = document.createElement('button');
    chartButton.setAttribute('id', 'chartButton');
    chartButton.className = "btnMap material-icons"
    chartButton.textContent = "insights";
    chartButton.style.color = "#c83649";
    $('#chartMenu').hide();
    chartButton.title = "Charts";

    var handleLayerControl = function (evt) {
      console.log('clicking');
      if ($('#chartMenu').is(":hidden")) {
        chartButton.textContent = "chevron_left"
        $("#chartMenu").css({
          "display": "block"
        });
        $('#chartMenu').show();
      } else {
        $('#chartMenu').hide();

        $("#chartMenu").css({
          "display": "none"
        });
        chartButton.textContent = "show_chart";
      }
    };

    chartButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(chartButton);
  }
  homeButton(element, layer, map) {
    var homeButton = document.createElement('button');
    homeButton.setAttribute('id', 'homeButton');
    homeButton.className = "btnMap material-icons"
    homeButton.textContent = "gps_fixed";
    homeButton.style.color = "#000";
    $('#homeMenu').hide();
    homeButton.title = "Home";
    var handleLayerControl = function (evt) {
      console.log(layer.getSource().changed);
        if (layer.getSource().getState() == 'ready') {
          var extent = layer.getSource().getExtent();
          map.getView().fit(extent, map.getSize());
        }
    };

    homeButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(homeButton);
  }
  layerSwitcherButton(element) {
    var layerSwitcherButton = document.createElement('button');
    layerSwitcherButton.setAttribute('id', 'layerSwitcherButton');
    layerSwitcherButton.className = "btnMap material-icons"
    layerSwitcherButton.textContent = "layers";
    layerSwitcherButton.style.color = "#000";
    $('#layerSwitcherMenu').hide();
    layerSwitcherButton.title = "layerSwitcher";

    var handleLayerControl = function (evt) {
      console.log('clicking');
      if ($('#layerSwitcherMenu').is(":hidden")) {
        layerSwitcherButton.textContent = "chevron_right"
        $("#layerSwitcherMenu").css({
          "display": "block"
        });
        $('#layerSwitcherMenu').show();
      } else {
        $('#layerSwitcherMenu').hide();

        $("#layerSwitcherMenu").css({
          "display": "none"
        });
        layerSwitcherButton.textContent = "layers";
      }
    };

    layerSwitcherButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(layerSwitcherButton);
  }
  coordButton(element) {
    var coordButton = document.createElement('button');
    coordButton.setAttribute('id', 'coordButton');
    coordButton.className = "btnMap material-icons"
    coordButton.textContent = "explore";
    coordButton.style.color = "#000";
    $('#coordMenu').hide();
    coordButton.title = "coord";

    var handleLayerControl = function (evt) {
      console.log('clicking');
      if ($('#coordMenu').is(":hidden")) {
        coordButton.textContent = "chevron_right"
        $("#coordMenu").css({
          "display": "block"
        });
        $('#coordMenu').show();
      } else {
        $('#coordMenu').hide();

        $("#coordMenu").css({
          "display": "none"
        });
        coordButton.textContent = "show_coord";
      }
    };

    coordButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(coordButton);
  }
  measureButton(element) {
    var measureButton = document.createElement('button');
    measureButton.setAttribute('id', 'measureButton');
    measureButton.className = "btnMap"
    measureButton.innerHTML = "<span class='material-icons' style='font-size:inherit;transform:rotate(-45deg)'>straighten</span>";
    measureButton.style.color = "#000";
    $('#measureMenu').hide();
    measureButton.title = "measure";

    var handleLayerControl = function (evt) {
      console.log('clicking');
      if ($('#measureMenu').is(":hidden")) {
        measureButton.textContent = "chevron_right"
        $("#measureMenu").css({
          "display": "block"
        });
        $('#measureMenu').show();
      } else {
        $('#measureMenu').hide();

        $("#measureMenu").css({
          "display": "none"
        });
        measureButton.innerHTML = "<span class='material-icons' style='font-size:inherit;transform:rotate(-45deg)'>straighten</span>";
      }
    };

    measureButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(measureButton);
  }
  legendButton(element) {
    var legendButton = document.createElement('button');
    legendButton.setAttribute('id', 'legendButton');
    legendButton.className = "btnMap material-icons"
    legendButton.textContent = "info";
    legendButton.style.color = "#000";
    $('#legend').hide();
    legendButton.title = "legend";
    var handleLayerControl = function (evt) {
      console.log('clicking');
      if ($('#legend').is(":hidden")) {
        legendButton.textContent = "chevron_right"
        $("#legend").css({
          "display": "block"
        });
        $('#legend').show();
      } else {
        $('#legend').hide();

        $("#legend").css({
          "display": "none"
        });
        legendButton.textContent = "info";
      }
    };

    legendButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(legendButton);
  }
  printButton(element, map) {
    var printButton = document.createElement('button');
    printButton.setAttribute('id', 'printButton');
    printButton.className = "btnMap material-icons"
    printButton.textContent = "print";
    printButton.style.color = "#000";
    $('#printMenu').hide();
    printButton.title = "print";

    var handleLayerControl = function (evt) {
      document.body.style.cursor = 'progress';
      const width = Math.round((297 * 300) / 25.4);
      const height = Math.round((210 * 300) / 25.4);
      var exportOptions = {
        width: width,
        height: height,
        filter: function (element) {
          var className = element.className || '';
          return (
            className.indexOf('ol-control') === -1 ||
            className.indexOf('ol-scale') > -1 ||
            (className.indexOf('ol-attribution') > -1 &&
              className.indexOf('ol-uncollapsible'))
          );
        },
      };
    var viewResolution = map.getView().getResolution();


      map.once('rendercomplete', function () {
        domtoimage.toPng(map.getViewport(), exportOptions)
        .then(function (dataUrl) {
          var pdf = new jsPDF('landscape', undefined, 'A4');
          pdf.addImage(dataUrl, 'JPEG', 0, 0, 297, 210);
          pdf.save('map.pdf');
          map.getTargetElement().style.width = '';
          map.getTargetElement().style.height = '';
          map.updateSize();
          map.getView().setResolution(viewResolution);
          document.body.style.cursor = 'auto';
        });
      });

      map.getTargetElement().style.width = width + 'px';
      map.getTargetElement().style.height = height + 'px';
      map.updateSize();
    };

    printButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(printButton);
  }

}
