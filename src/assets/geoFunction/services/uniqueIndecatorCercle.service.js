class UniqueIndecatorCercleSevice {

    constructor() {
        this.colorClass = ColorClassSingleton.getInstance();
        this.legend = LegendSingleton.getInstance();
        this.symbolModePresentation = SymbolModeSingleton.getInstance();
        this.croisement = false;
    }

    symbolWithColorBorder(indecator, typeSymbol, ranges) {
        myExtObject.currentIndecator = indecator;
        var currentIndecator = indecator;
        var url, echelle, entite;

        if (currentIndecator) {
            var identiteVectorLayer = IdentiteLayer.getInstance();
            identiteVectorLayer.id = currentIndecator.id;
            identiteVectorLayer.symbolMode = typeSymbol;
            identiteVectorLayer.indecator = currentIndecator;
            identiteVectorLayer.colorBase = this.colorClass.getColorByHexa(indecator.couleur);
            this.symbolModePresentation.doSymbolVector(identiteVectorLayer, myExtObject.vectorSource);

            myExtObject.currentIndecator = identiteVectorLayer.indecator
            let position;
            console.log(indecator.echelle);
              // if (indecator.echelle == 'Provinciale') {
              //   position = '2';
              // }
              // else if (indecator.echelle == 'Communale') {
              //   position = '4';
              // }
              // else if (indecator.echelle == 'Unitale') {
              //   position = '10';
              // }
              // else if(indecator.echelle == "Cercle" || indecator.echelle == "Préfécture d'arrondissement") {
              //   position = '3';
              // }
              // else if(indecator.echelle == "Arrondissement" || indecator.echelle == "Douar" || indecator.echelle == "Centre Urbain") {
              //   position = '5';
              // }
              // else {
              //   position = '';
              // }
          myExtObject.positionPrv  = position;
          if ( indecator.echelle == "Provinciale") {
              position = '2';
              echelle = "province";
              entite = echelle;
          }
          else if ( indecator.echelle == "Communale") {
              position = '4';
              echelle = "commune";
              entite = echelle;
          }
          else if ( indecator.echelle == "Cercle" || indecator.echelle == "Préfécture d'arrondissement") {
              position = '3';
              echelle = "cerclePrefArr";
              entite = 'cercle_pref_arr';
          }
          else if ( indecator.echelle == "Unitale") {
              position = '10';
              echelle = "uniteTerritorial";
              entite = 'unite_territorial';
          }
          else if ( indecator.echelle == "Arrondissement" || indecator.echelle == "Douar" || indecator.echelle == "Centre Urbain") {
              position = '5';
              echelle = "douarCentreUrb";
              entite = 'douar_centreurbain';
          }
          else {
              position = '';
              echelle = "region";
              entite = echelle;
          }
            // if ( indecator.echelle == "Provinciale"){
            //     position = '2';
            //     echelle = "province";
            // }

            // else if ( indecator.echelle == "Communale") {
            //     position = '4';
            //     echelle = "commune";
            // }

            // else if ( indecator.echelle == "Cercle" || indecator.echelle == "Préfécture d'arrondissement") {
            //     position = '3';
            //     echelle = "cerclePrefArr";
            // }
            // else if ( indecator.echelle == "Unitale") {
            //     position = '10';
            //     echelle = "uniteTerritorial";
            // }
            // else if ( indecator.echelle == "Arrondissement" || indecator.echelle == "Douar" || indecator.echelle == "Centre Urbain") {
            //     position = '5';
            //     echelle = "douarCentreUrb";
            // }
            // else {
            //     position = '';
            //     echelle = "region";
            // }
            myExtObject.positionPrv = position;
            identiteVectorLayer["val_tab"+ position] = [];
            for (var i = 0; i < identiteVectorLayer.val_tab_global.length; i++) {
                identiteVectorLayer["val_tab"+ position].push(identiteVectorLayer.val_tab_global[i].valeur);
            }
            console.log(identiteVectorLayer);
            this.legend.getClassificationByValue(identiteVectorLayer, position);

            if (currentIndecator.figurecolor) {
                this.symbolModePresentation.generateStyleSymbolSrokOneColor(identiteVectorLayer)
            } else {
                this.symbolModePresentation.generateStyleSymbol(identiteVectorLayer)
            }


        //     if (indecator && indecator.decoupage && indecator.decoupage.id == 1) {
        //       url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
        //           '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg_2009 + '&outputFormat=application/json';
        //   } else {
        //       url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
        //           '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg + '&outputFormat=application/json';
        //   }
        //   var vectorSource = new ol.source.Vector({
        //       format: new ol.format.GeoJSON(),
        //       url: () => {
        //           return url;
        //       },
        //       strategy: ol.loadingstrategy.bbox,
        //       id: indecator.id
        //   });
        //   var vectorLayerAdd = new ol.layer.Vector({
        //     source: vectorSource,
        //     name: identiteVectorLayer.indecator.libelle,
        //     class: "indecator"
        // });

            //  identiteVectorLayer.vectorLayer = vectorLayerAdd;
             /***
              * End The code .
              */
            // identiteVectorLayer.vectorLayer.refresh({ force: false });
            myExtObject.map.addLayer(identiteVectorLayer.vectorLayer);
            myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
            // console.log("identiteVectorLayer :", identiteVectorLayer)
            identiteVectorLayer.symbolCanva = this.legend.generateCanvasOfSymobol(identiteVectorLayer);
            this.legend.addLegend(identiteVectorLayer , null , '');
            myExtObject.controlMapSevice.showLabel(url);
            myExtObject.vectorLayerList.push(identiteVectorLayer);

            // for(var i=1,j=0; i < $('.geostats-legend').children().length*2 - 1; i+=2,j++) {
            //   if( ranges[j]  != '' && ranges[j] != null)
            //       $('.geostats-legend').find('div').eq(i).contents()[1].data = ranges[j];
            // }
            myExtObject.vectorSource.on('change', function(evt){
              var source=evt.target;
              if(source.getState() === 'ready'){
                myExtObject.vectorSource.getFeatures().forEach(feature => {
                      //console.log(feature);
                      var valeur = indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
                          return valeurIndicateur[echelle].id == feature.values_['id_'+entite];
                      })
                      .map (valeurIndicateur => valeurIndicateur.valeur);
                      // var values = { ['id_'+echelle] : feature.values_['id_'+echelle],
                      //                 libelle : feature.values_.libelle,
                      //                 surface : feature.values_.surface,
                      //                 geometry: feature.values_.geometry,
                      //                 valeur : valeur};
                      var values = new Object();
                      values['id_'+entite]  = feature.values_['id_'+entite];
                      values['libelle'] = feature.values_.libelle
                      values['surface'] = feature.values_.surface
                      values['geometry'] = feature.values_.geometry
                      values['valeur'] = valeur
                      feature.values_ = values;
                  })
              }
          })

          // filter  interaction
          var selecti = new ol.interaction.Select({
              key: 'selecti',
              hitTolerance: 5,
              condition: ol.events.condition.singleClick
          });
          myExtObject.map.addInteraction(selecti);
          // Select feature when click on the reference index
          selecti.on('select', function(e) {
              console.log('clicked')
              var f = e.selected[0];
              if (f) {
              var prop = f.getProperties();
              var ul = $('.options ul').html('');
              for (var p in prop) if (p!=='geometry') {
                  $('<li>').text(p+': '+prop[p]).appendTo(ul);
              }
              }
          });

          // Select control
          myExtObject.selectCtrl = new ol.control.Select({
              key: 'selectCtrl',
              source: myExtObject.vectorSource,
              property: $(".options select").val()
          });
          myExtObject.map.addControl(myExtObject.selectCtrl);
          //hide
          myExtObject.selectCtrl.on('select', function(e) {
            myExtObject.vectorSource.getFeatures().forEach(function(f) {
                  f.setStyle([]);
                });
                // Show current
                e.features.forEach(function(f) {
                  f.setStyle(null);
                });
              // identiteVectorLayer.selectPointerSelectFeature.getFeatures().clear();
              // for (var i=0, f; f=e.features[i]; i++) {
              //     identiteVectorLayer.selectPointerSelectFeature.getFeatures().push(f);
              // }
          });
        }
    }
    removeDuplicates(data){
        return data.filter((value, index) => data.indexOf(value) === index);
    }
    symbolSelect(symbol, radius,color) {
        switch (symbol) {
            case 'SQUARE':
                return new ol.style.RegularShape({
                    fill: new ol.style.Fill({color: color}),
                    points: 4,
                    angle: Math.PI / 4,
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    }),
                    radius: radius
                })
            case 'TRIANGLE':
                return new ol.style.RegularShape({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    }),
                    radius: radius,
                    fill: new ol.style.Fill({color: color}),
                    points: 3,
                    //rotation: Math.PI / 4,
                    angle: 0
                })
            case 'STAR':
                return new ol.style.RegularShape({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    }),
                    radius: radius,
                    fill: new ol.style.Fill({color: color}),
                    points: 5,
                    radius2: radius / 2,
                    angle: 0
                })
            case 'CROSS':
                return new ol.style.RegularShape({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    }),
                    radius: radius,
                    fill: new ol.style.Fill({color: color}),
                    points: 4,
                    radius2: 0,
                    angle: 0
                })
            case 'X':
                return new ol.style.RegularShape({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    }),
                    radius: radius,
                    fill: new ol.style.Fill({color: color}),
                    points: 4,
                    radius2: 0,
                    angle: Math.PI / 4
                })

            default:
                return new ol.style.Circle({
                    fill: new ol.style.Fill({color: color}),
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    }),
                    radius: radius
                })
        }
    }
    stylish(geomFeatures,valFeatures,valFeatures2,interval,interval2,color,symbol, echelle){
        var features = [];
        var polygon;
        var center;
        var valeur;
        var SymColor = color;
        for(var i=0, k=0;i<valFeatures.length;i++,k++)
            for(var j=0; j< geomFeatures.features.length;j++)
                if(valFeatures[i][echelle].libelle == geomFeatures.features[j].properties.libelle){
                    console.log(geomFeatures);
                    polygon = turf.polygon(geomFeatures.features[j].geometry.coordinates);
                    center = turf.centroid(polygon);
                    if(this.croisement){
                        SymColor = this.Degradation(valFeatures2[i].valeur,interval2,color);
                    }
                    valeur = valFeatures[i].valeur ? valFeatures[i].valeur : null ;
                    features[k] = new ol.Feature(new ol.geom.Point(center.geometry.coordinates));
                    features[k].setStyle(new ol.style.Style({
                        image : this.symbolSelect(symbol,this.classify(valeur,interval),SymColor)
                    }));
                }
            this.croisement = false;
        return features;
    }

    classify(valeur,interv){
      console.log(interv)
      if(valeur)
        for (var i=0;i<interv.length-1; i++){
            if(( valeur >= interv[i] && valeur < interv[i+1] )  || valeur == interv[i+1] ) {
                return (30*(i+1)/(interv.length-1));
            }
        }
    }

    Degradation(valeur, interv, color) {
        var ordre;
        for (var i=0;i<interv.length-1; i++){
            if(( valeur >= interv[i] && valeur < interv[i+1] )  || ( valeur == interv[i] && valeur == interv[i+1] ) ) {
                ordre = i;
            }
            else
               if( i == interv.length-2 && valeur == interv[i+1]){
                ordre = i+1;
            }
        }
        return (pSBC ((interv.length-1-ordre-1)/(interv.length-1), color, false, true )).toString();
    }

    symbolPrvWithColorBorder(indecator, typeSymbol) {
        myExtObject.currentIndecator = indecator;
        var currentIndecator = indecator;
        myExtObject.positionPrv = '';
        let position,
            url,
            echelle;

        if ( indecator.echelle == "Provinciale"){
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + indecator.decoupage.id;
            position = '2';
            echelle = "province";
        }

        else if ( indecator.echelle == "Communale") {
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheCmnToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + indecator.decoupage.id;
            position = '4';
            echelle = "commune";
        }

        else if ( indecator.echelle == "Cercle" || indecator.echelle == "Préfécture d'arrondissement") {
            type = indecator.valeurIndicateurList[0].cerclePrefArr.type
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCerPrefArr + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";type:" + type;
            position = '3';
            echelle = "cerclePrefArr";
        }
        else if ( indecator.echelle == "Unitale") {

            let categorie = indecator.valeurIndicateurList[0].uniteTerritorial.categorie.id.toString();
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheUntToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";categorie_id:"+ categorie;
            position = '10';
            echelle = "uniteTerritorial";
        }
        else if ( indecator.echelle == "Arrondissement" || indecator.echelle == "Douar" || indecator.echelle == "Centre Urbain") {
            type = indecator.valeurIndicateurList[0].douarCentreUrb.type
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheDouarCentreUrb + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";type:" + type;
            position = '5';
            echelle = "douarCentreUrb";
        }
        else {
            url =  myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg +"&viewparams=decoupage_id:" +indecator.decoupage.id+'&outputFormat=application/json';
            position = '';
            echelle = "region";
        }
        if (currentIndecator) {

            var identiteVectorLayer = IdentiteLayer.getInstance();
            identiteVectorLayer.id = currentIndecator.id;
            identiteVectorLayer.symbolMode = typeSymbol;
            identiteVectorLayer.indecator = currentIndecator;
            identiteVectorLayer.colorBase = this.colorClass.getColorByHexa(indecator.couleur);

            this.symbolModePresentation.doSymbolVector(identiteVectorLayer, myExtObject.vectorSourcePrv);
            identiteVectorLayer['val_tab' + position] = [];
            console.log(identiteVectorLayer.val_tab_global)

            for (var i = 0; i < identiteVectorLayer.val_tab_global.length; i++) {
                identiteVectorLayer['val_tab' + position].push(identiteVectorLayer.val_tab_global[i].valeur);
            }
            myExtObject.currentIndecator = identiteVectorLayer.indecator
            this.legend.getClassificationByValue(identiteVectorLayer, position);
            myExtObject.positionPrv = position;
            // this.symbolModePresentation.generateStyleSymbol(identiteVectorLayer, "province")
            // if (currentIndecator.figurecolor) {
            //     this.symbolModePresentation.generateStyleSymbolSrokOneColor(identiteVectorLayer)
            // } else {
            //     this.symbolModePresentation.generateStyleSymbol(identiteVectorLayer)
            // }
            // var url;
            // if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id) {
            //     /*  url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
            //         '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrv + "&viewparams=decoupage_id:" + identiteVectorLayer.indecator.decoupage.id + "&outputFormat=application/json';
            // } else { */
            //     let type = ""

            // } else {
            //     return;
            // }
            // url = 'http://localhost:8484/geoserver/odt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=odt:provinces_region&maxFeatures=50&outputFormat=application%2Fjson&viewparams=region_id:'+myExtObject.inRegion;
            var vectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: () => {
                    return url;
                },
                strategy: ol.loadingstrategy.bbox,
                id: indecator.id
            });
            var vectorLayerAdd = new ol.layer.Vector({
                source: vectorSource,
                name: identiteVectorLayer.indecator.libelle,
                class: "indecator"
            });

          var provinces;
          $.ajax({
              type : 'get',
              url : url,
              async : false,
              success : function(response){
                provinces = response;

              }
          })
          var interv = this.legend.getInterval_2(identiteVectorLayer.indecator.nombreClass, identiteVectorLayer['serie'+ position], identiteVectorLayer.indecator.methodClassifi, identiteVectorLayer.val_tab_global);
          console.log(identiteVectorLayer.symbolMode);
  //        var stroke = new ol.style.Stroke({color: 'black', width: 2});
