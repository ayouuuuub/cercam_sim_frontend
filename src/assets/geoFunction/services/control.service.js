class ControlMapSevice {

    constructor() {
        this.colorClass = ColorClassSingleton.getInstance();
        this.legend = LegendSingleton.getInstance();
        this.symbolModePresentation = SymbolModeSingleton.getInstance();
        this.colorDegrade = ColorDegradeModeSingleton.getInstance();
        this.uniqueIndecatorDegradeSevice = UniqueIndecatorDegradeSeviceSingloton.getInstance();
        this.labelViewMap = LabelViewMapSingloton.getInstance();
        this.printMap = PrintCartSingleton.getInstance();
        this.statutShowLabel = true;
    }

    nativeControl() {
        //fullscreen and over view map and ScaleLine
        var urlvector = myExtObject.ref_Component.settings.geo.url +
            '?service=WFS&version=1.0.0' +
            '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheMaroc + '&outputFormat=application/json';

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: () => {
                return urlvector;
            },
            strategy: ol.loadingstrategy.bbox
        });
        var url = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer';
        var vectorLayer = new ol.layer.Vector({ source: vectorSource });
        var controls = new ol.control.defaults().extend([
            new ol.control.OverviewMap({
                className: 'ol-overviewmap ol-custom-overviewmap',
                layers: [
                    new ol.layer.Tile({ source: new ol.source.TileArcGISRest({ url: url, crossOrigin: "Anonymous" }) }),
                    vectorLayer
                ],
                collapsed: true,
                mapOptions: {
                    maxResolution: 0.015,
                    numZoomLevels: 8
                }
            }),

            new ol.control.FullScreen(),
            new ol.control.ScaleLine()
            /*   new ol.control.ScaleLine({
                  className: 'ol-scale-line',
                  target: document.getElementById('scale-line')
              }) */
        ]);


        //full screen animation with button

        $(function() {
            $($(".ol-full-screen button").get(0)).attr('id', 'fullscreen');
            $("#fullscreen").click(function(event) {

                if ($("#fullscreen").hasClass("ol-full-screen-true")) {
                    $(".btnMap").animate({ width: "1.375em", height: "1.375em" }, 1000)
                    $(".ol-zoom-out").animate({ width: "1.375em", height: "1.375em" }, 1000)
                    $(".ol-zoom-in").animate({ width: "1.375em", height: "1.375em" }, 1000)
                    $(".ol-overviewmap button").animate({ width: "1.375em", height: "1.375em" }, 1000)
                    $(".ol-full-screen button").animate({ width: "1.375em", height: "1.375em" }, 1000)
                    $("#refHideForm").show("fast");
                } else if ($("#fullscreen").hasClass("ol-full-screen-false")) {
                    $(".btnMap").animate({ width: "30px", height: "30px" }, 1000)
                    $(".ol-zoom-out").animate({ width: "30px", height: "30px" }, 1000)
                    $(".ol-zoom-in").animate({ width: "30px", height: "30px" }, 1000)
                    $(".ol-overviewmap button").animate({ width: "30px", height: "30px" }, 1000)
                    $(".ol-full-screen button").animate({ width: "30px", height: "30px" }, 1000)
                    $("#refHideForm").hide("fast");
                }
            })

        })
        $(document).bind('fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange', function(e) {
            var fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement;

            if (!fullscreenElement) {
                $(".btnMap").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-zoom-out").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-zoom-in").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-overviewmap button").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-full-screen button").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $("#refHideForm").css({ display: 'block' });
            } else {
                $("#refHideForm").css({ display: 'none' });
            }
        });
        return controls;
    }

    buttonHome(element) {
        let buttonhome = document.createElement('button');
        buttonhome.innerHTML = '<span class="fa fa-home" aria-hidden="true"></span>';
        buttonhome.className = "btnMap";
        element.className = 'ol-unselectable ol-control';
        element.style.cssText = "top: 15px; left: .5em;z-index: 1; ";
        // buttonhome.style.color  = '#000';
        element.appendChild(buttonhome);
        var _this = myExtObject;
        buttonhome.addEventListener('click', function() {
          function bounce(t) {
            var s = 7.5625;
            var p = 2.75;
            var l;
            if (t < 1 / p) {
              l = s * t * t;
            } else {
              if (t < 2 / p) {
                t -= 1.5 / p;
                l = s * t * t + 0.75;
              } else {
                if (t < 2.5 / p) {
                  t -= 2.25 / p;
                  l = s * t * t + 0.9375;
                } else {
                  t -= 2.625 / p;
                  l = s * t * t + 0.984375;
                }
              }
            }
            return l;
          }
            // bounce by zooming out one level and back in
            // var bounce = ol.animation.bounce({

            // });
            // var bounce = _this.map.getView().animate({
            //   resolution: _this.map.getView().getResolution() * 2,
            //   duration: 2000,
            //   easing: bounce,
            // });
            // start the pan at the current center of the map
            // var pan = _this.map.getView().animate({
            //     center: _this.map.getView().getCenter()
            // });

            var extent = myExtObject.initLayer.getSource().getExtent();
            myExtObject.map.getView().fit(extent, myExtObject.map.getSize());
            var view = myExtObject.map.getView();
            var resolution = view.getResolutionForExtent(extent);
            var zoom = view.getZoomForResolution(resolution);
            var center = ol.extent.getCenter(extent);

            view.animate({
              center: center,
              duration: 2000,
              easing: bounce
            });
            view.animate({
              zoom: zoom - 1,
              duration: 2000 / 2,
              easing: bounce
            }, {
              zoom: zoom,
              duration: 2000 / 2,
              easing: bounce
            });

            // myExtObject.map.getView().fit(extent, myExtObject.map.getSize());
            // _this.map.beforeRender(bounce);
            // _this.map.beforeRender(pan);
            // when we set the center to the new location, the animated move will
            // trigger the bounce and pan effects

            // var maroc = ol.proj.transform(myExtObject.homePosition, 'EPSG:4326', 'EPSG:3857');
            // _this.map.getView().setCenter(maroc);
            // _this.map.getView().setZoom(myExtObject.calculZoomInitial());

        });
    }

    switcherButton(element, layer) {
        var switcherButton = document.createElement('button');
        switcherButton.setAttribute('id', 'switcherButton');
        switcherButton.className = "btnMap icon icon-layers"

        $('#layerTreeSwitcher').hide();
        // switcherButton.style.cssText = 'color: #16c701'
        // switcherButton.style.display = "none";
        switcherButton.style.title = "cart de base";

        var handleLayerControl = function(evt) {
            if ($('#layerTreeSwitcher').is(":hidden")) {
                switcherButton.className = "btnMap icon icon-arrow-left";
                $("#layerTreeSwitcher").css({ "display": "block" });
                $('#layerTreeSwitcher').show();
            } else {
                $('#layerTreeSwitcher').hide();

                $("#layerTreeSwitcher").css({ "display": "none" });
                switcherButton.className = "btnMap icon icon-layers"
            }
        };

        switcherButton.addEventListener('click', handleLayerControl, true);
        element.appendChild(switcherButton);
        this.changeMapBase(layer);
    }

     measuringButton(element) {
        var measuringButton = document.createElement('button');
        measuringButton.setAttribute('id', 'measuringButton');


        measuringButton.className = "btnMap icon icon-pencil";
        // measuringButton.style.color = "#D4AF37";

        $('#measuringDiv').hide();
        // measuringButton.style.width = '22px';
        // measuringButton.style.height = '22px';
/*         measuringButton.style.title = "cart de base";
 */
        var handleLayerControl = function(evt) {
            if ($('#measuringDiv').is(":hidden")) {
                measuringButton.className = "btnMap icon icon-arrow-left";
                $("#measuringDiv").css({ "display": "block"});
                $('#measuringDiv').show();
            } else {
                $('#measuringDiv').hide();
                //---------- Start initialiser la form measuring ---------------------------
                //console.log("......................",$("input[name=measurement][value='none']")[0].checked=true);//rendre l'input value None checked
                myExtObject.enableMeasuringTool(); //reapeller la fonction pour vider le vectorlayers
                var resultElement = $('#js-result');
                resultElement.html('');
                //----------------End initialising la form measuring---------------------
                $("#measuringDiv").css({ "display": "none" });
                measuringButton.className = "btnMap icon icon-pencil" ;

            }
        };

        measuringButton.addEventListener('click', handleLayerControl, true);
        element.appendChild(measuringButton);
    }
    tableurButton(element) {
      var tableurButton = document.createElement('button');
      tableurButton.setAttribute('id', 'tableurButton');
      tableurButton.style.color = "#f05050"
      tableurButton.className = "btnMap fa fa-bars" ;

      var handleLayerControl = function(evt) {


      }


      tableurButton.addEventListener('click', handleLayerControl, true);
      element.appendChild(tableurButton);
  }
  graphButton(element) {
    var graphButton = document.createElement('button');
    graphButton.setAttribute('id', 'graphButton');
    graphButton.className = "btnMap fa fa-bar-chart" ;
    graphButton.style.color = "#2523ca";

    var handleLayerControl = function(evt) {

        }

    graphButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(graphButton);
  }
  addIndicateurButton (element) {
    var addIndicateurButton = document.createElement('button');
    addIndicateurButton.setAttribute('id', 'addIndicateurButton');
    addIndicateurButton.className = "btnMap fa fa-plus" ;
    addIndicateurButton.style.color = "#fff";
    addIndicateurButton.style.backgroundColor = "#27c2a5";
    $('#subIndicateurDiv').append($('.sub-indicateur'));
    $('#subIndicateurDiv').hide();

    var handleLayerControl = function(evt) {
          console.log('clicked');
          // $('#subIndicateurDiv').show();
          // $("#subIndicateurDiv").css({ "display": "block" });
          myExtObject.ref_Component.searchIndicateur(2);
          if ($('#subIndicateurDiv').is(":hidden")) {
            addIndicateurButton.className = "btnMap icon icon-arrow-right";
            $("#subIndicateurDiv").css({ "display": "block" });
            $('#subIndicateurDiv').show();
        } else {
            $('#subIndicateurDiv').hide();
            $("#subIndicateurDiv").css({ "display": "none" });
            addIndicateurButton.className = "btnMap fa fa-plus"
        }
    }

    addIndicateurButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(addIndicateurButton);
    $(addIndicateurButton).hide();
  }
    legendButton(element) {
        var legendButton = document.createElement('button');
        legendButton.setAttribute('id', 'legendButton');
        legendButton.className = "btnMap fa fa-list-ul"

        $('#legend').hide();
        legendButton.style.width = '22px';
        legendButton.style.height = '22px';
        legendButton.style.display = "none";
        legendButton.style.title = "Legend";
        var handleLegendControl = function(evt) {
            if ($('#body-legend .legendCss').length > 0) {
                if ($('#legend').is(":hidden")) {
                    legendButton.className = "icon icon-arrow-left";
                    $("#legend").css({ "display": "block" });
                    $('#legend').show();
                } else {
                    $('#legend').hide();
                    $("#legend").css({ "display": "none" });
                    legendButton.className = "fa fa-list-ul"
                }
            }
        };

        legendButton.addEventListener('click', handleLegendControl, true);
        legendButton.addEventListener('touchstart', handleLegendControl, true);

        let divlegend = document.getElementById('legend');
        console.log(divlegend);
        if (divlegend)
            divlegend.cloneNode(true);
        element.appendChild(divlegend);
        element.appendChild(legendButton);

    }
    closeButton(element) {
        var closeButton = document.createElement('button');
        closeButton.setAttribute('id', 'tempcloseButton');
        closeButton.className = "btnMap fa fa-times";
        closeButton.style.width = '22px';
        closeButton.style.height = '22px';
        closeButton.style.display = "block";
        closeButton.style.title = "Fermer";
        var handlecloseControl = function(evt) {
            myExtObject.removeTempMap();
            myExtObject.ref_Component.tempLayer = false;
        };

        closeButton.addEventListener('click', handlecloseControl, true);
        closeButton.addEventListener('touchstart', handlecloseControl, true);

        element.appendChild(closeButton);

    }
    tempLegendButton(element) {
        var legendButton = document.createElement('button');
        legendButton.setAttribute('id', 'tempLegendButton');
        legendButton.className = "btnMap fa fa-list-ul"

        $('#temp-legend').hide();
        legendButton.style.width = '22px';
        legendButton.style.height = '22px';
        legendButton.style.display = "none";
        legendButton.style.title = "Legend";
        var handleLegendControl = function(evt) {
            if ($('#body-temp-legend .legendCss').length > 0) {
                if ($('#temp-legend').is(":hidden")) {
                    legendButton.className = "icon icon-arrow-left";
                    $("#temp-legend").css({ "display": "block" });
                    $('#temp-legend').show();
                } else {
                    $('#temp-legend').hide();
                    $("#temp-legend").css({ "display": "none" });
                    legendButton.className = "fa fa-list-ul"
                }
            }
        };

        legendButton.addEventListener('click', handleLegendControl, true);
        legendButton.addEventListener('touchstart', handleLegendControl, true);

        let divlegend = document.getElementById('temp-legend');
        console.log(divlegend);
        if (divlegend)
            divlegend.cloneNode(true);
        element.appendChild(divlegend);
        element.appendChild(legendButton);

    }
  exportButton(element) {
    var exportButton = document.createElement('button');
    exportButton.setAttribute('id', 'exportButton');


    exportButton.className = "fa fa-floppy-o" ;

    $('#exportDiv').hide();
    // exportButton.style.width = '22px';
    // exportButton.style.height = '22px';
    /*         measuringButton.style.title = "cart de base";
     */
    var reader = new FileReader();
    var handleLayerControl = function(evt) {
      document.getElementById("file-input").addEventListener('change', (event) => {
        var el = event.target;
        // //console.log(event.target.files);
        if(el.files && el.files[0]) {


          // reader.readAsDataURL(el.files[0]);

          reader.readAsText(el.files[0], 'UTF-8');
          reader.onloadend = function(e) {
            var data = JSON.parse(e.target.result);

            // var data = window.atob(e.target.result.replace('data:;base64,', ''));
            // myExtObject.ref.exportMap(data);
            // if(myExtObject.ref_Component.avantchoisirLeMode === 'app-searchindicateur') {
            //   myExtObject.ref_Component.importWMC(data);
            // } else {
            myExtObject.ref_Component.importWMC(data);
            // To hide WMC on the map
            // $('#uploadFileJSON').hide();
            // }
            // myExtObject.ref_Component.avantchoisirLeMode = 'app-searchindicateur';
            // myExtObject.ref_Component.importWMC(data);
            // //console.log(myExtObject.ref_Component.avantchoisirLeMode);

          }

          // reader.readAsDataURL(el.files[0]);

        }
      });
      // $('#uploadFileJSON').on('click', function() {
      //   // document.getElementById("file-input").removeEventListener('change', //console.log("Remove event Listener"));
      //   $('#file-input').trigger('click');
      // });
      if ($('#exportDiv').is(":hidden")) {
        exportButton.className = "fa fa-floppy-o";
        $("#exportDiv").css({ "display": "block" });
        $('#exportDiv').show();
      } else {
        $('#exportDiv').hide();
        //---------- Start initialiser la form measuring ---------------------------
         //reapeller la fonction pour vider le vectorlayers
        var resultElement = $('#js-result');
        resultElement.html('');
        //----------------End initialising la form measuring---------------------
        $("#exportDiv").css({ "display": "none" });
        exportButton.className = "fa fa-floppy-o" ;

      }
    };

    exportButton.addEventListener('click', handleLayerControl, true);
    element.appendChild(exportButton);
  }

  buttonprint(element) {
        let buttonprint = document.createElement('button');
        buttonprint.innerHTML = '<span class="fa fa-file-image-o" aria-hidden="true"></span>';
        buttonprint.style.title = "export image";
        buttonprint.className = "btnMap"
        buttonprint.style.color = '#2150a9';
        buttonprint.addEventListener('click', () => {
            this.printMap.printCart();
        });
        element.appendChild(buttonprint);
  }
    addButtonBack(item) {
      var element = document.createElement('div');
      element.className = 'ol-unselectable ol-control';
      element.style.cssText = "top:285px; left: .5em;z-index: 1";
      let buttonprint = document.createElement('button');
      buttonprint.innerHTML = '<span class="btn btn-xs icon icon-magnifier-remove bg-warning" aria-hidden="true"></span>';
      buttonprint.style.title = "Retour";
      buttonprint.className = "btnMap"
      buttonprint.addEventListener('click', () => {
          myExtObject.ref_Component.zommeOut(item);
          $(buttonprint).hide();
      });
      element.appendChild(buttonprint);
      var addControl = new ol.control.Control({
        element: element
      });
      myExtObject.map.addControl(addControl);
    }
    imgLoad(images) {
        var inc = 0;
        for (var item of images) {
            if (item.img) {
                inc++;
            }
        }
        return inc;
    }

    buttonpdf(element) {
        let buttonpdf = document.createElement('button');
        buttonpdf.innerHTML = '<span class="fa fa-file-pdf-o" aria-hidden="true"></span>';
        buttonpdf.style.title = "export pdf";
        buttonpdf.className = "btnMap"
        buttonpdf.style.color = "#dc3545"
        buttonpdf.addEventListener('click', () => {
            // Author: Ghost, Description: Old Code
            // var images = this.printMap.printCart(null, true);
            // var _this = this;
            // if (!images) return null;
            // var endTotal = this.imgLoad(images);
            // var startTotal = 0;
            // for (var item of images) {
            //     var codeImg = (item.code != "INDECATORIDS") ? item.code : "END"
            //     if (item.img) {
            //         this.printMap.convertImgToBase64(item.img, codeImg, function(code, base64) {
            //             if (code != "END") {
            //                 var index = images.findIndex(element => element.code === code);
            //                 if (index > -1) {
            //                     images[index].base64 = base64;
            //                     images[index].img = "";
            //                     startTotal++;
            //                     if (startTotal == endTotal) myExtObject.ref_Component.exportIndicateurPdf(images);
            //                 }
            //             }
            //         })
            //     }
            // }

            this.printMap.printCart(null, true);
        });
        element.appendChild(buttonpdf);
    }
    buttonexcel(element) {

        let buttonexcel = document.createElement('button');
        buttonexcel.innerHTML = '<span class="fa fa-file-excel-o" aria-hidden="true"></span>';
        buttonexcel.style.title = "export excel";
        buttonexcel.className = "btnMap"
        buttonexcel.style.color = "#4caf50"
        buttonexcel.addEventListener('click', function() {
            var idIn = [];
            var echelle;
            if (myExtObject.vectorLayerList.length == 0 )
              myExtObject.ref_Component.showCustomWarning("Veuillez d'abord visualiser un indicateur");
            for (var item of myExtObject.vectorLayerList) {
                console.log("item.composentIdentiteLayerList  :", item);

                if (item.composentIdentiteLayerList) { //tester si composentIdentiteLayerList exist alors je suis dans le mode croisement sinon je suis dans simple ou histogramme
                    //  //console.log("composentIdentiteLayerList existe  :",item.composentIdentiteLayerList);
                    for (let i = 0; i <= item.composentIdentiteLayerList.length - 1; i++) {
                        idIn.push(item.composentIdentiteLayerList[i].id);
                    }
                }
                if (item.indecator && item.indecator.echelle && item.indecator.echelle.name)
                    echelle = item.indecator.echelle.name;
                else if(item.indecator && item.indecator.echelle)
                    echelle = item.indecator.echelle;
                else
                    echelle = "region";

                idIn.push(item.id);
            }

            if (idIn.length > 0)
                    myExtObject.ref_Component.exportIndicateurXls(idIn, echelle);
            ////console.log("id envoyé par fonction :",idIn);

        });
        element.appendChild(buttonexcel);
    }

    hideFormButton(element) {
        let hideFormButton = document.createElement('button');
        hideFormButton.className = 'icon icon-arrow-right-circle';
        hideFormButton.id = "refHideForm";
        var handlehideFormControl = (evt) => {
            if ($('#searchPart').is(":hidden")) {
                ////console.log("afficher la partie search......");
                hideFormButton.className = "btnMap icon icon-arrow-right-circle";
                $('#mapPart').removeClass("col-sm-12", 1000, "easeOutBounce");
                $('#mapPart').addClass("col-sm-7", 1000, "easeOutBounce");
                $('#searchPart').show("fast");
                myExtObject.map.updateSize();
                $(".btnMap").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-zoom-out").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-zoom-in").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-overviewmap button").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-full-screen button").animate({ width: "1.375em", height: "1.375em" }, 1000)

            } else {
                //console.log("cacher la partie searche......");

                $('#searchPart').hide("fast", () => {

                    $('#mapPart').addClass("col-sm-12", 1000, "easeOutBounce");
                    $('#mapPart').removeClass("col-sm-7", 1000, "easeOutBounce");
                    myExtObject.map.updateSize();
                });
                hideFormButton.className = "btnMap icon icon-arrow-left-circle";
                $(".btnMap").animate({ width: "30px", height: "30px" }, 1000)
                $(".ol-zoom-out").animate({ width: "30px", height: "30px" }, 1000)
                $(".ol-zoom-in").animate({ width: "30px", height: "30px" }, 1000)
                $(".ol-overviewmap button").animate({ width: "30px", height: "30px" }, 1000)
                $(".ol-full-screen button").animate({ width: "30px", height: "30px" }, 1000)
            }

            //  .ol-zoom-in .ol-zoom-out     .btnMap     .ol-overviewmap button .ol-full-screen button
            //    height: 35px; width: 35px;
        };

        hideFormButton.addEventListener('click', handlehideFormControl, true);
        hideFormButton.addEventListener('touchstart', handlehideFormControl, true);
        element.appendChild(hideFormButton);
    }
    hideFormButtonOut() {
        let hideFormButton = document.getElementById('slideMapBtn');
        // hideFormButton.className = 'icon icon-arrow-right-circle';
        // hideFormButton.id = "refHideForm";
        /* var handlehideFormControl = (evt) => { */
        if ($('#searchPart').is(":hidden")) {
            //console.log("afficher la partie search......");
            // hideFormButton.className = "btnMap icon icon-arrow-right-circle";
            $('#mapPart').removeClass("col-sm-12", 1000, "easeOutBounce");
            $('#mapPart').addClass("col-sm-7", 1000, "easeOutBounce");
            $('#searchPart').show("fast");
            myExtObject.map.updateSize();
            $(".btnMap").animate({ width: "1.375em", height: "1.375em" }, 1000)
            $(".ol-zoom-out").animate({ width: "1.375em", height: "1.375em" }, 1000)
            $(".ol-zoom-in").animate({ width: "1.375em", height: "1.375em" }, 1000)
            $(".ol-overviewmap button").animate({ width: "1.375em", height: "1.375em" }, 1000)
            $(".ol-full-screen button").animate({ width: "1.375em", height: "1.375em" }, 1000)

        } else {
            //console.log("cacher la partie search......");
            //console.log("...........................................................");
            $('#searchPart').hide("fast", () => {
                $('#mapPart').addClass("col-sm-12", 1000, "easeOutBounce");
                $('#mapPart').removeClass("col-sm-7", 1000, "easeOutBounce");
                myExtObject.map.updateSize();
            });
            // hideFormButton.className = "btnMap icon icon-arrow-left-circle";
            $(".btnMap").animate({ width: "30px", height: "30px" }, 1000)
            $(".ol-zoom-out").animate({ width: "30px", height: "30px" }, 1000)
            $(".ol-zoom-in").animate({ width: "30px", height: "30px" }, 1000)
            $(".ol-overviewmap button").animate({ width: "30px", height: "30px" }, 1000)
            $(".ol-full-screen button").animate({ width: "30px", height: "30px" }, 1000)
        }

        //  .ol-zoom-in .ol-zoom-out     .btnMap     .ol-overviewmap button .ol-full-screen button
        //    height: 35px; width: 35px;
        /*  }; */

        /*  hideFormButton.addEventListener('click', handlehideFormControl, true);
         hideFormButton.addEventListener('touchstart', handlehideFormControl, true); */
    }
    changeMapBase(layer) {
        $('input[name="base-layers"]').change(function() {
            var val = $('input[name="base-layers"]:checked').val();
            var url = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer';

            if ($('input[name="base-layers"]').is(':checked') && val) {
                // map street ESRI_Imagery_World_2D  : https://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer
                // Ocean_Basemap : https://services.arcgisonline.com/arcgis/rest/services/Ocean_Basemap/MapServer
                // //console.log(val);
                switch (val) {
                    case 'base1':
                        url = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer';
                        /***
                         * @anasloufissi
                         */
                        PrintCartSingleton.getInstance().printValueOfTheMap('Fonds        : Maroc');
                        /***
                         * End Call
                         */
                        break;
                    case 'base2':
                        url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer';
                         /***
                         * @anasloufissi
                         */
                        PrintCartSingleton.getInstance().printValueOfTheMap('Fonds        : OpenStreet Maroc');
                        /***
                         * End Call
                         */
                        break;
                    case 'base3':
                        url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer';
                        /***
                         * @anasloufissi
                         */
                        PrintCartSingleton.getInstance().printValueOfTheMap('Fonds        : Carte satellite');
                        /***
                         * End Call
                         */
                        break;
                    case 'base4':
                        url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer';
                         /***
                         * @anasloufissi
                         */
                        PrintCartSingleton.getInstance().printValueOfTheMap('Fonds        : Carte topographique');
                        /***
                         * End Call
                         */
                        break;
                }
                if (url) layer.setSource(new ol.source.TileArcGISRest({ url: url, crossOrigin: "Anonymous" }))
            }
        });


    }
    insertLabelMaroc(vectorLayer) {
        this.labelViewMap.labelInMapMaroc(vectorLayer);
    }


    showLabel(url, statut, nextidIndector) {
      //console.log("appel show label");
      //console.log("statut :",statut);
        if (statut === 'underCircle') {
          if (myExtObject.labelVectorLayer) myExtObject.map.removeLayer(myExtObject.labelVectorLayer);
          myExtObject.labelVectorLayer = this.labelViewMap.labelInMap(url, true);
          myExtObject.map.addLayer(myExtObject.labelVectorLayer);
          if (myExtObject.labelVectorLayer && !this.statutShowLabel) myExtObject.map.removeLayer(myExtObject.labelVectorLayer);
        }
        if (!statut) {
            //console.log("label in map :",url);
            if (myExtObject.labelVectorLayer) myExtObject.map.removeLayer(myExtObject.labelVectorLayer);

            myExtObject.labelVectorLayer = this.labelViewMap.labelInMap(url);

            /*  if (myExtObject.currentIndecator && myExtObject.currentIndecator.decoupage && myExtObject.currentIndecator.decoupage.id == 1) {
                 myExtObject.labelVector_2009_Layer = myExtObject.labelVectorLayer
             } else {
                 myExtObject.labelVector_2015_Layer = myExtObject.labelVectorLayer
             } */


            myExtObject.map.addLayer(myExtObject.labelVectorLayer);
            if (myExtObject.labelVectorLayer && !this.statutShowLabel) myExtObject.map.removeLayer(myExtObject.labelVectorLayer);
        }


        if (statut == "show") {
            /*  if (myExtObject.labelVectorLayer) myExtObject.map.removeLayer(myExtObject.labelVectorLayer);
             if (myExtObject.currentIndecator && myExtObject.currentIndecator.decoupage && myExtObject.currentIndecator.decoupage.id == 1) {
                 myExtObject.labelVectorLayer = myExtObject.labelVector_2009_Layer;
             } else {
                 myExtObject.labelVectorLayer = myExtObject.labelVector_2015_Layer;
             } */
            if (myExtObject.labelVectorLayer){
                myExtObject.map.removeLayer(myExtObject.labelVectorLayer);
                myExtObject.map.addLayer(myExtObject.labelVectorLayer);
                this.statutShowLabel = true;
            }

        } else if (statut == "hide") {
            if (myExtObject.labelVectorLayer) myExtObject.map.removeLayer(myExtObject.labelVectorLayer);
            this.statutShowLabel = false;
        }
        if (statut == "zoom") {
            if (myExtObject.labelVectorLayer){
                //console.log("i m in zoom case");
                if (myExtObject.labelVectorLayer) myExtObject.map.removeLayer(myExtObject.labelVectorLayer);
                //if(myExtObject.map.getView().getZoom()<=4){
                    myExtObject.labelVectorLayer.setStyle((feature) => {
                        var retStyle = new ol.style.Style({
                            fill: new ol.style.Stroke({
                                color: 'transparent'
                            }),
                            text: new ol.style.Text({
                                text: (myExtObject.map.getView().getZoom()>4) ? feature.get("libelle") : "",
                                font: myExtObject.map.getView().getZoom()*1.6+"px  sans-serif",
                                textAlign: myExtObject.isModeCircle ? "end" : "center",
                                fill: new ol.style.Fill({
                                    color: "#000"
                                })
                            })
                        });
                        //feature.setStyle(e);
                        return retStyle;

                    });
                    // myExtObject.map.getView().setZoom($(window).width() < 1537 ? 5.4 : myExtObject.zoomValeur);
                //}
                    myExtObject.map.addLayer(myExtObject.labelVectorLayer);
            }
        }

        if (statut == "remove") {
            if (myExtObject.labelVectorLayer) {
                myExtObject.map.removeLayer(myExtObject.labelVectorLayer);
                myExtObject.labelVectorLayer = null;
            }
        }
    }

    showNomControl() {
        $('#afficherNom').change(() => {

            var checkbox = document.getElementById('afficherNom');
            if (checkbox.checked) {
                this.showLabel(null, "show");
            } else {
                this.showLabel(null, "hide");
            }
        });
    }

}

var ControlMapSeviceSingloton = (function() {

    var instance;

    function createInstance() {
        var object = new ControlMapSevice();
        return object;
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
