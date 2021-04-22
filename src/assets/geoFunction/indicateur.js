'use strict';

var myExtObject = {
    vectorLayerList: [],

    ////////
    maroc: null,
    homePosition: [-12.5, 29],
    ref_Component: null,
    serie: null,
    map: null,
    currentIndecator: null,
    id_region: null,
    tree: null,
    vectorLayer: null,
    vectorSource: null,
    strokeCircle: new ol.style.Stroke({ color: '#000000', width: 1 }), // on peut paramtre les colors des cercles
    init(arg) {

        this.ref_Component = arg;
        //La carte de base
        //pour plusieurs basemap check : https://services.arcgisonline.com/ArcGIS/rest/services
        //var url = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer';
        var url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer';
        //var url = 'https://services.arcgisonline.com/arcgis/rest/services/USA_Topo_Maps/MapServer';
        //var url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer';

        // map street ESRI_Imagery_World_2D  : https://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer
        // Ocean_Basemap : https://services.arcgisonline.com/arcgis/rest/services/Ocean_Basemap/MapServer
        // Ocean_Basemap : https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer
        // Ocean_Basemap : https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer
        // https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer

        url = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer';
        var layer = new ol.layer.Tile({ source: new ol.source.TileArcGISRest({ url: url, crossOrigin: "Anonymous" }) });

        var controls = new ol.control.defaults().extend([
            new ol.control.OverviewMap({
                /* collapsed: false,
                className: 'ol-overviewmap ol-custom-overviewmap', */
                //target: document.querySelector('#overview'),
                className: 'ol-overviewmap ol-custom-overviewmap',

                /*        layers: [
                            new TileLayer({
                              source: new OSM({
                                'url': 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
                                    '?apikey=Your API key from http://www.thunderforest.com/docs/apikeys/ here'
                              })
                            })
                          ],  */
                /* collapseLabel: '\u00BB',
                label: '\u00AB', */
                collapsed: true,
                mapOptions: {
                    maxResolution: 0.0015,
                    numZoomLevels: 5
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

        //-------------declaration et manipulation du button home and fullscreen
        this.maroc = ol.proj.transform(this.homePosition, 'EPSG:4326', 'EPSG:3857');
        // // console.log("m : ", this.maroc)
        let buttonhome = document.createElement('button');
        buttonhome.innerHTML = '<span class="icon-home" aria-hidden="true"></span>';
        buttonhome.className = "btnMap"

        let buttonpdf = document.createElement('button');
        buttonpdf.innerHTML = '<span class="fa fa-file-pdf-o" aria-hidden="true"></span>';
        buttonpdf.style.title = "export pdf";
        buttonpdf.className = "btnMap"

        let buttonprint = document.createElement('button');
        buttonprint.innerHTML = '<span class="fa fa-file-image-o" aria-hidden="true"></span>';
        buttonprint.style.title = "export image";
        buttonprint.className = "btnMap"

        let buttonexcel = document.createElement('button');
        buttonexcel.innerHTML = '<span class="fa fa-file-excel-o" aria-hidden="true"></span>';
        buttonexcel.style.title = "export excel";
        buttonexcel.className = "btnMap"

        let hideFormButton = document.createElement('button');
        hideFormButton.className = 'icon icon-arrow-right-circle';
        hideFormButton.id = "refHideForm";

        var handlehideFormControl = (evt) => {
            if ($('#searchPart').is(":hidden")) {
                hideFormButton.className = "btnMap icon icon-arrow-right-circle";
                $('#mapPart').removeClass("col-sm-12", 1000, "easeOutBounce");
                //$('#mapPart').css('height',"650px");

                $('#mapPart').addClass("col-sm-7", 1000, "easeOutBounce");

                $('#searchPart').show("slide");

                this.map.updateSize();
                $(".btnMap").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-zoom-out").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-zoom-in").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-overviewmap button").animate({ width: "1.375em", height: "1.375em" }, 1000)
                $(".ol-full-screen button").animate({ width: "1.375em", height: "1.375em" }, 1000)

            } else {
                $('#searchPart').hide("fast", () => {
                    // $('#mapPart').css('height',"650px");
                    $('#mapPart').addClass("col-sm-12", 1000, "easeOutBounce");
                    $('#mapPart').removeClass("col-sm-7", 1000, "easeOutBounce");
                    this.map.updateSize();
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
        // define Legend Control
        ///////////////////
        var legendButton = document.createElement('button');
        legendButton.setAttribute('id', 'legendButton');
        legendButton.className = "btnMap fa fa-list-ul"

        $('#legend').hide();
        
        legendButton.style.width = '22px';
        legendButton.style.height = '22px';
        legendButton.style.display = "none";
        legendButton.style.title = "Legend";
        // define Legend de layer Switch
        ///////////////////
        var switcherButton = document.createElement('button');
        switcherButton.setAttribute('id', 'switcherButton');
        switcherButton.className = "btnMap icon icon-layers"

        $('#layerTreeSwitcher').hide();
        // switcherButton.style.width = '22px';
        // switcherButton.style.height = '22px';
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
        //legendButton.classList.add("legend-control");


        //var canvas = $('canvas');
        //// console.log(canvas);
        //$('canvas').css("width", "100%");
        //$('canvas').css("height", "100%");
        // define Legend Control content
        ///////////////////


        let divlegend = document.getElementById('legend');

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



        // var element = document.createElement('div');
        //element.className = 'legend-control ol-unselectable ol-control';

        //-----------fiin du declaration
        //  var c = document.getElementsByName(canvas);
        // c.height = 300;
        this.map = new ol.Map({

            controls: controls,
            layers: [layer],
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat(this.homePosition),
                zoom: 5,
                maxZoom: 10
                    //  projection: 'EPSG:4326'
            }),
        });



        //----------------------definir div pour utiliser les deux buttons et les focntions--------------------


        var element = document.createElement('div');
        var element2 = document.createElement('div');
        var element3Export = document.createElement('div');
        var element4Layer = document.createElement('div');

        //element.className = 'rotate-north ol-unselectable ol-control ';
        element.className = 'ol-unselectable ol-control';
        element.style.cssText = "top: 80px; left: .5em;z-index: 1";
        element.appendChild(buttonhome);
        element.appendChild(switcherButton);

        element3Export.className = 'ol-unselectable ol-control';
        element3Export.style.cssText = "top:155px; left: .5em;z-index: 1";
        element3Export.appendChild(buttonprint);
        element3Export.appendChild(buttonexcel);
        element3Export.appendChild(buttonpdf);

        element2.className = 'ol-unselectable ol-control';
        element2.style.cssText = "bottom: 13px; left: .5em;z-index: 1";
        element2.appendChild(legendButton);
        //element.appendChild(divlegend);

        element4Layer.className = 'ol-unselectable ol-control';
        element4Layer.style.cssText = "right: 0em; bottom: 3em;z-index: 1";
        element4Layer.appendChild(hideFormButton);

        /*  var RotateNorthControl1 = new ol.control.Control({
             element: element
         });
         var RotateNorthControl2 = new ol.control.Control({
             element: element
         }); */
        var RotateNorthControl3 = new ol.control.Control({
            element: element
        });
        var RotateNorthControl4 = new ol.control.Control({
            element: element2
        });
        var RotateNorthControl5 = new ol.control.Control({
            element: element3Export
        });
        var RotateNorthControl6 = new ol.control.Control({
            element: element4Layer
        });
        var RotateNorthDivlegend = new ol.control.Control({
            element: divlegend
        });
        /*  var RotateOverviewMap = new ol.control.Control({
             element: overviewMapControl
         });   */


        /*      this.map.addControl(RotateNorthControl1);
             this.map.addControl(RotateNorthControl2); */
        this.map.addControl(RotateNorthControl3);
        this.map.addControl(RotateNorthControl4);
        if (RotateNorthDivlegend) this.map.addControl(RotateNorthDivlegend);
        this.map.addControl(RotateNorthControl5);
        this.map.addControl(RotateNorthControl6);
        /*         this.map.addControl(RotateOverviewMap);
         */



        var _this = this;
        buttonhome.addEventListener('click', function() {

            // bounce by zooming out one level and back in
            var bounce = ol.animation.bounce({
                resolution: _this.map.getView().getResolution() * 2
            });
            // start the pan at the current center of the map
            var pan = ol.animation.pan({
                source: _this.map.getView().getCenter()
            });
            _this.map.beforeRender(bounce);
            _this.map.beforeRender(pan);
            // when we set the center to the new location, the animated move will
            // trigger the bounce and pan effects
            _this.map.getView().setCenter(_this.maroc);
            _this.map.getView().setZoom(5);

        });
        buttonpdf.addEventListener('click', function() {


        });
        buttonexcel.addEventListener('click', function() {


        });
        buttonprint.addEventListener('click', (event) => {
            console.log('export png');
            this.printCart(event);
        });



        //layer change of base map
        $('input[name="base-layers"]').change(function() {
            var val = $('input[name="base-layers"]:checked').val();
            var url = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer';

            if ($('input[name="base-layers"]').is(':checked') && val) {
                // map street ESRI_Imagery_World_2D  : https://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer
                // Ocean_Basemap : https://services.arcgisonline.com/arcgis/rest/services/Ocean_Basemap/MapServer
                switch (val) {
                    case 'base1':
                        url = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer';
                        break;
                    case 'base2':
                        url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer';
                        break;
                    case 'base3':
                        url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer';
                        break;
                    case 'base4':
                        url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer';
                        break;
                }
                if (url) layer.setSource(new ol.source.TileArcGISRest({ url: url, crossOrigin: "Anonymous" }))
            }
        });

        //--------------------------fin du declaration du div et des fonctions-----------------------
        /*  this.vectorSource = new ol.source.Vector({
             format: new ol.format.GeoJSON(),
             url : () => {
               return this.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0'+
               '&request=GetFeature&typeName='+myExtObject.ref_Component.settings.geo.dataBase+':'+myExtObject.ref_Component.settings.geo.cocheReg+'&outputFormat=application/json';
             },
             strategy: ol.loadingstrategy.bbox
           }); */
        this.vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: () => {
                //function(extent, resolution, projection)
                /*
                var url = this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                    '&request=GetFeature&typeName='+myExtObject.ref_Component.settings.geo.dataBase+':'+myExtObject.ref_Component.settings.geo.cocheReg+'&outputFormat=application/json';*/

                var url = this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                    '&request=GetFeature&typeName=odt:regions&outputFormat=application%2Fjson';


                return url;
            },
            strategy: ol.loadingstrategy.bbox
        });

        this.vectorLayer = new ol.layer.Vector({ 
            title: 'regions',
            source: this.vectorSource });
        this.map.addLayer(this.vectorLayer);

        /* //déclaration de la layertree
         */
        this.layerTree.prototype.createButton = (elemName, elemTitle, elemType) => {
            var buttonElem = document.createElement('button');
            buttonElem.className = elemName + "  mb-sm btn btn-primary";
            buttonElem.title = elemTitle;
            buttonElem.innerText = elemTitle;
            buttonElem.style.marginRight = "10px";
            switch (elemType) {
                case 'addlayer':
                    buttonElem.addEventListener('click', () => {
                        // // console.log("test")
                        document.getElementById(elemName).style.display = 'block';
                        this.ref_Component.ajouterWMS();
                    });
                    return buttonElem;
                case 'deletelayer':
                    var _this = this;
                    buttonElem.addEventListener('click', function() {
                        if (_this.selectedLayer) {
                            //alert("clicked");
                            //  // console.log("_this.selectedLayer.id : " + _this.selectedLayer.id)
                            var layer = _this.getLayerById(_this.selectedLayer.id);
                            _this.map.removeLayer(layer);
                            _this.messages.textContent = 'Layer removed successfully.';
                        } else {
                            _this.messages.textContent = 'No selected layer to remove.';
                        }
                    });
                    return buttonElem;
                default:
                    return false;
            }
        };

        this.layerTree.prototype.addBufferIcon = function(layer) {
            layer.getSource().on('change', function(evt) {
                var layerElem = document.getElementById(layer.get('id'));
                switch (evt.target.getState()) {
                    case 'ready':
                        layerElem.className = layerElem.className.replace(/(?:^|\s)(error|buffering)(?!\S)/g, '');
                        break;
                    case 'error':
                        layerElem.className += ' error'
                        break;
                    default:
                        layerElem.className += ' buffering';
                        break;
                }
            });
        };

        this.layerTree.prototype.removeContent = function(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            return this;
        };

        this.layerTree.prototype.createOption = function(optionValue) {
            var option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            return option;
        };

        this.layerTree.prototype.checkWmsLayer = function(form) {
            //form.check.disabled = true;
            var _this = this;
            this.removeContent($("#layer")).removeContent($("#format"));
            $("#layer").find('option').remove();
            $("#format").find('option').remove();
            var url = form.server;
            url = /^((http)|(https))(:\/\/)/.test(url) ? url : 'http://' + url;
            form.server = url;
            //// console.log(url)
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState === 4 && request.status === 200) {
                    var parser = new ol.format.WMSCapabilities();
                    try {
                        var capabilities = parser.read(request.responseText);
                        var currentProj = _this.map.getView().getProjection().getCode();
                        var crs;
                        var messageText = 'Layers read successfully.';
                        if (capabilities.version === '1.3.0') {
                            crs = capabilities.Capability.Layer.CRS;
                        } else {
                            crs = [currentProj];
                            messageText += ' Warning! Projection compatibility could not be checked due to version mismatch (' + capabilities.version + ').';
                        }

                        var layers = capabilities.Capability.Layer.Layer;
                        if (layers.length > 0 && crs.indexOf(currentProj) > -1) {
                            $(".formwms").css({ "display": "initial" })

                            var option = document.createElement('option');
                            option.value = null;
                            option.textContent = "<< Non défini >>";
                            $("#layer").append(option);
                            for (var i = 0; i < layers.length; i += 1) {
                                $("#layer").append(_this.createOption(layers[i].Name));
                            }
                            $('#layer option:first-child').attr("selected", "selected");

                            var formats = capabilities.Capability.Request.GetMap.Format;
                            var optionFormat = document.createElement('option');
                            optionFormat.value = null;
                            optionFormat.textContent = "<< Non défini >>";
                            $("#format").append(optionFormat);

                            for (i = 0; i < formats.length; i += 1) {
                                $("#format").append(_this.createOption(formats[i]));
                            }
                            $('#format option:first-child').attr("selected", "selected");

                            _this.messages.textContent = messageText;
                            //// console.log(messageText)

                            //form.check.disabled = false;
                        }
                    } catch (error) {
                        //// console.log("catch")
                        _this.messages.textContent = 'Some unexpected error occurred: (' + error.message + ').';
                        //form.check.disabled = false;
                    } finally {
                        //// console.log("finally")
                        // form.check.disabled = false;
                    }
                } else if (request.status > 200) {
                    // // console.log("200")
                    // form.check.disabled = false;
                }
            };
            url = /\?/.test(url) ? url + '&' : url + '?';
            url = url + 'REQUEST=GetCapabilities&SERVICE=WMS';
            //request.open('GET', '../../../cgi-bin/proxy.py?' + encodeURIComponent(url), true);
            request.open('GET', url, true);
            //// console.log("400")
            request.send();
        };

        this.layerTree.prototype.addWmsLayer = function(form) {

            $("#layer").find('option').remove();
            $("#format").find('option').remove();
            $(".formwms").css({ "display": "none" })
            var params = {
                url: form.server,
                params: {
                    layers: form.layer,
                    format: form.format
                }
            };
            var layer;
            if (form.tiled) {
                layer = new ol.layer.Tile({
                    source: new ol.source.TileWMS(params),
                    name: form.displayname
                });
            } else {
                layer = new ol.layer.Image({
                    title: 'WMS',
                    source: new ol.source.ImageWMS(params),
                    name: form.displayname
                });
            }
            this.map.addLayer(layer);
            //this.messages.textContent = 'WMS layer added successfully.';
            return this;
        };

        this.layerTree.prototype.addSelectEvent = function(node, isChild) {
            var _this = this;
            node.addEventListener('click', function(evt) {
                var targetNode = evt.target;
                if (isChild) {
                    evt.stopPropagation();
                    targetNode = targetNode.parentNode;
                }
                if (_this.selectedLayer) {
                    _this.selectedLayer.classList.remove('active');
                }
                _this.selectedLayer = targetNode;
                targetNode.classList.add('active');
            });
            return node;
        };

        this.layerTree.prototype.removeRegistry = function(layer) {
            // // console.log("id : " + layer.get('id'))
            var layerDiv = document.getElementById(layer.get('id'));
            this.layerContainer.removeChild(layerDiv);
            /*this.removeIndector() ;
            this.ref_Component.removeIndectorFromSerie();*/
            return this;
        };

        this.layerTree.prototype.getLayerById = function(id) {
            var layers = this.map.getLayers().getArray();
            for (var i = 0; i < layers.length; i += 1) {
                if (layers[i].get('id') === id) {
                    //// console.log(layers[i])
                    return layers[i];
                }
            }
            return false;
        };

        this.layerTree.prototype.stopPropagationOnEvent = function(node, event) {
            node.addEventListener(event, function(evt) {
                evt.stopPropagation();
            });
            return node;
        };
        this.initLayerTree();
        document.addEventListener('DOMContentLoaded', this.initLayerTree);
    },
    ////////////////////////////////////////////////// LayerTree
    layerTree: function(options) {
        'use strict';
        /*   if (!(this instanceof layerTree)) {
              throw new Error('layerTree must be constructed with the new keyword.');
          }  else*/
        if (typeof options === 'object' && options.map && options.target) {
            if (!(options.map instanceof ol.Map)) {
                throw new Error('Please provide a valid OpenLayers 3 map object.');
            }
            this.map = options.map;
            var containerDiv = document.getElementById(options.target);
            if (containerDiv === null || containerDiv.nodeType !== 1) {
                throw new Error('Please provide a valid element id.');
            }
            this.messages = document.getElementById(options.messages) || document.createElement('span');
            var controlDiv = document.createElement('div');
            controlDiv.className = 'layertree-buttons';
            controlDiv.appendChild(this.createButton('addwms', 'Ajouter visualiseur', 'addlayer'));
            /*  controlDiv.appendChild(this.createButton('deletelayer', 'Remove Layer', 'deletelayer')); */
            containerDiv.appendChild(controlDiv);
            this.layerContainer = document.createElement('div');
            this.layerContainer.className = 'layercontainer';
            containerDiv.appendChild(this.layerContainer);
            var idCounter = 0;
            this.selectedLayer = null;
            this.createRegistry = function(layer, buffer, titre) {
                layer.set('id', 'layer_' + idCounter);
                idCounter += 1;
                var layerDiv = document.createElement('div');
                layerDiv.className = buffer ? 'layer ol-unselectable buffering' : 'layer ol-unselectable';
                layerDiv.title = layer.get('name') || titre || 'couche WMS';
                layerDiv.id = layer.get('id');
                layerDiv.style.border = "1px dashed #9ea3a3";
                layerDiv.style.padding = "8px";
                layerDiv.style.marginBottom = "7px";
                this.addSelectEvent(layerDiv);
                var _this = this;
                layerDiv.draggable = true;


                layerDiv.addEventListener('dragstart', function(evt) {
                    evt.dataTransfer.effectAllowed = 'move';
                    evt.dataTransfer.setData('Text', this.id);
                });
                layerDiv.addEventListener('dragenter', function(evt) {
                    this.classList.add('over');
                });
                layerDiv.addEventListener('dragleave', function(evt) {
                    this.classList.remove('over');
                });
                layerDiv.addEventListener('dragover', function(evt) {
                    evt.preventDefault();
                    evt.dataTransfer.dropEffect = 'move';
                });
                layerDiv.addEventListener('drop', function(evt) {
                    evt.preventDefault();
                    this.classList.remove('over');
                    var sourceLayerDiv = document.getElementById(evt.dataTransfer.getData('Text'));
                    if (sourceLayerDiv !== this) {
                        //// console.log("sourceLayerDiv", sourceLayerDiv)
                        //// console.log("sourceLayerDiv", this)

                        _this.layerContainer.removeChild(sourceLayerDiv);
                        // $(sourceLayerDiv).remove();
                        //// console.log("$(sourceLayerDiv)", $(sourceLayerDiv))
                        //// console.log("remove _this.layerContainer ", _this.layerContainer)
                        _this.layerContainer.insertBefore(sourceLayerDiv, this);
                        // // console.log("_this.layerContainer ", _this.layerContainer)
                        var htmlArray = [].slice.call(_this.layerContainer.children);
                        var index = htmlArray.length - htmlArray.indexOf(sourceLayerDiv) - 1;
                        var sourceLayer = _this.getLayerById(sourceLayerDiv.id);
                        //// console.log("sourceLayer :", sourceLayer)
                        var layers = _this.map.getLayers().getArray();
                        layers.splice(layers.indexOf(sourceLayer), 1);
                        layers.splice(index, 0, sourceLayer);
                        _this.map.render();
                    }
                });
                var layerSpan = document.createElement('label');
                layerSpan.textContent = layerDiv.title;
                layerDiv.appendChild(this.addSelectEvent(layerSpan, true));
                layerSpan.addEventListener('dblclick', function() {
                    this.contentEditable = true;
                    layerDiv.draggable = false;
                    layerDiv.classList.remove('ol-unselectable');
                    this.focus();
                });
                layerSpan.addEventListener('blur', function() {
                    if (this.contentEditable) {
                        this.contentEditable = false;
                        layerDiv.draggable = true;
                        layer.set('name', this.textContent);
                        layerDiv.classList.add('ol-unselectable');
                        layerDiv.title = this.textContent;
                        this.scrollTo(0, 0);
                    }
                });
                var divButton = document.createElement('div');
                divButton.style.display = "inline-block";
                divButton.style.float = "right";

                var buttonRemove = document.createElement('button');
                //buttonRemove.type = 'button';
                buttonRemove.name = 'removeLayer-' + layerDiv.id;
                buttonRemove.className = 'btn btn-xs fa fa-trash-o bg-danger';
                buttonRemove.id = layer.get('id');
                buttonRemove.style.marginRight = "10px";
                buttonRemove.style.height = "20px";
                buttonRemove.style.paddingTop = "0px";
                buttonRemove.style.fontSize = "12px";
                buttonRemove.addEventListener('click', (evt) => {
                    // // console.log(evt)
                    if (event.target.id) {
                        //alert("clicked");
                        /*     // console.log(layer) */
                        var layers = this.map.getLayers().getArray();
                        //// console.log(layers)
                        for (var i = 0; i < layers.length; i += 1) {

                            if (layers[i].get('id') == event.target.id) {
                                this.map.removeLayer(layers[i]);
                                break;

                            }
                        }


                    }
                });
                //// console.log(layer.get('class'))
                if (layer.get('class') != "indecator")
                    divButton.append(buttonRemove);

                var parentVisibleBox = document.createElement('div');
                parentVisibleBox.className = "checkbox c-checkbox";

                parentVisibleBox.style.display = "inline-block";
                parentVisibleBox.style.float = "right";
                parentVisibleBox.style.marginTop = "0px";


                var label = document.createElement('label');
                parentVisibleBox.append(label);

                var span = document.createElement('span');
                span.className = 'fa fa-check';
                span.style.marginTop = "1px";
                var visibleBox = document.createElement('input');
                visibleBox.type = 'checkbox';
                visibleBox.className = 'ng-untouched ng-pristine ng-valid visible';
                label.appendChild(this.stopPropagationOnEvent(visibleBox, 'click'));

                label.append(span);
                visibleBox.checked = layer.getVisible();
                visibleBox.addEventListener('change', function() {
                    if (this.checked) {
                        layer.setVisible(true);
                    } else {
                        layer.setVisible(false);
                    }
                });
                layerDiv.appendChild(divButton);
                layerDiv.appendChild(parentVisibleBox);
                var layerControls = document.createElement('div');
                layerControls.style.width = "27%";
                layerControls.style.display = "inline-block";
                layerControls.style.float = "right";
                layerControls.style.marginTop = "1px";
                layerControls.style.marginRight = "20px";
                this.addSelectEvent(layerControls, true);
                var opacityHandler = document.createElement('input');
                opacityHandler.type = 'range';
                opacityHandler.min = 0;
                opacityHandler.max = 1;
                opacityHandler.step = 0.1;
                opacityHandler.value = layer.getOpacity();
                opacityHandler.addEventListener('input', function() {
                    layer.setOpacity(this.value);
                });
                opacityHandler.addEventListener('change', function() {
                    layer.setOpacity(this.value);
                });
                opacityHandler.addEventListener('mousedown', function() {
                    layerDiv.draggable = false;
                });
                opacityHandler.addEventListener('mouseup', function() {
                    layerDiv.draggable = true;
                });
                layerControls.appendChild(this.stopPropagationOnEvent(opacityHandler, 'click'));
                layerDiv.appendChild(layerControls);
                this.layerContainer.insertBefore(layerDiv, this.layerContainer.firstChild);
                return this;
            };
            this.map.getLayers().on('add', function(evt) {
                if (evt.element instanceof ol.layer.Vector) {
                    this.createRegistry(evt.element, true);
                } else {
                    this.createRegistry(evt.element);
                }
            }, this);
            this.map.getLayers().on('remove', function(evt) {
                this.removeRegistry(evt.element);
            }, this);
        } else {
            throw new Error('Invalid parameter(s) provided.');
        }
    },

    initLayerTree: function() {
        document.removeEventListener('DOMContentLoaded', this.initLayerTree);

        this.tree = new this.layerTree({
                map: this.map,
                target: 'layertree',
                messages: 'messageBar'
            })
            /* .createRegistry(this.map.getLayers().item(0))*/
            .createRegistry(this.map.getLayers().item(1), true, 'la carte de base');

        document.getElementById('checkwmslayer').addEventListener('click', () => {

            // this.tree.checkWmsLayer(this.form);
        });
        document.getElementById('addwms_form').addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.tree.addWmsLayer(this);
            this.parentNode.style.display = 'none';
        });
        document.getElementById('wmsurl').addEventListener('change', () => {
            this.tree.removeContent(this.form.layer)
                .removeContent(this.form.format);
        });

    },
    addWmsLayer: function(form) {
        this.tree.addWmsLayer(form);
    },
    checkWmsLayer: function(form) {
        this.tree.checkWmsLayer(form)
    },
    /////////////////////////////////////////////////////////////////////////

    //Fonction pour la classification des valeurs statistiques
    getVal: function(IdentiteVectorLayer) {
        //// console.log(IdentiteVectorLayer.indecator)
        this.currentIndecator = IdentiteVectorLayer.indecator;
        IdentiteVectorLayer.serie = new geostats(IdentiteVectorLayer.val_tab);
        
        console.log(IdentiteVectorLayer.val_tab);
        // Récupération de la méthode de classification
        var method = this.currentIndecator.methodClassifi;
        //Récupération du nombre de classes
        var nbre_class = parseInt(this.currentIndecator.nombreClass);
        //Récupération de la gamme de couleur
        var couleur = this.currentIndecator.couleur;
        var clr;
        if (couleur === "BLEU") {
            clr = chroma.brewer.Blues;
        } else if (couleur === "ROUGE") {
            clr = chroma.brewer.Reds;
        } else if (couleur === "ORANGE") {
            clr = chroma.brewer.Oranges;
        } else if (couleur === "JAUNE") {
            clr = chroma.brewer.YlOrBr;
        } else if (couleur === "VERT") {
            clr = chroma.brewer.Greens;
        } else if (couleur === "VIOLET") {
            clr = chroma.brewer.Purples;
        } else {
            //return;
        }


        var taille = nbre_class - 1;
        IdentiteVectorLayer.couleurs = chroma.scale([clr[0], clr[taille]]).colors(nbre_class);
        var interval;
        if (method === "INTERVALLES_EGAUX") {
            interval = IdentiteVectorLayer.serie.getClassEqInterval(nbre_class);
        } else if (method === "QUANTILE") {
            interval = IdentiteVectorLayer.serie.getClassQuantile(nbre_class);
        } else if (method === "ECART_TYPE") {
            interval = IdentiteVectorLayer.serie.getClassStdDeviation(nbre_class);
        } else if (method === "method_AP") {
            interval = IdentiteVectorLayer.serie.getClassArithmeticProgression(nbre_class);
        } else if (method === "INTERVALLE_GEOMETRIQUE") {
            interval = IdentiteVectorLayer.serie.getClassGeometricProgression(nbre_class);
        } else if (method === "SEUILS_NATURELS") {
            interval = IdentiteVectorLayer.serie.getClassJenks(nbre_class);
        } else {
            //return;
        }
        // Récupération de l'intervalle des données statistiques classifiées
        IdentiteVectorLayer.interval = interval
        return interval;
    },
    styleFunction: function(feature, IdentiteVectorLayer, resolve) {
        var color;
        var nomReg;
        for (var i = 0; i < IdentiteVectorLayer.val_tab.length; i++) {
            var k = i;
            if (feature.get("id_region") == IdentiteVectorLayer.ids[k]) {
                var j = 0;
                if (feature.get("id_region") == IdentiteVectorLayer.ids[IdentiteVectorLayer.ids.length - 1]) {
                    resolve(IdentiteVectorLayer.id)
                }
                while (j <= IdentiteVectorLayer.indecator.nombreClass) {
                    if (IdentiteVectorLayer.interval[j] <= IdentiteVectorLayer.val_tab[k] && IdentiteVectorLayer.interval[j + 1] >= IdentiteVectorLayer.val_tab[k])
                    //Affectation des couleurs selon les valeurs de l'indicateur
                    {
                        color = IdentiteVectorLayer.couleurs[j];
                        IdentiteVectorLayer.colorGraphList.push({ idReg: IdentiteVectorLayer.ids[k], color: color });
                        nomReg = feature.get("libelle");
                        break;
                    }

                    j = j + 1;
                }
            } else k = k + 1;
        }
        var retStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1

                })
                /* ,
                            text: new ol.style.Text({
                                text: nomReg,
                                font: "12px  sans-serif",
                                textAlign: "center",
                                fill: new ol.style.Fill({
                                    color: "#000"
                                }),
                            }) */
        });


        return retStyle;

    },
    styleFunction_prov: function(feature, IdentiteVectorLayer, resolve) {

        //	 function styleFunction_prov(feature) {
        //// console.log("this.ids2 : ", this.ids2)
        var color;
        var nomprov;
        for (var i = 0; i < IdentiteVectorLayer.val_tab2.length; i++) {
            var k = i;

            if (feature.get("id_province") == IdentiteVectorLayer.ids2[k]) {
                var j = 0;
                if (feature.get("id_province") == IdentiteVectorLayer.ids2[IdentiteVectorLayer.ids2.length - 1]) {
                    resolve(IdentiteVectorLayer.id)
                }
                while (j <= IdentiteVectorLayer.indecator.nombreClass) {
                    //// console.log("in ", IdentiteVectorLayer)
                    if (IdentiteVectorLayer.interval2[j] <= IdentiteVectorLayer.val_tab2[k] && IdentiteVectorLayer.interval2[j + 1] >= IdentiteVectorLayer.val_tab2[k])
                    //Affectation des this.couleurs selon les valeurs de l'indicateur
                    {
                        color = IdentiteVectorLayer.couleurs[j];
                        IdentiteVectorLayer.colorGraphList.push({ idPvn: IdentiteVectorLayer.ids2[k], color: color });

                        nomprov = feature.get("libelle");
                        break;
                    }

                    j = j + 1;
                }
            } else k = k + 1;
        }
        //// console.log("in color style: ", IdentiteVectorLayer.colorGraphList)
        var retStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                })
                /* ,
                            text: new ol.style.Text({
                                text: nomprov,
                                font: "11px  sans-serif",
                                textAlign: "center",
                                fill: new ol.style.Fill({
                                    color: "#000"
                                }),
                            }) */
        });


        return retStyle;
        /*    if (color) {
               var retStyle = new ol.style.Style({
                   fill: new ol.style.Fill({ color: color }),
                   stroke: new ol.style.Stroke({ color: '#000', width: 1 })
               });
               feature.setStyle(retStyle);
           } else {
               return null
           } */

        //return retStyle;

    },
    styleFunction_cmn: function(feature, IdentiteVectorLayer, resolve) {
        var color;
        var nomcmn;
        //// console.log(feature,IdentiteVectorLayer.ids4)
        //// console.log(feature.get("id_commune"), IdentiteVectorLayer.ids4)
        for (var i = 0; i < IdentiteVectorLayer.val_tab4.length; i++) {
            var k = i;
            if (feature.get("id_commune") == IdentiteVectorLayer.ids4[k]) {
                var j = 0;
                if (feature.get("id_commune") == IdentiteVectorLayer.ids4[IdentiteVectorLayer.ids4.length - 1]) {
                    resolve("done")
                }
                while (j <= IdentiteVectorLayer.indecator.nombreClass) {
                    if (IdentiteVectorLayer.interval4[j] <= IdentiteVectorLayer.val_tab4[k] && IdentiteVectorLayer.interval4[j + 1] >= IdentiteVectorLayer.val_tab4[k])
                    //Affectation des this.couleurs selon les valeurs de l'indicateur
                    {
                        color = IdentiteVectorLayer.couleurs[j];
                        IdentiteVectorLayer.colorGraphList.push({ idCmn: IdentiteVectorLayer.ids4[k], color: color });
                        nomcmn = feature.get("libelle");
                        break;
                    }

                    j = j + 1;
                }

            } else k = k + 1;
        }

        if (color) {
            var retStyle = new ol.style.Style({

                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 1
                    })
                    /* ,
                                    text: new ol.style.Text({
                                        text: nomcmn,
                                        font: "10px  sans-serif",
                                        textAlign: "center",
                                        fill: new ol.style.Fill({
                                            color: "#000"
                                        }),
                                    }) */
            });
            feature.setStyle(retStyle);
            return retStyle;
        } else {
            return null
        }
        // return retStyle;
    },
    styleFunction_unt: function(feature, IdentiteVectorLayer, resolve) {

        //	 function styleFunction_prov(feature) {
        //// console.log("this.ids2 : ", this.ids2)
        var color;
        var nomprov;
        for (var i = 0; i < IdentiteVectorLayer.val_tab10.length; i++) {
            var k = i;

            if (feature.get("id_unite_territorial") == IdentiteVectorLayer.ids10[k]) {
                var j = 0;
                if (feature.get("id_unite_territorial") == IdentiteVectorLayer.ids10[IdentiteVectorLayer.ids10.length - 1]) {
                    resolve(IdentiteVectorLayer.id)
                }
                while (j <= IdentiteVectorLayer.indecator.nombreClass) {
                    //// console.log("in ", IdentiteVectorLayer)
                    if (IdentiteVectorLayer.interval10[j] <= IdentiteVectorLayer.val_tab10[k] && IdentiteVectorLayer.interval10[j + 1] >= IdentiteVectorLayer.val_tab10[k])
                    //Affectation des this.couleurs selon les valeurs de l'indicateur
                    {
                        color = IdentiteVectorLayer.couleurs[j];
                        IdentiteVectorLayer.colorGraphList.push({ idUnt: IdentiteVectorLayer.ids10[k], color: color });

                        nomprov = feature.get("libelle");
                        break;
                    }

                    j = j + 1;
                }
            } else k = k + 1;
        }
        //// console.log("in color style: ", IdentiteVectorLayer.colorGraphList)
        var retStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                })
                /* ,
                            text: new ol.style.Text({
                                text: nomprov,
                                font: "11px  sans-serif",
                                textAlign: "center",
                                fill: new ol.style.Fill({
                                    color: "#000"
                                }),
                            }) */
        });


        return retStyle;
        /*    if (color) {
               var retStyle = new ol.style.Style({
                   fill: new ol.style.Fill({ color: color }),
                   stroke: new ol.style.Stroke({ color: '#000', width: 1 })
               });
               feature.setStyle(retStyle);
           } else {
               return null
           } */

        //return retStyle;

    },
    //ajouter les legend dynamic
    addLegend: function(IdentiteVectorLayer, parmSerie) {

        var serie = (parmSerie) ? parmSerie : "serie"
        var legend = $("<div></div>").text("");
        legend.addClass("legendCss");
        legend.attr('id', 'legend-' + IdentiteVectorLayer.id);
        if (!IdentiteVectorLayer.symbolCanva) {
            legend.html(IdentiteVectorLayer[serie].getHtmlLegend(null, IdentiteVectorLayer.indecator.libelle, 1));
        } else {
            var geostat = $('<div class="geostats-legend"></div>')
            geostat.prepend('<div class="geostats-legend-title">' + IdentiteVectorLayer.indecator.libelle + '</div>')
            geostat.append(IdentiteVectorLayer.symbolCanva[0])
            legend.append(geostat)
        }
        this.removeLegend(IdentiteVectorLayer);
        if (this.currentIndecator && IdentiteVectorLayer.id == this.currentIndecator.id) {
            $("#body-legend").prepend(legend);
        } else if (this.currentIndecator && IdentiteVectorLayer.id != this.currentIndecator.id) {
            $("#body-legend").append(legend);
        }

        if ($('#body-legend .legendCss').length == 1) {
            $("#legend h4").css({ "display": "block" });
            $("#legend").css({ "height": "15em", "width": "20em", "padding-left": "14px" });
        }
        $('#legendButton').css({ "display": "block" });
        $("#legend").css({ "display": "block" });
    },
    removeLegend: function(IdentiteVectorLayer) {
        $('#legend-' + IdentiteVectorLayer.id).remove();
        if ($('#body-legend .legendCss').length == 0) {
            $("#legend").css({ "display": "none" });
            //$(".slide-toggle").css({ "display": "none" });
            $('#legendButton').css({ "display": "none" });
            $('#legendButton').removeClass("icon icon-arrow-left")
            $('#legendButton').addClass("fa fa-list-ul")
        } else {
            $("#legend").css({ "display": "block" });
            // $(".slide-toggle").css({ "display": "inline-block" });
        }
    },
    //Fonction pour l'affichage de l'indicateur choisi
    App_style: function(indecator) {
        var val_tab = [];
        var nom = [];
        var ids = [];
        for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {
            val_tab.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
            if (indecator.valeurIndicateurList[i].region) {
                nom.push(indecator.valeurIndicateurList[i].region.libelle);
                ids.push(indecator.valeurIndicateurList[i].region.id);
            }
        }

        var IdentiteVectorLayer = {
            id: indecator.id,
            vectorLayer: null,
            indecator: indecator,
            //attrib de la region selectione
            val_tab: val_tab,
            nom: nom,
            ids: ids,
            interval: null,
            serie: null,
            vectorLayerRegion: null,
            //explore cart
            selectPointerMove1: null,
            selectFeature: null,
            //attrib de la prov selectione
            val_tab2: [],
            nom2: [],
            ids2: [],
            interval2: null,
            serie2: null,
            vectorLayerProvence: null,
            //explore cart
            selectPointerMove2: null,
            selectFeature2: null,
            //attrib de la cmn selectione
            val_tab4: [],
            nom4: [],
            ids4: [],
            interval4: null,
            serie4: null,
            vectorLayerCmn: null,
            level: null,
            //color de la cart
            couleurs: null,
            //color graph
            colorGraphList: []

        }
        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: () => {
                /*
                var url = this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                    '&request=GetFeature&typeName='+myExtObject.ref_Component.settings.geo.dataBase+':'+myExtObject.ref_Component.settings.geo.cocheReg+'&outputFormat=application/json';
                    */
                var url = this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                    '&request=GetFeature&typeName=odt:regions&outputFormat=application/json';
                return url;
            },
            strategy: ol.loadingstrategy.bbox,
            id: indecator.id
        });
        var vectorLayerAdd = new ol.layer.Vector({ 
            source: vectorSource, 
            title: IdentiteVectorLayer.indecator.libelle, 
            name: IdentiteVectorLayer.indecator.libelle, 
            class: "indecator" });
        IdentiteVectorLayer.vectorLayer = vectorLayerAdd;
        IdentiteVectorLayer.vectorLayerRegion = vectorLayerAdd;
        this.getVal(IdentiteVectorLayer);
        if (IdentiteVectorLayer.colorGraphList.length > 0 || IdentiteVectorLayer.colorGraphList) IdentiteVectorLayer.colorGraphList = [];


        var promise = new Promise((resolve, reject) => {
            vectorLayerAdd.setStyle((e) => this.styleFunction(e, IdentiteVectorLayer, resolve));
        });
        promise.then((string) => {
            /* // console.log("current ", string, "id : ", IdentiteVectorLayer.id) */
            this.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, IdentiteVectorLayer.colorGraphList, 'reg');
        })
        this.map.addLayer(vectorLayerAdd);
        IdentiteVectorLayer.serie.setColors(IdentiteVectorLayer.couleurs);
        IdentiteVectorLayer.serie.setPrecision(2);
        this.addLegend(IdentiteVectorLayer);
        this.double_click_reg(IdentiteVectorLayer);
        this.vectorLayerList.push(IdentiteVectorLayer);
    },
    // Fonction de création de la couche des provinces (par double click)
    create_prv: function(id, IdentiteVectorLayer, list) {

        var Src_view_prv = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            /*
            url: this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=region_id:' + id +
            '&typeName='+myExtObject.ref_Component.settings.geo.dataBase+':province_view&maxFeatures=50&outputFormat=application%2Fjson'
            */
            url: this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=region_id:' + id +
                '&typeName=odt:provinces_region&maxFeatures=50&outputFormat=application%2Fjson'
        });

        //  strategy: ol.loadingstrategy.bbox
        // });
        var prv_view = new ol.layer.Vector({
            source: Src_view_prv,
            name: IdentiteVectorLayer.indecator.libelle,
            class: "indecator"
        })
        if (IdentiteVectorLayer.colorGraphList.length > 0 || !IdentiteVectorLayer.colorGraphList) IdentiteVectorLayer.colorGraphList = [];

        var promise1 = new Promise((resolve, reject) => {
            prv_view.setStyle((e) => this.styleFunction_prov(e, IdentiteVectorLayer, resolve))
        });
        promise1.then((string) => {
            /* // console.log("current ", string, "id : ", IdentiteVectorLayer.id) */
            this.ref_Component.changerListValeurIndecator(IdentiteVectorLayer.id, list, IdentiteVectorLayer.colorGraphList, 'pvn');
        })

        IdentiteVectorLayer.serie2 = new geostats(IdentiteVectorLayer.val_tab2);
        IdentiteVectorLayer.interval2 = IdentiteVectorLayer.serie2.getClassQuantile(IdentiteVectorLayer.indecator.nombreClass);
        IdentiteVectorLayer.serie2.setColors(IdentiteVectorLayer.couleurs);
        IdentiteVectorLayer.serie2.setPrecision(2);
        //document.getElementById('legend').innerHTML = IdentiteVectorLayer.serie2.getHtmlLegend(null, IdentiteVectorLayer.indecator.libelle, 1);
        this.addLegend(IdentiteVectorLayer, 'serie2');
        /*  // console.log(IdentiteVectorLayer.colorGraphList); */
        //
        return prv_view;
    },
    // Fonction de création de la couche communes (par double click)
    create_cmn: function(id, IdentiteVectorLayer, list) {

        //// console.log(id)
        var Src_view_cmn = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            /*
            url: this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=province_id:' + id +
            '&typeName='+myExtObject.ref_Component.settings.geo.dataBase+':commune_view&maxFeatures=50&outputFormat=application%2Fjson'
            */
            url: this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=province_id:' + id +
                '&typeName=odt:communes_province&outputFormat=application%2Fjson'

        });

        var cmn_view = new ol.layer.Vector({
                source: Src_view_cmn,
                name: IdentiteVectorLayer.indecator.libelle,
                class: "indecator"
            })
            //// console.log("Src_view_cmn :", Src_view_cmn)
        if (IdentiteVectorLayer.colorGraphList.length > 0 || !IdentiteVectorLayer.colorGraphList) IdentiteVectorLayer.colorGraphList = [];

        var promiseCmn = new Promise((resolve, reject) => {
            cmn_view.setStyle((e) => this.styleFunction_cmn(e, IdentiteVectorLayer, resolve));
        });
        promiseCmn.then((string) => {
            this.ref_Component.changerListValeurIndecator(IdentiteVectorLayer.id, list, IdentiteVectorLayer.colorGraphList, 'cmn');
        })
        IdentiteVectorLayer.serie4 = new geostats(IdentiteVectorLayer.val_tab4);
        IdentiteVectorLayer.interval4 = IdentiteVectorLayer.serie4.getClassQuantile(IdentiteVectorLayer.indecator.nombreClass);
        IdentiteVectorLayer.serie4.setColors(IdentiteVectorLayer.couleurs);
        IdentiteVectorLayer.serie4.setPrecision(2);
        this.addLegend(IdentiteVectorLayer, 'serie4');
        //document.getElementById('legend').innerHTML = this.serie4.getHtmlLegend(null, "Taux de pauvret� 2014", 1);

        return cmn_view;
    },
    create_unt: function(id, IdentiteVectorLayer, list) {

        var Src_view_unt = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            /*
            url: this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=region_id:' + id +
            '&typeName='+myExtObject.ref_Component.settings.geo.dataBase+':province_view&maxFeatures=50&outputFormat=application%2Fjson'
            */
            url: this.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=region_id:' + id +
                '&typeName=odt:unite_territorial_region&outputFormat=application%2Fjson'
        });

        //  strategy: ol.loadingstrategy.bbox
        // });
        var unt_view = new ol.layer.Vector({
            source: Src_view_unt,
            name: IdentiteVectorLayer.indecator.libelle,
            class: "indecator"
        })
        if (IdentiteVectorLayer.colorGraphList.length > 0 || !IdentiteVectorLayer.colorGraphList) IdentiteVectorLayer.colorGraphList = [];

        var promiseUnt = new Promise((resolve, reject) => {
            unt_view.setStyle((e) => this.styleFunction_unt(e, IdentiteVectorLayer, resolve))
        });
        promiseUnt.then((string) => {
            /* // console.log("current ", string, "id : ", IdentiteVectorLayer.id) */
            this.ref_Component.changerListValeurIndecator(IdentiteVectorLayer.id, list, IdentiteVectorLayer.colorGraphList, 'unt');
        })

        IdentiteVectorLayer.serie4 = new geostats(IdentiteVectorLayer.val_tab10);
        IdentiteVectorLayer.interval10 = IdentiteVectorLayer.serie4.getClassQuantile(IdentiteVectorLayer.indecator.nombreClass);
        IdentiteVectorLayer.serie4.setColors(IdentiteVectorLayer.couleurs);
        IdentiteVectorLayer.serie4.setPrecision(2);
        //document.getElementById('legend').innerHTML = IdentiteVectorLayer.serie2.getHtmlLegend(null, IdentiteVectorLayer.indecator.libelle, 1);
        this.addLegend(IdentiteVectorLayer, 'serie4');
        /*  // console.log(IdentiteVectorLayer.colorGraphList); */
        //
        return prv_view;
    },
    findIdentiteVectorLayer: function(id) {
        if (this.vectorLayerList && this.vectorLayerList.length > 0) {
            return this.vectorLayerList.find(item => { return item.id == id });
        } else {
            return null;
        }
    },
    removeAllInteration() {
        if (this.vectorLayerList && this.vectorLayerList.length > 0) {
            for (var i = 0; i <= this.vectorLayerList; i++) {
                if (this.vectorLayerList[i].selectPointerMove1) this.map.removeInteraction(this.vectorLayerList[i].selectPointerMove1);
                if (this.vectorLayerList[i].selectPointerMove2) this.map.removeInteraction(this.vectorLayerList[i].selectPointerMove2);
                if (this.vectorLayerList[i].selectFeature) this.map.removeInteraction(this.vectorLayerList[i].selectFeature);
                if (this.vectorLayerList[i].selectFeature2) this.map.removeInteraction(this.vectorLayerList[i].selectFeature2);
            }
        }
        var interactions = this.map.getInteractions();
        for (var i = 0; i < interactions.getLength(); i++) {
            var interaction = interactions.item(i);
            if (interaction instanceof ol.interaction.Select) {
                this.map.removeInteraction(interaction);
                // // console.log(interaction)
            }
        }
    },
    double_click_reg: function(IdentiteVectorLayer) {

        this.removeAllInteration();
        IdentiteVectorLayer.selectPointerMove1 = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            layers: [IdentiteVectorLayer.vectorLayer]
        });

        this.map.addInteraction(IdentiteVectorLayer.selectPointerMove1);
        IdentiteVectorLayer.selectPointerMove1.on('select', (e) => {
            IdentiteVectorLayer.selectFeature.getFeatures().clear();
        });

        IdentiteVectorLayer.selectFeature = new ol.interaction.Select({
            condition: ol.events.condition.doubleClick,
            layers: [IdentiteVectorLayer.vectorLayer],

        });
        this.map.addInteraction(IdentiteVectorLayer.selectFeature);

        IdentiteVectorLayer.selectFeature.on('select', (e) => {
            if (e.selected && e.selected[0] && e.selected[0].H && this.currentIndecator && this.currentIndecator.id) {
                this.id_region = (e.selected[0].H.id_region) ? e.selected[0].H.id_region : null;
                this.id_province = (e.selected[0].H.id_province) ? e.selected[0].H.id_province : null;

                var IdentiteVectorLayer = this.findIdentiteVectorLayer(this.currentIndecator.id); //get layer from geoserver
                if (typeof(this.id_region) != "undefined" && this.id_region > 0 && IdentiteVectorLayer) {

                    this.ref_Component.loadValeurIndectorOfRegion(IdentiteVectorLayer.id, e.selected[0].H.id_region).subscribe(list => {
                        var data_prv = list;
                        if (list) {
                            IdentiteVectorLayer.val_tab2 = []
                            for (var i = 0; i < data_prv.length; i++) {
                                IdentiteVectorLayer.val_tab2.push(data_prv[i].valeur);
                                IdentiteVectorLayer.nom2.push(data_prv[i].province.libelle);
                                IdentiteVectorLayer.ids2.push(data_prv[i].province.id);
                            }

                            IdentiteVectorLayer.vectorLayerProvence = this.create_prv(this.id_region, IdentiteVectorLayer, list);

                            this.map.removeLayer(IdentiteVectorLayer.vectorLayer);
                            IdentiteVectorLayer.vectorLayer = IdentiteVectorLayer.vectorLayerProvence;
                            this.map.addLayer(IdentiteVectorLayer.vectorLayer);

                            var geom = e.selected[0].getGeometry();
                            var view = this.map.getView();
                            view.fit(geom, this.map.getSize());
                            //this.map.getView().setZoom(this.map.getView().getZoom() + 2);
                            IdentiteVectorLayer.level = 2;

                            // this.map.getView().setCenter(ol.proj.transform([e.mapBrowserEvent.coordinate[1], e.mapBrowserEvent.coordinate[0]], 'EPSG:4326', 'EPSG:3857'));
                            // this.map.getView().setZoom(5);
                            this.removeAllInteration();

                            // this.map.removeInteraction(IdentiteVectorLayer.selectPointerMove1)
                            IdentiteVectorLayer.selectPointerMove2 = new ol.interaction.Select({
                                condition: ol.events.condition.pointerMove,
                                layers: [IdentiteVectorLayer.vectorLayer]
                            });

                            this.map.addInteraction(IdentiteVectorLayer.selectPointerMove2);
                            IdentiteVectorLayer.selectPointerMove2.on('select', (e) => {
                                if (e.selected && e.selected[0] && e.selected[0].H) {
                                    // // console.log(e.selected[0].getStyle())
                                    /*    e.selected[0].getStyle().setStroke(new ol.style.Stroke({
                                               color: [0, 0, 255, 1]
                                           })) */
                                    /*  e.selected[0].setStyle(new ol.style.Style({
                                         stroke: new ol.style.Stroke({
                                             color: [0, 0, 255, 1]
                                         })
                                     })) */
                                    //IdentiteVectorLayer.selectPointerMove2.getFeatures().clear();
                                }

                            })


                            // this.map.removeInteraction(IdentiteVectorLayer.selectFeature)
                            IdentiteVectorLayer.selectFeature2 = new ol.interaction.Select({
                                condition: ol.events.condition.doubleClick,
                                layers: [IdentiteVectorLayer.vectorLayer]
                            });
                            this.map.addInteraction(IdentiteVectorLayer.selectFeature2);
                            IdentiteVectorLayer.selectFeature2.on('select', (e) => {

                                if (e.selected && e.selected[0] && e.selected[0].H && this.currentIndecator && this.currentIndecator.id) {

                                    this.id_region = (e.selected[0].H.id_region) ? e.selected[0].H.id_region : null;
                                    this.id_province = (e.selected[0].H.id_province) ? e.selected[0].H.id_province : null;
                                    var IdentiteVectorLayer = this.findIdentiteVectorLayer(this.currentIndecator.id); //get layer from geoserver
                                    if (typeof(this.id_province) != "undefined" && this.id_province > 0 && IdentiteVectorLayer) {

                                        this.ref_Component.loadValeurIndectorOfPrv(IdentiteVectorLayer.id, e.selected[0].H.id_province).subscribe(list => {
                                            var data_cmn = list;
                                            IdentiteVectorLayer.val_tab4 = [];
                                            if (list) {
                                                for (var i = 0; i < data_cmn.length; i++) {
                                                    IdentiteVectorLayer.val_tab4.push(data_cmn[i].valeur);
                                                    IdentiteVectorLayer.nom4.push(data_cmn[i].commune.libelle);
                                                    IdentiteVectorLayer.ids4.push(data_cmn[i].commune.id);
                                                }

                                                IdentiteVectorLayer.vectorLayerCmn = this.create_cmn(this.id_province, IdentiteVectorLayer, list);


                                                //this.map.getView().fit(extent, this.map.getSize()); //zomme la zone
                                                this.map.removeLayer(IdentiteVectorLayer.vectorLayer);
                                                IdentiteVectorLayer.vectorLayer = IdentiteVectorLayer.vectorLayerCmn;
                                                this.map.addLayer(IdentiteVectorLayer.vectorLayer);
                                                var geom = e.selected[0].getGeometry();
                                                var view = this.map.getView();
                                                view.fit(geom, this.map.getSize());
                                                IdentiteVectorLayer.level = 1;
                                                IdentiteVectorLayer.selectFeature2.getFeatures().clear();
                                            }
                                        })
                                    }
                                }
                            })
                        }

                    })
                }
                this.visibleSurCartIndectorALL(false, IdentiteVectorLayer.id);
                IdentiteVectorLayer.selectFeature.getFeatures().clear();
            }
        });


    },
    //return vres premier cart
    retour: function(id) {

        var index = this.vectorLayerList.findIndex(element => element.id === id);
        if (index > -1 && this.vectorLayerList[index].level == 1) {
            this.removeAllInteration();
            this.map.removeLayer(this.vectorLayerList[index].vectorLayer);
            this.vectorLayerList[index].vectorLayer = this.vectorLayerList[index].vectorLayerProvence
            this.map.addLayer(this.vectorLayerList[index].vectorLayer);
            this.vectorLayerList[index].level = 2;
            this.addLegend(this.vectorLayerList[index], 'serie2');
            this.map.addInteraction(this.vectorLayerList[index].selectPointerMove2);
            this.map.addInteraction(this.vectorLayerList[index].selectFeature2);
            this.map.render();

            var extent = this.vectorLayerList[index].vectorLayer.getSource().getExtent();
            this.map.getView().fit(extent, this.map.getSize());
            this.ref_Component.changerListValeurIndecator(id, null, null, 'zoom_out_pvn');

            // // console.log(geom)
            /* var view = this.map.getView();
            view.fit(geom, this.map.getSize());
            this.map.getView().setZoom(this.map.getView().getZoom() + 2); */
        } else if (index > -1 && this.vectorLayerList[index].level == 2) {
            this.removeAllInteration();
            this.map.removeLayer(this.vectorLayerList[index].vectorLayer);
            this.vectorLayerList[index].vectorLayer = this.vectorLayerList[index].vectorLayerRegion;
            this.map.addLayer(this.vectorLayerList[index].vectorLayer);
            this.vectorLayerList[index].level = 3;
            this.addLegend(this.vectorLayerList[index], 'serie');
            this.map.addInteraction(this.vectorLayerList[index].selectPointerMove1);
            this.map.addInteraction(this.vectorLayerList[index].selectFeature);
            this.map.render()
            this.ref_Component.changerListValeurIndecator(id, null, null, 'zoom_out_reg');
            var extent = this.vectorLayerList[index].vectorLayer.getSource().getExtent();
            this.map.getView().fit(extent, this.map.getSize());
            this.visibleSurCartIndectorALL(true)
        }
    },
    levelOfLayer: function(id) {
        if (this.vectorLayerList.length > 0) {
            var index = this.vectorLayerList.findIndex(element => element.id === id);
            if (index > -1) {
                return this.vectorLayerList[index].level;
            }
        } else {
            return 3;
        }
    },
    //suprimer une indecator
    removeIndector: function(id) {

        var index = this.vectorLayerList.findIndex(element => element.id === id);
        if (index >= 0) {
            this.map.removeLayer(this.vectorLayerList[index].vectorLayer);
            this.removeLegend(this.vectorLayerList[index]);
            this.vectorLayerList.splice(index, 1);


        }
    },
    // show and hide chaque indector
    visibleSurCartIndector: function(id, visible) {
        var index = this.vectorLayerList.findIndex(element => element.id === id);
        if (index >= 0) {
            this.vectorLayerList[index].vectorLayer.setVisible(visible);
            if (visible) {
                this.addLegend(this.vectorLayerList[index]);
            } else {
                this.removeLegend(this.vectorLayerList[index]);
            }
            if (this.currentIndecator && this.currentIndecator.id) {
                /* var index = this.vectorLayerList.findIndex(element => element.id === this.currentIndecator.id);
                if (index >= 0) {
                    this.removeLegend(this.vectorLayerList[index]);
                    this.addLegend(this.vectorLayerList[index]);
                } */

                /* if (this.vectorLayerList[index].selectPointerMove1) this.map.addInteraction(this.vectorLayerList[index].selectPointerMove1);
                if (this.vectorLayerList[index].selectFeature) this.map.addInteraction(this.vectorLayerList[index].selectFeature); */
                if (this.currentIndecator.id == id) {
                    this.removeAllInteration();
                    if (this.vectorLayerList[index].level == 1) {
                        if (this.vectorLayerList[index].selectPointerMove2) this.map.addInteraction(this.vectorLayerList[index].selectPointerMove2);
                        if (this.vectorLayerList[index].selectFeature2) this.map.addInteraction(this.vectorLayerList[index].selectFeature2);
                    } else {
                        if (this.vectorLayerList[index].selectPointerMove1) this.map.addInteraction(this.vectorLayerList[index].selectPointerMove1);
                        if (this.vectorLayerList[index].selectFeature) this.map.addInteraction(this.vectorLayerList[index].selectFeature);
                    }
                }
            }


        }
    },
    // show and hide all indector
    visibleSurCartIndectorALL: function(visible, excludeId) {
        for (var i = 0; i < this.vectorLayerList.length; i++) {
            if (excludeId && excludeId == this.vectorLayerList[i].id) { continue; }
            if ($("#visible-indecator-" + this.vectorLayerList[i].id).hasClass('fa fa-eye bg-green-light') && !visible) {
                myExtObject.visibleSurCartIndector(this.vectorLayerList[i].id, false);
                $("#visible-indecator-" + this.vectorLayerList[i].id).removeClass("fa fa-eye bg-green-light").addClass("fa fa-eye-slash bg-green-dark ");
            } else if ($("#visible-indecator-" + this.vectorLayerList[i].id).hasClass('fa fa-eye-slash bg-green-dark') && visible) {
                myExtObject.visibleSurCartIndector(this.vectorLayerList[i].id, true);
                $("#visible-indecator-" + this.vectorLayerList[i].id).removeClass("fa fa-eye-slash bg-green-dark").addClass("fa fa-eye bg-green-light");
            }
        }
    },
    // edit indecator
    updateIndector: function(item) {
        var index = this.vectorLayerList.findIndex(element => element.id === item.id);
        if (index >= 0) {
            this.vectorLayerList[index].indecator = item;
            let vectorUpdate = this.vectorLayerList[index];

            if (item.modeRepresentation == 'DEGRADE_COULEUR') this.updateToDegradeColor(vectorUpdate);
            else if (item.modeRepresentation == 'CERCLE') console.log("non implemente ")
        }
    },
    changeCurrentIndecator: function(item) {
        this.currentIndecator = item;
        var IdentiteVectorLayer = this.findIdentiteVectorLayer(item.id);
        if (IdentiteVectorLayer.vectorLayer) {
            this.map.removeLayer(IdentiteVectorLayer.vectorLayer);
            this.map.addLayer(IdentiteVectorLayer.vectorLayer);
            var visible = IdentiteVectorLayer.vectorLayer.getVisible();
            if (visible) {
                this.addLegend(IdentiteVectorLayer);
            } else {
                this.removeLegend(IdentiteVectorLayer);
            }
            /* this.removeLegend(IdentiteVectorLayer);
            this.addLegend(IdentiteVectorLayer); */
            this.removeAllInteration();
            if (IdentiteVectorLayer.level == 1 && visible) {
                if (IdentiteVectorLayer.selectPointerMove2) this.map.addInteraction(IdentiteVectorLayer.selectPointerMove2);
                if (IdentiteVectorLayer.selectFeature2) this.map.addInteraction(IdentiteVectorLayer.selectFeature2);
            } else if (visible) {
                if (IdentiteVectorLayer.selectPointerMove1) this.map.addInteraction(IdentiteVectorLayer.selectPointerMove1);
                if (IdentiteVectorLayer.selectFeature) this.map.addInteraction(IdentiteVectorLayer.selectFeature);
            }
        }
    },
    updateToDegradeColor: function(vectorUpdate) {
        var val_tab = [];
        var nom = [];
        var ids = [];
        for (var i = 0; i < vectorUpdate.indecator.valeurIndicateurList.length; i++) {
            val_tab.push(vectorUpdate.indecator.valeurIndicateurList[i].valeur); //push les valeur
            if (vectorUpdate.indecator.valeurIndicateurList[i].region) {
                nom.push(vectorUpdate.indecator.valeurIndicateurList[i].region.libelle);
                ids.push(vectorUpdate.indecator.valeurIndicateurList[i].region.id);
            }
        }

        vectorUpdate.val_tab = val_tab
        vectorUpdate.nom = nom
        vectorUpdate.ids = ids

        this.getVal(vectorUpdate);

        var promise = new Promise((resolve, reject) => {
            vectorUpdate.vectorLayer.setStyle((e) => this.styleFunction(e, vectorUpdate, resolve));
        });
        promise.then((string) => {
            /* // console.log("current ", string, "id : ", IdentiteVectorLayer.id) */
            // console.log(vectorUpdate.valeurIndicateurList)
            this.ref_Component.changerListValeurIndecator(vectorUpdate.id, vectorUpdate.valeurIndicateurList, vectorUpdate.colorGraphList, 'reg');
        })
        vectorUpdate.serie.setColors(vectorUpdate.couleurs);
        vectorUpdate.serie.setPrecision(2);

        //on doit afficher dynamicment
        this.removeLegend(vectorUpdate);
        this.addLegend(vectorUpdate);


    },

    printCart(event, wms) {

        if (!this.currentIndecator && !wms) return;

        //var exportButton = event.target;
        //exportButton.disabled = true;
        // document.body.style.cursor = 'progress';
        //Map
        var canvas = $('#map canvas')[0];
        console.log(canvas);
        let canvas_img = window.document.querySelector('#map canvas');
        canvas_img.setAttribute('crossorigin', 'anonymous')
        var data = canvas.toDataURL('image/jpeg');
        var imgMap = new Image();
        imgMap.src = data;
        imgMap.width = canvas.width;
        imgMap.height = canvas.height;

        //legend
        var canvas2 = document.createElement('canvas');
        canvas2.id = "legend-imge";
        canvas2.width = 1224;
        canvas2.height = 768;
        var ctx = canvas2.getContext("2d");
        var html;
        var dataHtml;
        var imgLegend = new Image();
        if (this.currentIndecator) {

            if ($('#legend-' + this.currentIndecator.id + ' .geostats-legend-title')) {
                $('#legend-' + this.currentIndecator.id + ' .geostats-legend-title').css({ "margin": "3px 10px 5px 10px", "font-weight": "bold" })

                $('#legend-' + this.currentIndecator.id + ' .geostats-legend-block').each(function(index) {
                    var color = $(this).css('backgroundColor');
                    $(this).css({ "background-color": color })
                    $(this).css({
                        "margin": "0px 5px 0px 0px",
                        "border": "1px solid #555555",
                        "display": "inline-block",
                        "float": "left",
                        "height": "10px",
                        "width": " 20px"
                    })
                    $(this).parent().css("font-size", "12px");
                });

                var html = $('#legend-' + this.currentIndecator.id).html();
                //// console.log(html)
                html = html.replace(/"/g, "'");

                var dataHtml = "data:image/svg+xml," +
                    "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
                    "<foreignObject width='100%' height='100%'>" +
                    "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px'>" +
                    html +
                    "</div>" +
                    "</foreignObject>" +
                    "</svg>";

                imgLegend.src = dataHtml;
                imgLegend.onload = function() {
                    ctx.drawImage(imgLegend, 0, 0);
                }
            }
        }

        //echel
        canvas2 = document.createElement('canvas');
        canvas2.id = "legend-imge";
        canvas2.width = 224;
        canvas2.height = 768;
        ctx = canvas2.getContext("2d");

        var imgEchel = new Image();

        if ($('.ol-scale-line') && $('.ol-scale-line').length > 0) {
            $($('.ol-scale-line').get(0)).css({
                "background": $($('.ol-scale-line').get(0)).css('background'),
                "background-color": "#003c884d",
                "border-radius": $($('.ol-scale-line').get(0)).css('borderRadius')
            })
            $($('.ol-scale-line .ol-scale-line-inner').get(0)).css({
                "border-top": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('border-top'),
                "border-bottom": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('border-bottom'),
                "border-left": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('border-left'),
                "border-right": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('border-right'),
                "color": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('color'),
                "font-size": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('font-size'),
                "text-align": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('text-align'),
                "margin": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('margin'),
                "width": $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('width')
            })
            html = $('.ol-scale-line').html();
            html = html.replace(/"/g, "'");
            //// console.log(html)
            dataHtml = "data:image/svg+xml," +
                "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
                "<foreignObject width='100%' height='100%'>" +
                "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px;'>" +
                "<div style=' width:" + $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('width') + ";padding:2px;  border-radius :" + $($('.ol-scale-line').get(0)).css('borderRadius') + "; background: " + $($('.ol-scale-line').get(0)).css('background') + "'>" + html + "</div>" +
                "</div>" +
                "</foreignObject>" +
                "</svg>";

            imgEchel.src = dataHtml;
            imgEchel.onload = function() {
                ctx.drawImage(imgEchel, 0, 0);
            }
        }


        this.convertToOneImg(this.currentIndecator, imgMap, imgLegend, imgEchel, wms);


        // exportButton.disabled = false;
        //document.body.style.cursor = 'auto';


    },
    convertToOneImg(currentIndecator, map, legend, imgEchel, wms) {

        var canvas = document.createElement('canvas');
        canvas.id = "image-print";
        canvas.width = map.width;
        canvas.height = map.height;
        /*   var body = document.getElementsByTagName("body")[0];
          body.appendChild(canvas); */

        var c = canvas;
        var ctx = c.getContext("2d");
        var imageObj1 = map;
        var imageObj2 = legend;
        var imageObj3 = imgEchel;
        imageObj1.onload = function() {
            ctx.drawImage(imageObj1, 0, 0, map.width, map.height);
            if (!wms) {
                imageObj2.onload = function() {
                    
                    ctx.drawImage(imageObj2, 0, 0, 300, 300);
                    // var img = c.toDataURL("image/png");
                    imageObj3.onload = function() {
                        ctx.drawImage(imageObj3, 0, map.height - 20, 200, 200);
                        c.toBlob(function(blob) {
                            saveAs(blob, (currentIndecator) ? currentIndecator.label : "Cart");
                        });
                    }

                    // document.write('<img src="' + img + '" width="328" height="526"/>');
                    // $("#image-print").remove();
                }
            } else {
                c.toBlob(function(blob) {
                    saveAs(blob, (currentIndecator) ? currentIndecator.label : "Cart Visualiseur");
                });
            }
        }
    },
    //representation cercle
    modeCercle: function(indecator, symbolMode) {
        this.currentIndecator = indecator;
        if (this.currentIndecator) {
            //Cercles2();
            var clr = "#000";
            if (indecator.couleur === "BLEU") {
                clr = "#4286f4";
            } else if (indecator.couleur === "ROUGE") {
                clr = "#f21700";
            } else if (indecator.couleur === "ORANGE") {
                clr = "#f4b241";
            } else if (indecator.couleur === "JAUNE") {
                clr = "#f4e541";
            } else if (indecator.couleur === "VERT") {
                clr = "#46f441";
            } else if (indecator.couleur === "VIOLET") {
                clr = "#9a41f4";
            }
            var IdentiteVectorLayer = {
                id: this.currentIndecator.id,
                symbolMode: symbolMode,
                vectorLayer: null,
                indecator: this.currentIndecator,
                //attrib de la region selectione
                val_tab: [],
                val_tab_global: null,
                nom: null,
                ids: null,
                interval: null,
                serie: null,
                vectorLayerRegion: null,
                //explore cart
                selectPointerMove1: null,
                selectFeature: null,
                //attrib de la prov selectione
                val_tab2: [],
                nom2: [],
                ids2: [],
                interval2: null,
                serie2: null,
                vectorLayerProvence: null,
                //explore cart
                selectPointerMove2: null,
                selectFeature2: null,
                //attrib de la cmn selectione
                val_tab4: [],
                nom4: [],
                ids4: [],
                interval4: null,
                serie4: null,
                vectorLayerCmn: null,
                level: null,
                //color de la cart
                couleurs: null,
                colorBase: clr
            }
            this.Circles2(IdentiteVectorLayer);
            for (var i = 0; i < IdentiteVectorLayer.val_tab_global.length; i++) { IdentiteVectorLayer.val_tab.push(IdentiteVectorLayer.val_tab_global[i].valeur); }
            this.getVal(IdentiteVectorLayer);
            IdentiteVectorLayer.vectorLayer.setStyle((e) => this.CirclestyleEmptyFunction(e, IdentiteVectorLayer));
            this.map.addLayer(IdentiteVectorLayer.vectorLayer);

            // console.log(symbolMode)
            IdentiteVectorLayer.symbolCanva = this.generateLegend2(IdentiteVectorLayer);
            this.addLegend(IdentiteVectorLayer);
            this.vectorLayerList.push(IdentiteVectorLayer);
            // this.ref_Component.changerListValeurIndecator(IdentiteVectorLayer.id, IdentiteVectorLayer.indecator.valeurIndicateurList, null, 'symbol');
            /* IdentiteVectorLayer.serie.setColors(IdentiteVectorLayer.couleurs);
            IdentiteVectorLayer.serie.setPrecision(2);
            $("#cnvs").html(IdentiteVectorLayer.serie.getHtmlLegend(null, "Taux de pauvreté 2014", 1));
            if (document.getElementById('cnvx')) document.getElementById('cnvx').innerHTML = IdentiteVectorLayer.serie.getHtmlLegend(null, "Taux de pauvreté 2014", 1); */
            // this.addLegend(IdentiteVectorLayer);

            //Légende de l'indicateur cercle
            //
            //Légende de l'indicateur 1 (commente)
            /* this.serie.setColors(this.couleurs);
            this.serie.setPrecision(2); */

            // document.getElementById('legend').innerHTML = this.serie.getHtmlLegend(null, "Taux de pauvreté 2014", 1);

            //graph2();
            //show info chaque entité(nom_reg, valeurs de  (region - cmn)
            //Interaction_region2();
        }
    },
    Circles2: function(IdentiteVectorLayer) {
        IdentiteVectorLayer.val_tab_global = this.currentIndecator.valeurIndicateurList;
        IdentiteVectorLayer.vectorLayer = new ol.layer.Vector({ source: this.vectorSource });
        var feature = IdentiteVectorLayer.vectorLayer.getSource().getFeatures();

        var vectorSource2 = new ol.source.Vector({});
        for (var i = 0; i < feature.length; i++) {
            var m = 0;
            var code_feat = feature[i].get("id_region");
            //// console.log(feature[i])
            while (m < IdentiteVectorLayer.val_tab_global.length) {
                if (code_feat == IdentiteVectorLayer.val_tab_global[m].region.id) {
                    //// console.log(code_feat)
                    var extent = feature[i].getGeometry().getExtent();
                    var center = ol.extent.getCenter(extent);
                    vectorSource2.addFeature(new ol.Feature({
                        id: feature[i].get("id_region"),
                        val_indic2: IdentiteVectorLayer.val_tab_global[m].valeur,
                        geometry: new ol.geom.Point(center)
                    }));
                    break;
                } else m = m + 1;
            }
        }
        IdentiteVectorLayer.vectorLayer = new ol.layer.Vector({
            source: vectorSource2,
            name: IdentiteVectorLayer.indecator.libelle
        });


    },
    //cercle rempler
    CirclestyleEmptyFunction: function(feature, IdentiteVectorLayer) {
        // var interval = this.getVal(IdentiteVectorLayer);
        var geom, center, valeur;
        for (var i = 0; i < IdentiteVectorLayer.val_tab_global.length; i++) {

            if (feature.getProperties().id == IdentiteVectorLayer.val_tab_global[i].region.id) {

                var extent = feature.getGeometry().getExtent();
                center = ol.extent.getCenter(extent);
                geom = new ol.geom.Point(center);
                valeur = IdentiteVectorLayer.val_tab_global[i].valeur;
                break;
            }
        }

        //        // console.log(this.radiusCalculation(valeur, this.coeffCalculation(this.sumSurface(IdentiteVectorLayer.val_tab_global), IdentiteVectorLayer.val_tab_global)))
        var retStyle = new ol.style.Style({
            geometry: geom,
            // stroke: this.strokeCircle,
            /* image: new ol.style.Circle({
                    stroke: new ol.style.Stroke({
                        color: IdentiteVectorLayer.colorBase,
                        width: 2
                    }),
                    radius: this.radiusCalculation(valeur, this.coeffCalculation(this.sumSurface(IdentiteVectorLayer.val_tab_global), IdentiteVectorLayer.val_tab_global))
                }) */
            image: this.symbolSelect(IdentiteVectorLayer.symbolMode,
                //this.radiusCalculation2(valeur, IdentiteVectorLayer.val_tab_global), IdentiteVectorLayer.colorBase, null),
                this.radiusCalculationPerClass(valeur, IdentiteVectorLayer), IdentiteVectorLayer.colorBase, null),
            /* ,
                        stroke: new ol.style.Stroke({
                            color: IdentiteVectorLayer.colorBase,
                            width: 2
                        }) */
        });
        return retStyle;
    },
    symbolSelect: function(symbol, raduis, strokeColor, fillColor) {
        switch (symbol) {
            case 'SQUARE':
                return new ol.style.RegularShape({
                    fill: (fillColor != "" && fillColor != null) ? new ol.style.Fill({ color: fillColor }) : null,
                    points: 4,
                    angle: Math.PI / 4,
                    stroke: (strokeColor != "" && strokeColor != null) ? new ol.style.Stroke({
                        color: strokeColor,
                        width: 2
                    }) : null,
                    radius: raduis
                })
            case 'TRIANGLE':
                return new ol.style.RegularShape({
                    stroke: (strokeColor != "" && strokeColor != null) ? new ol.style.Stroke({
                        color: strokeColor,
                        width: 2
                    }) : null,
                    radius: raduis,
                    fill: (fillColor != "" && fillColor != null) ? new ol.style.Fill({ color: fillColor }) : null,
                    points: 3,
                    //rotation: Math.PI / 4,
                    angle: 0
                })
            case 'STAR':
                return new ol.style.RegularShape({
                    stroke: (strokeColor != "" && strokeColor != null) ? new ol.style.Stroke({
                        color: strokeColor,
                        width: 2
                    }) : null,
                    radius: raduis,
                    fill: (fillColor != "" && fillColor != null) ? new ol.style.Fill({ color: fillColor }) : null,
                    points: 5,
                    radius2: raduis / 2,
                    angle: 0
                })
            case 'CROSS':
                return new ol.style.RegularShape({
                    stroke: (strokeColor != "" && strokeColor != null) ? new ol.style.Stroke({
                        color: strokeColor,
                        width: 2
                    }) : null,
                    radius: raduis,
                    fill: (fillColor != "" && fillColor != null) ? new ol.style.Fill({ color: fillColor }) : null,
                    points: 4,
                    radius2: 0,
                    angle: 0
                })
            case 'X':
                return new ol.style.RegularShape({
                    stroke: (strokeColor != "" && strokeColor != null) ? new ol.style.Stroke({
                        color: strokeColor,
                        width: 2
                    }) : null,
                    radius: raduis,
                    fill: (fillColor != "" && fillColor != null) ? new ol.style.Fill({ color: fillColor }) : null,
                    points: 4,
                    radius2: 0,
                    angle: Math.PI / 4
                })

            default:
                return new ol.style.Circle({
                    fill: (fillColor != "" && fillColor != null) ? new ol.style.Fill({ color: fillColor }) : null,
                    stroke: (strokeColor != "" && strokeColor != null) ? new ol.style.Stroke({
                        color: strokeColor,
                        width: 2
                    }) : null,
                    radius: raduis
                })
        }
    },
    //cercle rempler
    CirclestyleFunction: function(feature, IdentiteVectorLayer) {
        var mycolor;
        for (var i = 0; i < IdentiteVectorLayer.val_tab_global.length; i++) {
            var k = 0;
            while (k < IdentiteVectorLayer.val_tab_global.length) {
                if (feature.get("id_region") == IdentiteVectorLayer.val_tab_global[k].region.id) {
                    var j = 0;
                    while (j <= IdentiteVectorLayer.indecator.nombreClass) {
                        if (IdentiteVectorLayer.interval[j] <= IdentiteVectorLayer.val_tab_global[k].valeur && IdentiteVectorLayer.interval[j + 1] >= IdentiteVectorLayer.val_tab_global[k].valeur)
                        //Affectation des couleurs selon les valeurs de l'indicateur
                        {
                            mycolor = IdentiteVectorLayer.couleurs[j];
                            break;
                        }
                        j = j + 1;
                    }
                    break;
                } else k = k + 1;
            }
        }

        var retStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: IdentiteVectorLayer.colorBase,
                width: 2
            })
        });
        return retStyle;
    },
    radiusCalculation: function(val, coeff) {
        return Math.pow((val / Math.PI), 0.5) * coeff;
    },
    radiusCalculation2: function(val, listValeurs) {
        var arraySurface = [];
        // // console.log(listValeurs)
        for (var item of listValeurs) {
            arraySurface.push(item.valeur);
        }

        var maxV = Math.max(...arraySurface);
        return (val * 25 / maxV);
    },
    radiusCalculationPerClass: function(val, IdentiteVectorLayer) {
        var interval = this.getVal(IdentiteVectorLayer);
        // console.log("interval:", interval);
        var n = interval.length;

        for (i = 1; i < n; i++) {
            if (val <= interval[i])
                return (i + 1) / n * 25;
        }
    },
    coeffCalculation: function(sumSurface, listValeur) {
        //// console.log("sumSurface : ", (sumSurface), " count :", listValeur.length)
        return (sumSurface / listValeur.length) / Math.sqrt(this.minSurface(listValeur));
    },
    minSurface(listValeur) {
        var arraySurface = [];
        for (var item of listValeur) {
            arraySurface.push(item.valeur);
        }

        return Math.min(...arraySurface);
    },
    sumSurface: function(valeurList) {
        var som = 0;
        for (var item of valeurList) {
            som += item.surface;
        }
        return som;
    },
    fillCircle: new ol.style.Fill({
        color: 'rgba(125, 125, 125, 0.6)'
    }),
    generateLegend2: function(IdentiteVectorLayer) {

        var interval = this.getVal(IdentiteVectorLayer);
        var val_indic2 = [];
        var nbrClasses = interval.length - 1;
        var n = interval.length;

        /// id du 2eme indicateur
        for (var i = 0; i < IdentiteVectorLayer.val_tab_global.length; i++) { val_indic2.push(IdentiteVectorLayer.val_tab_global[i].valeur); }
        const max = Math.max(...val_indic2);
        const min = Math.min(...val_indic2);
        var canvas = $('<canvas/>', { 'class': 'legendSymbol' })
        canvas.attr("id", "legend-imag-" + IdentiteVectorLayer.indecator.id);
        var coeff = this.coeffCalculation(this.sumSurface(IdentiteVectorLayer.val_tab_global), IdentiteVectorLayer.val_tab_global)
            //// console.log("coeff : ", coeff, " sumSurface:", this.sumSurface(IdentiteVectorLayer.val_tab_global), " min:", this.minSurface(IdentiteVectorLayer.val_tab_global))
        var vectorContext = ol.render.toContext(canvas[0].getContext('2d'), {
            size: [this.radiusCalculation2(max, IdentiteVectorLayer.val_tab_global) * 3 + (max + "").length * 14,
                (this.radiusCalculation2(max, IdentiteVectorLayer.val_tab_global) * 2 * nbrClasses / 2) + 10
            ]
        });

        var nbrClasses = interval.length - 1;
        var n = interval.length;

        var minradius = this.radiusCalculation2(min, IdentiteVectorLayer.val_tab_global);
        var maxradius = this.radiusCalculation2(max, IdentiteVectorLayer.val_tab_global);
        /*
        if (minradius < maxradius / 2)
            var tabVal = [min, (min + max) / 3, max];
        else if (minradius < 3 / 4 * maxradius)
            var tabVal = [min, max];
        else
            var tabVal = [max];
        */
        //added by imrane this function for legend cercle
        var i = 0;

        var tabVal = interval.slice(1);
        tabVal.reverse()
            .forEach((val) => {

                //const radius = this.radiusCalculation2(val, IdentiteVectorLayer.val_tab_global);

                const radius = (n - i) / n * maxradius;

                if (nbrClasses <= 3)
                    var decalageY = 0;
                else
                    var decalageY = 12 * (i + 1);

                const text = new ol.style.Text({
                    //offsetX: maxradius + ((max + "").length * 7) / 2,
                    offsetX: 2 * maxradius + maxradius / 4,
                    offsetY: -radius,
                    // overflow: true,
                    text: Math.floor(val),
                    textAlign: 'start',
                    font: 'bold 14px sans-serif',
                    fill: new ol.style.Fill({ color: '#656565' })
                });
                //+ (IdentiteVectorLayer.indecator && IdentiteVectorLayer.indecator.unite && IdentiteVectorLayer.indecator.unite.libelle) ? IdentiteVectorLayer.indecator.unite.libelle : ''


                var symbolLegendStyle = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "#000",
                        width: 0.7
                    }),
                })
                vectorContext.setStyle(symbolLegendStyle);
                vectorContext.drawGeometry(new ol.geom.LineString([
                    [maxradius + (max + "").length, (7 + 2 * maxradius - 2 * radius) + decalageY],
                    [13 * maxradius / 4, (7 + 2 * maxradius - 2 * radius) + decalageY]
                ]));
                symbolLegendStyle = new ol.style.Style({
                        /* image: new ol.style.Circle({
                            stroke: new ol.style.Stroke({
                                color: IdentiteVectorLayer.colorBase,
                                width: 2
                            }),
                            radius: radius
                        }) */
                        image: this.symbolSelect(IdentiteVectorLayer.symbolMode, radius, IdentiteVectorLayer.colorBase, null),
                        text: text
                    })
                    // console.log(maxradius)
                vectorContext.setStyle(symbolLegendStyle);
                vectorContext.drawGeometry(new ol.geom.Point([maxradius + (max + "").length, (7 + 2 * maxradius - radius) + decalageY]));

                i = i + 1;

            });
        return canvas;
    }
}