//          var fill = new ol.style.Fill({color: (identiteVectorLayer.colorBase).toString()});
          var features = this.stylish(provinces,identiteVectorLayer.val_tab_global,null,interv,null,(identiteVectorLayer.colorBase).toString(),identiteVectorLayer.symbolMode, echelle);


          var vectorSource = new ol.source.Vector({
                features: features
          });
          var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
             name: identiteVectorLayer.indecator.libelle,
                class: "indecator"
        });
            //  identiteVectorLayer.vectorLayer = vectorLayerAdd;
             /***
              * End The code .
              */
            // identiteVectorLayer.vectorLayer.refresh({ force: false });

            identiteVectorLayer.vectorLayer = vectorLayer;
            identiteVectorLayer.vectorLayerProvence = vectorLayer;
            /***
             * End Code .
             */
            console.log(identiteVectorLayer);
            //console.log(identiteVectorLayer.vectorLayer)
            // myExtObject.map.addLayer(identiteVectorLayer.vectorLayer);
            myExtObject.map.addLayer(vectorLayer);

            myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
            identiteVectorLayer.symbolCanva = this.legend.generateCanvasOfSymobol(identiteVectorLayer);
            this.legend.addLegend(identiteVectorLayer , null , '');
            myExtObject.controlMapSevice.showLabel(url);
            myExtObject.vectorLayerList.push(identiteVectorLayer.vectorLayer);
            myExtObject.vectorLayerList.push(vectorLayerAdd);
            myExtObject.vectorLayerList.push(vectorLayer);
            vectorSource.on('change', function(evt){
                var source=evt.target;
                if(source.getState() === 'ready'){

                    vectorSource.getFeatures().forEach(feature => {
                        //console.log(feature);
                        var valeur = indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
                            return valeurIndicateur[echelle].id == feature.values_['id_'+echelle];
                        })
                        .map (valeurIndicateur => valeurIndicateur.valeur);
                        // var values = { ['id_'+echelle] : feature.values_['id_'+echelle],
                        //                 libelle : feature.values_.libelle,
                        //                 surface : feature.values_.surface,
                        //                 geometry: feature.values_.geometry,
                        //                 valeur : valeur};
                        var values = new Object();
                        values['id_'+echelle]  = feature.values_['id_'+echelle];
                        values['libelle'] = feature.values_.libelle
                        values['surface'] = feature.values_.surface
                        values['geometry'] = feature.values_.geometry
                        values['valeur'] = valeur
                        feature.values_ = values;
                    })
                }
            })

            // filter  interaction
            var selecti = new ol.interaction.Select({
              key: 'selecti',
                hitTolerance: 5,
                condition: ol.events.condition.singleClick
            });
            myExtObject.map.addInteraction(selecti);
            // Select feature when click on the reference index
            selecti.on('select', function(e) {
                console.log('clicked')
                var f = e.selected[0];
                if (f) {
                var prop = f.getProperties();
                var ul = $('.options ul').html('');
                for (var p in prop) if (p!=='geometry') {
                    $('<li>').text(p+': '+prop[p]).appendTo(ul);
                }
                }
            });

            // Select control
            myExtObject.selectCtrl = new ol.control.Select({
              key: 'selectCtrl',
                // target: $(".options").get(0),
                source: vectorSource,
                property: $(".options select").val()
            });
            myExtObject.map.addControl (myExtObject.selectCtrl);
            //hide
            myExtObject.selectCtrl.on('select', function(e) {
                vectorSource.getFeatures().forEach(function(f) {
                    f.setStyle([]);
                  });
                  // Show current
                  e.features.forEach(function(f) {
                    f.setStyle(null);
                  });
                // identiteVectorLayer.selectPointerSelectFeature.getFeatures().clear();
                // for (var i=0, f; f=e.features[i]; i++) {
                //     identiteVectorLayer.selectPointerSelectFeature.getFeatures().push(f);
                // }
            });
        }
    }

    //deux indecator one is symbol and second is color
    symbolTranspose(groupIndecatorSlected, noInteractionMeta) {
        myExtObject.positionPrv = "";
        if (myExtObject.vectorLayerList && myExtObject.vectorLayerList.length > 0) {
            myExtObject.map.removeLayer(myExtObject.vectorLayerList[0].vectorLayer);
            this.legend.removeLegend(myExtObject.vectorLayerList[0]);
            if( myExtObject.vectorLayerList[0].composentIdentiteLayerList.length > 0)
              this.legend.removeLegend(myExtObject.vectorLayerList[0].composentIdentiteLayerList[0]);
        }
        // console.log("groupIndecatorSlected : ", groupIndecatorSlected)
        myExtObject.vectorLayerList = []
        var identiteVectorLayerSymbol = IdentiteLayer.getInstance();
        var itemSymbol = groupIndecatorSlected.find(a => { return a.modeRepresentation != "DEGRADE_COULEUR" })
        var tmpColorDegrade = IdentiteLayer.getInstance();
        var itemColor = groupIndecatorSlected.find(a => { return a.modeRepresentation == "DEGRADE_COULEUR" })
        if (itemSymbol && itemColor) {
            //myExtObject.currentIndecator = identiteVectorLayerSymbol.indecator;
            //console.log("itemSymbol", itemSymbol)
            identiteVectorLayerSymbol.id = itemSymbol.id;
            identiteVectorLayerSymbol.symbolMode = itemSymbol.modeRepresentation;
            identiteVectorLayerSymbol.indecator = itemSymbol;
            // console.log("conso : ", itemSymbol.couleur)
            identiteVectorLayerSymbol.colorBase = this.colorClass.getColorByHexa("");
            var echellGraph = "";
            console.log(identiteVectorLayerSymbol.indecator.echelle);
            var niv = function(echelle) {
                var echellFromSetting = "";
                switch (echelle) {
                    case 'Régionale':
                        echellFromSetting = 'region';
                        echellGraph = 'reg';
                        break;
                    case 'Provinciale':
                        echellFromSetting = 'province';
                        echellGraph = 'pvn';
                        break;
                    case 'Communale':
                        echellFromSetting = 'commune'
                        echellGraph = 'cmn';
                        break;
                    case 'Unitale' :
                        echellFromSetting = 'uniteTerritorial';
                        break;
                    case 'Cercle':
                        echellFromSetting = 'cercle';
                        break;
                    case "Préfécture d'arrondissement":
                        echellFromSetting = "Préfécture d'arrondissement";
                        break;
                    case 'Arrondissement':
                        echellFromSetting = 'Arrondissement';
                        break;
                    case 'Douar':
                        echellFromSetting = 'Douar';
                        break;
                    case 'Centre Urbain':
                        echellFromSetting = 'Centre Urbain';
                        break;
                    default:
                        echellFromSetting = 'region';
                        echellGraph = 'reg';
                        break;
                }
                return echellFromSetting;
            }
            var promiseVS = new Promise((resolve, reject) => {
                //myExtObject.ref_Component.addBusy();
                this.symbolModePresentation.doSymbolVector(identiteVectorLayerSymbol, myExtObject.vectorSource, true, niv(identiteVectorLayerSymbol.indecator.echelle), resolve);
            });

            identiteVectorLayerSymbol.val_tab = [];
            for (var i = 0; i < identiteVectorLayerSymbol.val_tab_global.length; i++) {
                identiteVectorLayerSymbol.val_tab.push(identiteVectorLayerSymbol.val_tab_global[i].valeur);
            }
            myExtObject.currentIndecator = identiteVectorLayerSymbol.indecator
            console.log(identiteVectorLayerSymbol)
            this.legend.getClassificationByValue(identiteVectorLayerSymbol, "");

            tmpColorDegrade.id = itemColor.id;
            tmpColorDegrade.symbolMode = itemColor.modeRepresentation;
            tmpColorDegrade.indecator = itemColor;
            tmpColorDegrade.colorBase = this.colorClass.getColorByHexa(itemColor.couleur);
            tmpColorDegrade.val_tab = [];
            tmpColorDegrade.val_tab_global = itemColor.valeurIndicateurList;
            if (!tmpColorDegrade.val_tab_global || (tmpColorDegrade.val_tab_global && tmpColorDegrade.val_tab_global.length == 0))
                return;
            for (var i = 0; i < tmpColorDegrade.val_tab_global.length; i++) {
                tmpColorDegrade.val_tab.push(tmpColorDegrade.val_tab_global[i].valeur);
            }
            myExtObject.currentIndecator = tmpColorDegrade.indecator;
            this.legend.getClassificationByValue(tmpColorDegrade, "");
            identiteVectorLayerSymbol.composentIdentiteLayerList = [];
            identiteVectorLayerSymbol.composentIdentiteLayerList.push(tmpColorDegrade)
            myExtObject.map.addLayer(identiteVectorLayerSymbol.vectorLayer);


            var promise;
            promiseVS.then((string) => {
                // console.log('adding.....');
                myExtObject.ref_Component.removeBusy();
                promise = new Promise((resolve, reject) => {
                    //myExtObject.ref_Component.addBusy();
                    identiteVectorLayerSymbol.composentIdentiteLayerList[0].colorGraphList = [];
                    this.symbolModePresentation.generateStyleSymbolSrok(identiteVectorLayerSymbol, true, resolve, niv(identiteVectorLayerSymbol.indecator.echelle));
                });

                    myExtObject.ref_Component.removeBusy();
                    if (identiteVectorLayerSymbol.composentIdentiteLayerList[0]) {
                        console.log("******* test --- ", identiteVectorLayerSymbol)
                        myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayerSymbol);
                        identiteVectorLayerSymbol.width = 1;
                        identiteVectorLayerSymbol.colorBase = "#000"
                        identiteVectorLayerSymbol.symbolCanva = this.legend.generateCanvasOfSymobol(identiteVectorLayerSymbol);

                        this.legend.addLegend(identiteVectorLayerSymbol , null , '2 ) ');
                        this.legend.addLegend(identiteVectorLayerSymbol.composentIdentiteLayerList[0] , null , '1 ) ');
                        // console.log('added');
                        if (!noInteractionMeta)
                            myExtObject.ref_Component.changerListValeurIndecator(identiteVectorLayerSymbol.composentIdentiteLayerList[0].indecator.id, identiteVectorLayerSymbol.composentIdentiteLayerList[0].indecator.valeurIndicateurList, identiteVectorLayerSymbol.composentIdentiteLayerList[0].colorGraphList, echellGraph);
                        myExtObject.vectorLayerList.push(identiteVectorLayerSymbol)
                    }

            });
            // this.legend.addLegend(tmpColorDegrade , null , '2 ) ');
            // this.legend.addLegend(identiteVectorLayerSymbol , null , '1 ) ');

            // this.legend.addLegend(identiteVectorLayerSymbol , null , '2 ) ');
            // this.legend.addLegend(identiteVectorLayerSymbol.composentIdentiteLayerList[0] , null , '1 ) ');

            console.log("******* test --- ", identiteVectorLayerSymbol)
            myExtObject.ref_Component.removeBusy();
            identiteVectorLayerSymbol.vectorLayer.getSource().on('change', function(evt){
                var echelle = niv(identiteVectorLayerSymbol.indecator.echelle);
                var source = evt.target;
                if(source.getState() === 'ready'){
                    identiteVectorLayerSymbol.vectorLayer.getSource().getFeatures().forEach(feature => {

                        // console.log(feature.values_)
                        // console.log(itemColor.valeurIndicateurList)
                        // console.log(itemSymbol.valeurIndicateurList)
                        var valeur = itemColor.valeurIndicateurList.filter(function (valeurIndicateur) {
                            return valeurIndicateur[echelle].id == feature.values_.id;
                        })
                        var valeur2 = itemSymbol.valeurIndicateurList.filter(function (valeurIndicateur) {
                            return valeurIndicateur[echelle].id == feature.values_.id;
                        })

                        //console.log(JSON.parse(values));
                        // console.log(valeur);
                        if(valeur.length > 0)
                            feature.values_[valeur[0].indicateur.libelle] = valeur[0].valeur;
                        if(valeur2.length > 0)
                            feature.values_[valeur2[0].indicateur.libelle] = valeur2[0].valeur;
                        delete feature.values_['style'];
                        delete feature.values_['end'];
                        delete feature.values_['val_indic2'];
                    })
                }
            })

            var selecti = new ol.interaction.Select({
              key: 'selecti',
                hitTolerance: 5,
                condition: ol.events.condition.singleClick
            });
            myExtObject.map.addInteraction(selecti);
            // Select feature when click on the reference index
            selecti.on('select', function(e) {
                // console.log('clicked')
                var f = e.selected[0];
                if (f) {
                    var prop = f.getProperties();
                    var ul = $('.options ul').html('');
                    for (var p in prop) if (p!=='geometry') {
                        $('<li>').text(p+': '+prop[p]).appendTo(ul);
                    }
                }
            });

            // Select control
            myExtObject.selectCtrl = new ol.control.Select({
              key: 'selectCtrl',
                // target: $(".options").get(0),
                source: identiteVectorLayerSymbol.vectorLayer.getSource(),
                property: $(".options select").val()
            });
            myExtObject.map.addControl (myExtObject.selectCtrl);
            //hide
            myExtObject.selectCtrl.on('select', function(e) {
                identiteVectorLayerSymbol.vectorLayer.getSource().getFeatures().forEach(function(f) {
                    f.setStyle([]);
                  });
                  // Show current
                  e.features.forEach(function(f) {
                    f.setStyle(null);
                  });

            });

        }
        // this.croisement = true;
        // if (myExtObject.vectorLayerList && myExtObject.vectorLayerList.length > 0) {
        //     myExtObject.map.removeLayer(myExtObject.vectorLayerList[0].vectorLayer);
        //     this.legend.removeLegend(myExtObject.vectorLayerList[0]);
        //     this.legend.removeLegend(myExtObject.vectorLayerList[0].composentIdentiteLayerList[0]);
        // }

        // myExtObject.vectorLayerList = []
        // var identiteVectorLayerSymbol = IdentiteLayer.getInstance();
        // var itemSymbol = groupIndecatorSlected.find(a => { return a.modeRepresentation != "DEGRADE_COULEUR" })
        // var tmpColorDegrade = IdentiteLayer.getInstance();
        // var itemColor = groupIndecatorSlected.find(a => { return a.modeRepresentation == "DEGRADE_COULEUR" })
        // if (itemSymbol && itemColor) {
        //     identiteVectorLayerSymbol.id = itemSymbol.id;
        //     identiteVectorLayerSymbol.symbolMode = itemSymbol.modeRepresentation;
        //     identiteVectorLayerSymbol.indecator = itemSymbol;
        //     identiteVectorLayerSymbol.colorBase = this.colorClass.getColorByHexa("");
        //     var echellGraph;
        //     var niv = function(echelle) {
        //         var echellFromSetting = "";
        //         echellGraph = "pvn";
        //         switch (echelle) {
        //             case 'Régionale':
        //                 echellFromSetting = 'region';
        //                 echellGraph = 'reg';
        //                 break;
        //             case 'Provinciale':
        //                 echellFromSetting = 'province';
        //                 echellGraph = 'pvn';
        //                 break;
        //             case 'Communale':
        //                 echellFromSetting = 'commune';
        //                 echellGraph = 'cmn';
        //                 break;
        //             case 'Unitale':
        //                 echellFromSetting = 'unite_territorial';
        //                 echellGraph = 'unt';
        //                 break;
        //             default:
        //                 echellFromSetting = 'region';
        //                 echellGraph = 'reg';
        //                 break;
        //         }
        //         return echellFromSetting;
        //     }
        //     var promiseVS = new Promise((resolve, reject) => {
        //         myExtObject.ref_Component.addBusy();
        //         this.symbolModePresentation.doSymbolVector(identiteVectorLayerSymbol, myExtObject.vectorSource, true, niv(identiteVectorLayerSymbol.indecator.echelle), resolve);
        //     })

        //     identiteVectorLayerSymbol.val_tab = [];
        //     for (var i = 0; i < identiteVectorLayerSymbol.val_tab_global.length; i++) { identiteVectorLayerSymbol.val_tab.push(identiteVectorLayerSymbol.val_tab_global[i].valeur); }
        //     myExtObject.currentIndecator = identiteVectorLayerSymbol.indecator
        //     this.legend.getClassificationByValue(identiteVectorLayerSymbol, "");

        //     tmpColorDegrade.id = itemColor.id;
        //     tmpColorDegrade.symbolMode = itemColor.modeRepresentation;
        //     tmpColorDegrade.indecator = itemColor;

        //     tmpColorDegrade.colorBase = this.colorClass.getColorByHexa(itemColor.couleur);

        //     tmpColorDegrade.val_tab = [];
        //     tmpColorDegrade.val_tab_global = itemColor.valeurIndicateurList;
        //     if (!tmpColorDegrade.val_tab_global || (tmpColorDegrade.val_tab_global && tmpColorDegrade.val_tab_global.length == 0)) return;
        //     for (var i = 0; i < tmpColorDegrade.val_tab_global.length; i++) { tmpColorDegrade.val_tab.push(tmpColorDegrade.val_tab_global[i].valeur); }
        //     myExtObject.currentIndecator = tmpColorDegrade.indecator
        //     this.legend.getClassificationByValue(tmpColorDegrade, "");
        //     identiteVectorLayerSymbol.composentIdentiteLayerList = [];
        //     console.log(tmpColorDegrade);
        //     identiteVectorLayerSymbol.composentIdentiteLayerList.push(tmpColorDegrade)
        //     console.log(identiteVectorLayerSymbol);
        //     var interv = this.legend.getInterval_2(identiteVectorLayerSymbol.indecator.nombreClass, identiteVectorLayerSymbol.serie, identiteVectorLayerSymbol.indecator.methodClassifi, identiteVectorLayerSymbol.val_tab_global);
        //     var interv2 = this.legend.getInterval_2(tmpColorDegrade.indecator.nombreClass, tmpColorDegrade.serie, tmpColorDegrade.indecator.methodClassifi, tmpColorDegrade.val_tab_global);


        //     var url = 'http://localhost:8484/geoserver/odt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=odt:provinces_region&maxFeatures=50&outputFormat=application%2Fjson&viewparams=region_id:'+myExtObject.inRegion;
        //     var provinces;
        //     $.ajax({
        //         type : 'get',
        //         url : url,
        //         async : false,
        //         success : function(response){
        //             provinces = response;

        //         }
        //     })

        //     console.log( identiteVectorLayerSymbol.val_tab_global );
        //     console.log( tmpColorDegrade.val_tab_global );
        //     var features = this.stylish(provinces,identiteVectorLayerSymbol.val_tab_global,tmpColorDegrade.val_tab_global,interv,interv2,(tmpColorDegrade.colorBase).toString(),identiteVectorLayerSymbol.symbolMode);
        //     var vectorSource = new ol.source.Vector({
        //         features: features
        //   });
        //     var vectorLayer = new ol.layer.Vector({
        //         source: vectorSource
        //     });
        //     myExtObject.map.addLayer(vectorLayer);

        //     vectorSource.on('change', function(evt){
        //         var source=evt.target;
        //         if(source.getState() === 'ready'){

        //             vectorSource.getFeatures().forEach(feature => {

        //                 var valeur1 = tmpColorDegrade.indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
        //                     return valeurIndicateur.province.id == feature.values_.id_province;
        //                 })
        //                 .map (valeurIndicateur => valeurIndicateur.valeur);
        //                 var valeur2 = identiteVectorLayerSymbol.indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
        //                     return valeurIndicateur.province.id == feature.values_.id_province;
        //                 })
        //                 .map (valeurIndicateur => valeurIndicateur.valeur);
        //                 var values = {id_province : feature.values_.id_province, libelle : feature.values_.libelle, surface : feature.values_.surface, geometry: feature.values_.geometry , valeur1 : valeur1, valeur2: valeur2 };
        //                 feature.values_ = values;
        //             })
        //         }
        //     })

        //     // filter  interaction
        //     var selecti = new ol.interaction.Select({
        //         hitTolerance: 5,
        //         condition: ol.events.condition.singleClick
        //     });
        //     myExtObject.map.addInteraction(selecti);
        //     // Select feature when click on the reference index
        //     selecti.on('select', function(e) {
        //         console.log('clicked')
        //         var f = e.selected[0];
        //         if (f) {
        //         var prop = f.getProperties();
        //         var ul = $('.options ul').html('');
        //         for (var p in prop) if (p!=='geometry') {
        //             $('<li>').text(p+': '+prop[p]).appendTo(ul);
        //         }
        //         }
        //     });

        //     // Select control
        //     myExtObject.selectCtrl = new ol.control.Select({
        //         // target: $(".options").get(0),
        //         source: vectorSource,
        //         property: $(".options select").val()
        //     });
        //     myExtObject.map.addControl (myExtObject.selectCtrl);
        //     //hide
        //     myExtObject.selectCtrl.on('select', function(e) {
        //         vectorSource.getFeatures().forEach(function(f) {
        //             f.setStyle([]);
        //           });

        //           e.features.forEach(function(f) {
        //             f.setStyle(null);
        //           });
        //     });

        //     myExtObject.ref_Component.removeBusy();
        //     var promise;
        //     identiteVectorLayerSymbol.width = 1;
        //     identiteVectorLayerSymbol.colorBase = "#000"
        //     identiteVectorLayerSymbol.symbolCanva = this.legend.generateCanvasOfSymobol(identiteVectorLayerSymbol);

        // myExtObject.vectorLayerList.push(identiteVectorLayerSymbol.vectorLayer);
        //myExtObject.vectorLayerList.push(vectorLayer);



        // }
    }

    symbolTempLayer(indecator, typeSymbol) {
      myExtObject.currentIndecator = indecator;
      var currentIndecator = indecator;
      myExtObject.positionPrv = '';
      let position,
          url,
          echelle,
          type;

      if ( indecator.echelle == "Provinciale"){
          url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + indecator.decoupage.id;
          position = '2';
          echelle = "province";
      }

      else if ( indecator.echelle == "Communale") {
          url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheCmnToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + indecator.decoupage.id;
          position = '4';
          echelle = "commune";
      }

      else if ( indecator.echelle == "Cercle" || indecator.echelle == "Préfécture d'arrondissement") {
          type = indecator.valeurIndicateurList[0].cerclePrefArr.type
          url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCerPrefArr + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";type:" + type;
          position = '3';
          echelle = "cerclePrefArr";
      }
      else if ( indecator.echelle == "Unitale") {

          let categorie = indecator.valeurIndicateurList[0].uniteTerritorial.categorie.id.toString();
          url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheUntToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";categorie_id:"+ categorie;
          position = '10';
          echelle = "uniteTerritorial";
      }
      else if ( indecator.echelle == "Arrondissement" || indecator.echelle == "Douar" || indecator.echelle == "Centre Urbain") {
          type = indecator.valeurIndicateurList[0].douarCentreUrb.type
          url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheDouarCentreUrb + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";type:" + type;
          position = '5';
          echelle = "douarCentreUrb";
      }
      else {
          url =  myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg +"&viewparams=decoupage_id:" +indecator.decoupage.id+'&outputFormat=application/json';
          position = '';
          echelle = "region";
      }
      if (currentIndecator) {

          var identiteVectorLayer = IdentiteLayer.getInstance();
          identiteVectorLayer.id = currentIndecator.id;
          identiteVectorLayer.symbolMode = typeSymbol;
          identiteVectorLayer.indecator = currentIndecator;
          identiteVectorLayer.colorBase = this.colorClass.getColorByHexa(indecator.couleur);

          this.symbolModePresentation.doSymbolVector(identiteVectorLayer, myExtObject.vectorSourcePrv);
          identiteVectorLayer['val_tab' + position] = [];
          console.log(identiteVectorLayer.val_tab_global)

          for (var i = 0; i < identiteVectorLayer.val_tab_global.length; i++) {
              identiteVectorLayer['val_tab' + position].push(identiteVectorLayer.val_tab_global[i].valeur);
          }
          myExtObject.currentIndecator = identiteVectorLayer.indecator
          this.legend.getClassificationByValue(identiteVectorLayer, position);
          myExtObject.positionPrv = "2";
          // this.symbolModePresentation.generateStyleSymbol(identiteVectorLayer, "province")
          // if (currentIndecator.figurecolor) {
          //     this.symbolModePresentation.generateStyleSymbolSrokOneColor(identiteVectorLayer)
          // } else {
          //     this.symbolModePresentation.generateStyleSymbol(identiteVectorLayer)
          // }
          // var url;
          // if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id) {
          //     /*  url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
          //         '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrv + "&viewparams=decoupage_id:" + identiteVectorLayer.indecator.decoupage.id + "&outputFormat=application/json';
          // } else { */
          //     let type = ""

          // } else {
          //     return;
          // }
          // url = 'http://localhost:8484/geoserver/odt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=odt:provinces_region&maxFeatures=50&outputFormat=application%2Fjson&viewparams=region_id:'+myExtObject.inRegion;
          var vectorSource = new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: () => {
                  return url;
              },
              strategy: ol.loadingstrategy.bbox,
              id: indecator.id
          });
          var vectorLayerAdd = new ol.layer.Vector({
              source: vectorSource,
              name: identiteVectorLayer.indecator.libelle,
              class: "indecator"
          });

        var provinces;
        $.ajax({
            type : 'get',
            url : url,
            async : false,
            success : function(response){
              provinces = response;

            }
        })
        var interv = this.legend.getInterval_2(identiteVectorLayer.indecator.nombreClass, identiteVectorLayer['serie'+ position], identiteVectorLayer.indecator.methodClassifi, identiteVectorLayer.val_tab_global);
        console.log(identiteVectorLayer.symbolMode);
  //        var stroke = new ol.style.Stroke({color: 'black', width: 2});
  //          var fill = new ol.style.Fill({color: (identiteVectorLayer.colorBase).toString()});
        var features = this.stylish(provinces,identiteVectorLayer.val_tab_global,null,interv,null,(identiteVectorLayer.colorBase).toString(),identiteVectorLayer.symbolMode, echelle);


        var vectorSource = new ol.source.Vector({
              features: features
        });
        var vectorLayer = new ol.layer.Vector({
          source: vectorSource,
           name: identiteVectorLayer.indecator.libelle,
              class: "indecator"
      });
          //  identiteVectorLayer.vectorLayer = vectorLayerAdd;
           /***
            * End The code .
            */
          // identiteVectorLayer.vectorLayer.refresh({ force: false });

          identiteVectorLayer.vectorLayer = vectorLayer;
          identiteVectorLayer.vectorLayerProvence = vectorLayer;
          /***
           * End Code .
           */
          console.log(identiteVectorLayer);
          //console.log(identiteVectorLayer.vectorLayer)
          // myExtObject.tempMap.addLayer(identiteVectorLayer.vectorLayer);
          myExtObject.tempMap.addLayer(vectorLayer);

          myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
          identiteVectorLayer.symbolCanva = this.legend.generateCanvasOfSymobol(identiteVectorLayer);
          this.legend.addLegend(identiteVectorLayer , null , '');
          myExtObject.controlMapSevice.showLabel(url);
          myExtObject.vectorLayerList.push(identiteVectorLayer.vectorLayer);
          myExtObject.vectorLayerList.push(vectorLayerAdd);
          myExtObject.vectorLayerList.push(vectorLayer);
          vectorSource.on('change', function(evt){
              var source=evt.target;
              if(source.getState() === 'ready'){

                  vectorSource.getFeatures().forEach(feature => {
                      //console.log(feature);
                      var valeur = indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
                          return valeurIndicateur[echelle].id == feature.values_['id_'+echelle];
                      })
                      .tempMap (valeurIndicateur => valeurIndicateur.valeur);
                      // var values = { ['id_'+echelle] : feature.values_['id_'+echelle],
                      //                 libelle : feature.values_.libelle,
                      //                 surface : feature.values_.surface,
                      //                 geometry: feature.values_.geometry,
                      //                 valeur : valeur};
                      var values = new Object();
                      values['id_'+echelle]  = feature.values_['id_'+echelle];
                      values['libelle'] = feature.values_.libelle
                      values['surface'] = feature.values_.surface
                      values['geometry'] = feature.values_.geometry
                      values['valeur'] = valeur
                      feature.values_ = values;
                  })
              }
          })

          // filter  interaction
          var selecti = new ol.interaction.Select({
              key: 'selecti',
              hitTolerance: 5,
              condition: ol.events.condition.singleClick
          });
          myExtObject.tempMap.addInteraction(selecti);
          // Select feature when click on the reference index
          selecti.on('select', function(e) {
              console.log('clicked')
              var f = e.selected[0];
              if (f) {
              var prop = f.getProperties();
              var ul = $('.options ul').html('');
              for (var p in prop) if (p!=='geometry') {
                  $('<li>').text(p+': '+prop[p]).appendTo(ul);
              }
              }
          });

          // Select control
          myExtObject.selectCtrl = new ol.control.Select({
              key: 'selectCtrl',
              // target: $(".options").get(0),
              source: vectorSource,
              property: $(".options select").val()
          });
          myExtObject.tempMap.addControl (myExtObject.selectCtrl);
          //hide
          myExtObject.selectCtrl.on('select', function(e) {
              vectorSource.getFeatures().forEach(function(f) {
                  f.setStyle([]);
                });
                // Show current
                e.features.forEach(function(f) {
                  f.setStyle(null);
                });
              // identiteVectorLayer.selectPointerSelectFeature.getFeatures().clear();
              // for (var i=0, f; f=e.features[i]; i++) {
              //     identiteVectorLayer.selectPointerSelectFeature.getFeatures().push(f);
              // }
          });
      }
  }

}

var UniqueIndecatorCercleSeviceSingloton = (function() {
    var instance;

    function createInstance() {
        var object = new UniqueIndecatorCercleSevice();
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
