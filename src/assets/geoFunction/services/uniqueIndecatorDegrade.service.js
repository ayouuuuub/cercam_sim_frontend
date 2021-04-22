class UniqueIndecatorDegradeSevice {

    constructor() {
        this.colorClass = ColorClassSingleton.getInstance();
        this.legend = LegendSingleton.getInstance();
        this.symbolModePresentation = SymbolModeSingleton.getInstance();
        this.colorDegrade = ColorDegradeModeSingleton.getInstance();
        this.isChange = false;
    }
    getEchelle(echelle) {
        var echellFromSetting = "";
        switch (echelle) {
            case 'Régionale':
                echellFromSetting = 'region';
                break;
            case 'Provinciale':
                echellFromSetting = 'province';
                break;
            case 'Communale':
                echellFromSetting = 'commune'
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
                break;
        }
        return echellFromSetting;
    }
    createLayerRegion(indecator, noInteractionTablur, ranges) {
            myExtObject.currentIndecator = indecator;
            var url;
            var identiteVectorLayer = IdentiteLayer.getInstance();
            for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {
                identiteVectorLayer.val_tab.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
                if (indecator.valeurIndicateurList[i].region) {
                    identiteVectorLayer.nom.push(indecator.valeurIndicateurList[i].region.libelle);
                    identiteVectorLayer.ids.push(indecator.valeurIndicateurList[i].region.id);
                }
            }
            identiteVectorLayer.id = indecator.id;
            identiteVectorLayer.indecator = indecator;
            //console.log(indecator)

            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg +"&viewparams=decoupage_id:" +indecator.decoupage.id+'&outputFormat=application/json';
            console.log(url);
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
                title: identiteVectorLayer.indecator.libelle,
                name: identiteVectorLayer.indecator.libelle,
                class: "indecator"
            });
            identiteVectorLayer.vectorLayer = vectorLayerAdd;
            identiteVectorLayer.vectorLayerRegion = vectorLayerAdd;
            myExtObject.currentIndecator = identiteVectorLayer.indecator
            this.legend.getClassificationByValue(identiteVectorLayer, "");
            if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList) identiteVectorLayer.colorGraphList = [];

            var promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionReg(e, identiteVectorLayer, resolve));
            });

            promise.then((string) => {
                if (!noInteractionTablur) myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'reg');
            })

            myExtObject.map.addLayer(vectorLayerAdd);
            myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
            //myExtObject.controlMapSevice.showLabel(url);
            //addd
            this.legend.addLegend(identiteVectorLayer , 'serie' , '');

            // representation textuelle
            for(var i=1,j=0; i < $('.geostats-legend').children().length*2 - 1; i+=2,j++){
              if( ranges[j]  != '' && ranges[j] != null)
                    $('.geostats-legend').find('div').eq(i).contents()[1].data = ranges[j];
            }
            // prepare data for filter
            vectorSource.on('change', function(evt) {
                var source=evt.target;
                if(source.getState() === 'ready'){
                    vectorSource.getFeatures().forEach(feature => {
                        var valeur = indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
                            return valeurIndicateur.region.id == feature.values_.id_region;
                        })
                        .map (valeurIndicateur => valeurIndicateur.valeur);
                        var values = { id_region : feature.values_.id_region, libelle : feature.values_.libelle, surface : feature.values_.surface, geometry: feature.values_.geometry , valeur : valeur};
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
                source: vectorSource,
                property: $(".options select").val()
            });
            myExtObject.map.addControl(myExtObject.selectCtrl);
            //hide
            myExtObject.selectCtrl.on('select', function(e) {
                vectorSource.getFeatures().forEach(function(f) {
                    f.setStyle([]);
                  });
                  // Show current
                  e.features.forEach(function(f) {
                    f.setStyle(null);
                  });
            });

            return identiteVectorLayer;
    }

    //create provence form first place
    createOneLayerOfPrv(indecator, noInteractionTablur, ranges) {

            myExtObject.currentIndecator = indecator;
            var identiteVectorLayer = IdentiteLayer.getInstance();
            identiteVectorLayer.val_tab2 = [];
            identiteVectorLayer.ids2 = [];
            identiteVectorLayer.nom2 = [];
            for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {
                identiteVectorLayer.val_tab2.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
                if (indecator.valeurIndicateurList[i].province) {
                    identiteVectorLayer.nom2.push(indecator.valeurIndicateurList[i].province.libelle);
                    identiteVectorLayer.ids2.push(indecator.valeurIndicateurList[i].province.id);
                }
            }
            identiteVectorLayer.id = indecator.id;
            identiteVectorLayer.indecator = indecator;
            console.log(identiteVectorLayer);
            var url;
            if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id) {
                /*  url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                    '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrv + "&viewparams=decoupage_id:" + identiteVectorLayer.indecator.decoupage.id + "&outputFormat=application/json';
            } else { */
                //url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                     //'&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrv + "&viewparams=decoupage_id:" + identiteVectorLayer.indecator.decoupage.id + '&outputFormat=application/json';
                //url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.inRegion;
                url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+ ";decoupage_id:"+ indecator.decoupage.id;
            } else {
                return;
            }
            console.log(url);
            var vectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url:url,
                strategy: ol.loadingstrategy.bbox,
                id: indecator.id
            });
            var vectorLayerAdd = new ol.layer.Vector({
                source: vectorSource,
                title: identiteVectorLayer.indecator.libelle,
                name: identiteVectorLayer.indecator.libelle,
                class: "indecator"
            });
            identiteVectorLayer.vectorLayer = vectorLayerAdd;
            identiteVectorLayer.vectorLayerProvence = vectorLayerAdd;
            myExtObject.currentIndecator = identiteVectorLayer.indecator

            this.legend.getClassificationByValue(identiteVectorLayer, "2");
            if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList)
                identiteVectorLayer.colorGraphList = [];

            var promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionProv(e, identiteVectorLayer, resolve));
            });

            promise.then((string) => {
                if (!noInteractionTablur) myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'pvnOne');
            })


            //ORDT
            myExtObject.map.addLayer(vectorLayerAdd);
            // hover on map
            myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
            // map labels
            //myExtObject.controlMapSevice.showLabel(url);
            // legend
            this.legend.addLegend(identiteVectorLayer, 'serie2' , '');


            console.log(vectorLayerAdd.getSource().getFeatures());
            vectorLayerAdd.getSource().getFeatures().forEach(function(feature) {
                console.log(feature);
            });
            // representation textuelle
            for(var i=1,j=0; i < $('.geostats-legend').children().length*2 - 1; i+=2,j++) {
                if( ranges[j]  != '' && ranges[j] != null)
                    $('.geostats-legend').find('div').eq(i).contents()[1].data = ranges[j];
            }
            // prepare data for filter
            vectorSource.on('change', function(evt) {
                var source=evt.target;
                if(source.getState() === 'ready'){

                    vectorSource.getFeatures().forEach(feature => {
                        //console.log(feature);
                        var valeur = indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
                            return valeurIndicateur.province.id == feature.values_.id_province;
                        })
                        .map (valeurIndicateur => valeurIndicateur.valeur);
                        var values = {id_province : feature.values_.id_province, libelle : feature.values_.libelle, surface : feature.values_.surface, geometry: feature.values_.geometry , valeur : valeur};
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
            //myExtObject.map.addLayer(identiteVectorLayer.vectorLayerProvence);
            //add


            return identiteVectorLayer;
    }
    //create unite territorial
    // createOneLayerOfUnt(indecator, noInteractionTablur, ranges) {
    //         myExtObject.currentIndecator = indecator;
    //         var identiteVectorLayer = IdentiteLayer.getInstance();
    //         identiteVectorLayer.val_tab10 = [];
    //         identiteVectorLayer.ids10 = [];
    //         identiteVectorLayer.nom10 = [];
    //         for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {

    //             identiteVectorLayer.val_tab10.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
    //             console.log(indecator.valeurIndicateurList[i].uniteTerritorial.categorie.id , parseInt(indecator.categorieUnt), indecator.valeurIndicateurList[i].uniteTerritorial.categorie.id == parseInt(indecator.categorieUnt))
    //             if (indecator.valeurIndicateurList[i].uniteTerritorial && indecator.valeurIndicateurList[i].uniteTerritorial.categorie.id == parseInt(indecator.categorieUnt)) {
    //                 identiteVectorLayer.nom10.push(indecator.valeurIndicateurList[i].uniteTerritorial.libelle);
    //                 identiteVectorLayer.ids10.push(indecator.valeurIndicateurList[i].uniteTerritorial.id);
    //             }
    //         }
    //         console.log(identiteVectorLayer.val_tab10);
    //         if(identiteVectorLayer.val_tab10 != null && identiteVectorLayer.val_tab10.length > 0) {
    //         let type = indecator.valeurIndicateurList[0].uniteTerritorial.type;
    //         let categorie = indecator.valeurIndicateurList[0].uniteTerritorial.categorie.id.toString();
    //                     console.log(indecator.categorieUnt);
    //         identiteVectorLayer.id = indecator.id;
    //         identiteVectorLayer.indecator = indecator;
    //         var url;
    //         if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id) {
    //             url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheUntToReg + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+";categorie_id:"+categorie;
    //         } else {
    //             return;
    //         }
    //         console.log(url);
    //         var vectorSource = new ol.source.Vector({
    //             format: new ol.format.GeoJSON(),
    //             url:url,
    //             strategy: ol.loadingstrategy.bbox,
    //             id: indecator.id
    //         });
    //         var vectorLayerAdd = new ol.layer.Vector({
    //             source: vectorSource,
    //             title: identiteVectorLayer.indecator.libelle,
    //             name: identiteVectorLayer.indecator.libelle,
    //             class: "indecator"
    //         });
    //         console.log(identiteVectorLayer);
    //         identiteVectorLayer.vectorLayer = vectorLayerAdd;
    //         identiteVectorLayer.vectorLayerProvence = vectorLayerAdd;
    //         myExtObject.currentIndecator = identiteVectorLayer.indecator
    //         this.legend.getClassificationByValue(identiteVectorLayer, "10");
    //         if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList) identiteVectorLayer.colorGraphList = [];
    //         console.log(indecator);
    //         var promise = new Promise((resolve, reject) => {
    //             vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionUnt(e, identiteVectorLayer, resolve));
    //         });

    //         promise.then((string) => {
    //             if (!noInteractionTablur) myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'untOne');
    //         })

    //         console.log(identiteVectorLayer.vectorLayerProvence);


    //         //ORDT
    //         myExtObject.map.addLayer(vectorLayerAdd);

    //         let urlProvince = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+ ";decoupage_id:"+ indecator.decoupage.id;
    //         console.log(url);
    //         // var provinceVectorSource = new ol.source.Vector({
    //         //     format: new ol.format.GeoJSON(),
    //         //     url:urlProvince,
    //         //     strategy: ol.loadingstrategy.bbox,
    //         //     id: indecator.id

    //         // });
    //         // identiteVectorLayer.vectorLayerProvence = new ol.layer.Vector({
    //         //     source: provinceVectorSource,
    //         //     title: identiteVectorLayer.indecator.libelle,
    //         //     name: identiteVectorLayer.indecator.libelle,
    //         //     class: "indecator"
    //         // });
    //         myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
    //         //myExtObject.controlMapSevice.showLabel(url);
    //         //addd
    //         this.legend.addLegend(identiteVectorLayer, 'serie10' , '');
    //         for(var i=1,j=0; i < $('.geostats-legend').children().length*2 - 1; i+=2,j++){
    //             if( ranges[j]  != '')
    //                 $('.geostats-legend').find('div').eq(i).contents()[1].data = ranges[j];
    //         }



    //         vectorSource.on('change', function(evt){
    //             var source=evt.target;
    //             if(source.getState() === 'ready'){

    //                 vectorSource.getFeatures().forEach(feature => {
    //                     console.log(feature);
    //                     var valeur = indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
    //                         return valeurIndicateur.uniteTerritorial.id == feature.values_.id_unite_territorial;
    //                     })
    //                     .map (valeurIndicateur => valeurIndicateur.valeur);
    //                     var values = {id_unite_territorial : feature.values_.id_unite_territorial, libelle : feature.values_.libelle, surface : feature.values_.surface, geometry: feature.values_.geometry , valeur : valeur};
    //                     feature.values_ = values;
    //                 })
    //             }
    //         })

    //         console.log(vectorLayerAdd.getSource().getFeatures());
    //         vectorLayerAdd.getSource().getFeatures().forEach(function(feature) {
    //             console.log(feature);
    //         });
    //         // filter  interaction
    //         var selecti = new ol.interaction.Select({
    //           key: 'selecti',
    //             hitTolerance: 5,
    //             condition: ol.events.condition.singleClick
    //         });
    //         myExtObject.map.addInteraction(selecti);
    //         // Select feature when click on the reference index
    //         selecti.on('select', function(e) {
    //             console.log('clicked')
    //             var f = e.selected[0];
    //             if (f) {
    //             var prop = f.getProperties();
    //             var ul = $('.options ul').html('');
    //             for (var p in prop) if (p!=='geometry') {
    //                 $('<li>').text(p+': '+prop[p]).appendTo(ul);
    //             }
    //             }
    //         });

    //         // Select control
    //         myExtObject.selectCtrl = new ol.control.Select({
    //           key: 'selectCtrl',
    //             // target: $(".options").get(0),
    //             source: vectorSource,
    //             property: $(".options select").val()
    //         });
    //         myExtObject.map.addControl (myExtObject.selectCtrl);
    //         //hide
    //         myExtObject.selectCtrl.on('select', function(e) {
    //             vectorSource.getFeatures().forEach(function(f) {
    //                 f.setStyle([]);
    //               });
    //               // Show current
    //               e.features.forEach(function(f) {
    //                 f.setStyle(null);
    //               });
    //             // identiteVectorLayer.selectPointerSelectFeature.getFeatures().clear();
    //             // for (var i=0, f; f=e.features[i]; i++) {
    //             //     identiteVectorLayer.selectPointerSelectFeature.getFeatures().push(f);
    //             // }
    //         });
    //       }
    //       myExtObject.ref_Component.removeBusy();


    //       return identiteVectorLayer;
    // }

      createOneLayerOfUnt(indecator, noInteractionTablur, ranges) {

        myExtObject.currentIndecator = indecator;
        var identiteVectorLayer = IdentiteLayer.getInstance();
        identiteVectorLayer.val_tab10 = [];
        identiteVectorLayer.ids10 = [];
        identiteVectorLayer.nom10 = [];
        for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {

            if (indecator.valeurIndicateurList[i].uniteTerritorial && indecator.valeurIndicateurList[i].uniteTerritorial.categorie.id == parseInt(indecator.categorieUnt)) {
                identiteVectorLayer.val_tab10.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
                identiteVectorLayer.nom10.push(indecator.valeurIndicateurList[i].uniteTerritorial.libelle);
                identiteVectorLayer.ids10.push(indecator.valeurIndicateurList[i].uniteTerritorial.id);
            }
        }
        identiteVectorLayer.id = indecator.id;
        identiteVectorLayer.indecator = indecator;
        console.log(identiteVectorLayer);
        var url;
        if(identiteVectorLayer.val_tab10.length > 0) {
        let categorie = indecator.valeurIndicateurList[0].uniteTerritorial.categorie.id.toString();
        if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id) {
            /*  url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrv + "&viewparams=decoupage_id:" + identiteVectorLayer.indecator.decoupage.id + "&outputFormat=application/json';
        } else { */
            //url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                //'&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrv + "&viewparams=decoupage_id:" + identiteVectorLayer.indecator.decoupage.id + '&outputFormat=application/json';
            //url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%10Fjson&viewparams=region_id:"+myExtObject.inRegion;
            url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheUntToReg + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+";categorie_id:"+parseInt(indecator.categorieUnt);
        } else {
            return;
        }
        console.log(url);
        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url:url,
            strategy: ol.loadingstrategy.bbox,
            id: indecator.id
        });
        var vectorLayerAdd = new ol.layer.Vector({
            source: vectorSource,
            title: identiteVectorLayer.indecator.libelle,
            name: identiteVectorLayer.indecator.libelle,
            class: "indecator"
        });
        identiteVectorLayer.vectorLayer = vectorLayerAdd;
        identiteVectorLayer.vectorLayerProvence = vectorLayerAdd;
        myExtObject.currentIndecator = identiteVectorLayer.indecator

        this.legend.getClassificationByValue(identiteVectorLayer, "10");
        if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList)
            identiteVectorLayer.colorGraphList = [];

        var promise = new Promise((resolve, reject) => {
            vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionUnt(e, identiteVectorLayer, resolve));
        });

        promise.then((string) => {
            if (!noInteractionTablur) myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'untOne');
        })


        //ORDT
        myExtObject.map.addLayer(vectorLayerAdd);
        // hover on map
        myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
        // map labels
        //myExtObject.controlMapSevice.showLabel(url);
        // legend
        this.legend.addLegend(identiteVectorLayer, 'serie10' , '');


        console.log(vectorLayerAdd.getSource().getFeatures());
        vectorLayerAdd.getSource().getFeatures().forEach(function(feature) {
            console.log(feature);
        });
        // representation textuelle
        for(var i=1,j=0; i < $('.geostats-legend').children().length*10 - 1; i+=10,j++){
            if( ranges[j]  != '' && ranges[j] != null)
                $('.geostats-legend').find('div').eq(i).contents()[1].data = ranges[j];
        }
        // prepare data for filter
        vectorSource.on('change', function(evt) {
            var source=evt.target;
            if(source.getState() === 'ready'){

                vectorSource.getFeatures().forEach(feature => {
                    //console.log(feature);
                    var valeur = indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
                        return valeurIndicateur.uniteTerritorial.id == feature.values_.id_unite_territorial;
                    })
                    .map (valeurIndicateur => valeurIndicateur.valeur);
                    var values = {id_unite_territorial : feature.values_.id_unite_territorial, libelle : feature.values_.libelle, surface : feature.values_.surface, geometry: feature.values_.geometry , valeur : valeur};
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
        //myExtObject.map.addLayer(identiteVectorLayer.vectorLayerProvence);
        //add
      }
       else
        myExtObject.ref_Component.showCustomWarning("Aucune valeur est lié à la catégorie choisit");
        return identiteVectorLayer;
    }
    //createLayer of Cercle/Prefecture d'arrondissement
    createOneLayerOfCerPrefArr(indecator, noInteractionTablur, ranges) {
        myExtObject.currentIndecator = indecator;

        var identiteVectorLayer = IdentiteLayer.getInstance();
        identiteVectorLayer.val_tab3 = [];
        identiteVectorLayer.ids3 = [];
        identiteVectorLayer.nom3 = [];
        //console.log("createOneLayerOfPrv")
        for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {
            identiteVectorLayer.val_tab3.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
            if (indecator.valeurIndicateurList[i].cerlePrefArr) {
                identiteVectorLayer.nom3.push(indecator.valeurIndicateurList[i].cerlePrefArr.libelle);
                identiteVectorLayer.ids3.push(indecator.valeurIndicateurList[i].cerlePrefArr.id);
            }
        }
        var type = this.getEchelle(indecator.echelle);
        identiteVectorLayer.id = indecator.id;
        identiteVectorLayer.indecator = indecator;
        var url;

        if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id) {
            url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCerPrefArr + '&outputFormat=application%2Fjson&viewparams=region_id:'+myExtObject.stringAllRegions+ ";decoupage_id:"+ indecator.decoupage.id+';type:'+type;
        } else {
            return;
        }

        var vectorSource = new ol.source.Vector({
            format : new ol.format.GeoJSON(),
            url : url,
            strategy : ol.loadingstrategy.bbox,
            id : indecator.id
        });

        var vectorLayerAdd = new ol.layer.Vector({
            source: vectorSource,
            name: identiteVectorLayer.indecator.libelle,
            class: "indecator"
        });

        identiteVectorLayer.vectorLayer = vectorLayerAdd;
        identiteVectorLayer.vectorLayerCerPrefArr = vectorLayerAdd;

        myExtObject.currentIndecator = identiteVectorLayer.indecator
        this.legend.getClassificationByValue(identiteVectorLayer, "3");
        if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList) identiteVectorLayer.colorGraphList = [];

        var promise = new Promise((resolve, reject) => {
            vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionCerPrefArr(e, identiteVectorLayer, resolve));
        });
        console.log(vectorLayerAdd);
        promise.then((string) => {
            if (!noInteractionTablur) myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'cerlePrefArrOne');
        })

        console.log('vector : ' + vectorLayerAdd);
        console.log('url : ' + url);
        //ORDT
        myExtObject.map.addLayer(vectorLayerAdd);
        // myExtObject.map.addLayer(identiteVectorLayer.vectorLayerCerPrefArr);
        myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
        //myExtObject.controlMapSevice.showLabel(url);

    //addd
        this.legend.addLegend(identiteVectorLayer, 'serie3' , '');

        return identiteVectorLayer;
    }
    //create Cmn form first place
    createOneLayerOfCmn(indecator, noInteractionTablur, ranges) {
            myExtObject.currentIndecator = indecator;
            var identiteVectorLayer = IdentiteLayer.getInstance();
            identiteVectorLayer.val_tab4 = [];
            identiteVectorLayer.ids4 = [];
            identiteVectorLayer.nom4 = [];
            //console.log("createOneLayerOfPrv")
            for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {
                identiteVectorLayer.val_tab4.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
                if (indecator.valeurIndicateurList[i].commune) {
                    identiteVectorLayer.nom4.push(indecator.valeurIndicateurList[i].commune.libelle);
                    identiteVectorLayer.ids4.push(indecator.valeurIndicateurList[i].commune.id);
                }
            }
            identiteVectorLayer.id = indecator.id;
            identiteVectorLayer.indecator = indecator;
            var url;

            if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id) {
                url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':'  + myExtObject.ref_Component.settings.geo.coucheCmnToReg + '&outputFormat=application%2Fjson&viewparams=region_id:'+myExtObject.stringAllRegions+ ";decoupage_id:"+ indecator.decoupage.id;
            } else {
                return;
            }
            var vectorSource = new ol.source.Vector({
                format : new ol.format.GeoJSON(),
                url : url,
                strategy : ol.loadingstrategy.bbox,
                id : indecator.id
            });

            var vectorLayerAdd = new ol.layer.Vector({
                source: vectorSource,
                name: identiteVectorLayer.indecator.libelle,
                class: "indecator"
            });
            console.log(vectorLayerAdd);
            identiteVectorLayer.vectorLayer = vectorLayerAdd;
            identiteVectorLayer.vectorLayerCmn = vectorLayerAdd;

            myExtObject.currentIndecator = identiteVectorLayer.indecator
            this.legend.getClassificationByValue(identiteVectorLayer, "4");
            if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList) identiteVectorLayer.colorGraphList = [];

            var promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionCmn(e, identiteVectorLayer, resolve));
            });
            console.log(vectorLayerAdd);
            promise.then((string) => {
                if (!noInteractionTablur) myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'cmnOne');
            })

            console.log('vector : ' + vectorLayerAdd);
            console.log('url : ' + url);
            //ORDT
            myExtObject.map.addLayer(vectorLayerAdd);
            myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
            //myExtObject.controlMapSevice.showLabel(url);

//addd
            this.legend.addLegend(identiteVectorLayer, 'serie4' , '');

            vectorLayerAdd.getSource().getFeatures().forEach(function(feature) {
              console.log(feature);
          });
          // representation textuelle
          for(var i=1,j=0; i < $('.geostats-legend').children().length*2 - 1; i+=2,j++){
              if( ranges[j]  != '' && ranges[j] != null)
                  $('.geostats-legend').find('div').eq(i).contents()[1].data = ranges[j];
          }
          // prepare data for filter
          vectorSource.on('change', function(evt) {
              var source=evt.target;
              if(source.getState() === 'ready'){

                  vectorSource.getFeatures().forEach(feature => {
                      //console.log(feature);
                      var valeur = indecator.valeurIndicateurList.filter(function (valeurIndicateur) {
                          return valeurIndicateur.commune.id == feature.values_.id_commune;
                      })
                      .map (valeurIndicateur => valeurIndicateur.valeur);
                      var values = {id_commune : feature.values_.id_commune, libelle : feature.values_.libelle, surface : feature.values_.surface, geometry: feature.values_.geometry , valeur : valeur};
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
          //myExtObject.map.addLayer(identiteVectorLayer.vectorLayerProvence);
          //add

            return identiteVectorLayer;
    }

    //create Layer of Douar/Centre Urbain
    createOneLayerOfDcu(indecator, noInteractionTablur, ranges) {
        myExtObject.currentIndecator = indecator;
        var identiteVectorLayer = IdentiteLayer.getInstance();
        identiteVectorLayer.val_tab5 = [];
        identiteVectorLayer.ids5 = [];
        identiteVectorLayer.nom5 = [];

        for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {
            identiteVectorLayer.val_tab5.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
            if (indecator.valeurIndicateurList[i].douarCentreUrb) {
                identiteVectorLayer.nom5.push(indecator.valeurIndicateurList[i].douarCentreUrb.libelle);
                identiteVectorLayer.ids5.push(indecator.valeurIndicateurList[i].douarCentreUrb.id);
            }
        }
        var type = this.getEchelle(indecator.echelle);
        identiteVectorLayer.id = indecator.id;
        identiteVectorLayer.indecator = indecator;
        var url;

        if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id) {
            url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':'+ myExtObject.ref_Component.settings.geo.cocheDouarCentreUrb +'&outputFormat=application%2Fjson&viewparams=region_id:'+myExtObject.stringAllRegions+ ";decoupage_id:"+ indecator.decoupage.id+';type:'+type;
        } else {
            return;
        }
        var vectorSource = new ol.source.Vector({
            format : new ol.format.GeoJSON(),
            url : url,
            strategy : ol.loadingstrategy.bbox,
            id : indecator.id
        });

        var vectorLayerAdd = new ol.layer.Vector({
            source: vectorSource,
            name: identiteVectorLayer.indecator.libelle,
            class: "indecator"
        });
        console.log(vectorLayerAdd);
        identiteVectorLayer.vectorLayer = vectorLayerAdd;
        identiteVectorLayer.vectorLayerDcu = vectorLayerAdd;

        myExtObject.currentIndecator = identiteVectorLayer.indecator
        this.legend.getClassificationByValue(identiteVectorLayer, "5");
        if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList) identiteVectorLayer.colorGraphList = [];

        var promise = new Promise((resolve, reject) => {
            vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionDcu(e, identiteVectorLayer, resolve));
        });
        console.log(vectorLayerAdd);
        promise.then((string) => {
            if (!noInteractionTablur) myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'dcuOne');
        })

        console.log('vector : ' + vectorLayerAdd);
        console.log('url : ' + url);
        //ORDT
        myExtObject.map.addLayer(vectorLayerAdd);
        // myExtObject.map.addLayer(identiteVectorLayer.vectorLayerDcu);
        myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
        //myExtObject.controlMapSevice.showLabel(url);

    //addd
        this.legend.addLegend(identiteVectorLayer, 'serie5' , '');

        return identiteVectorLayer;
    }
    //ORDT
    createLayerOfCmn(indecator, noInteractionTablur, ranges) {
            myExtObject.currentIndecator = indecator;
            var identiteVectorLayer = IdentiteLayer.getInstance();
            identiteVectorLayer.val_tab4 = [];
            for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {
                identiteVectorLayer.val_tab4.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
                if (indecator.valeurIndicateurList[i].commune) {
                    identiteVectorLayer.nom4.push(indecator.valeurIndicateurList[i].commune.libelle);
                    identiteVectorLayer.ids4.push(indecator.valeurIndicateurList[i].commune.id);
                }
            }

            identiteVectorLayer.id = indecator.id;
            identiteVectorLayer.indecator = indecator;
            myExtObject.currentIndecator = identiteVectorLayer.indecator;
            if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList)
                identiteVectorLayer.colorGraphList = [];

            var url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+ ";decoupage_id:"+ indecator.decoupage.id;
            //
            myExtObject.ref_Component.addBusy();
            $.get(url,
                // success callback
                (data) => {
                    if (!data.features || (data.features && data.features.length == 0)) {
                        myExtObject.ref_Component.removeBusy();
                        return
                    }
                    // first add features
                    //  vectorSource.addFeatures(   vectorSource.getFormat().readFeatures(data));
                    /*    vectorSource = new ol.source.Vector({
                        features: [data.features]
                    }) */
                    this.legend.getClassificationByValue(identiteVectorLayer, "4");
                    var vectorSource = new ol.source.Vector({
                        format: new ol.format.GeoJSON({}),
                        strategy: ol.loadingstrategy.bbox
                    });
                    var vectorSourceLabel = new ol.source.Vector({
                        format: new ol.format.GeoJSON({}),
                        strategy: ol.loadingstrategy.bbox
                    });
                    myExtObject.controlMapSevice.showLabel(null, "remove");
                    var arrayCmn = data.features;
                    var promise = new Promise((resolve, reject) => {
                        for (var item = 0; item < arrayCmn.length; item++) {
                            var feature = new ol.Feature({})
                            var featureLabel = new ol.Feature({})
                            feature.setProperties(arrayCmn[item].properties)
                            feature.setGeometryName("geometry")
                            feature.setId(arrayCmn[item].id)
                            var tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
                            //applyTransform
                            var featureGeometry = new ol.geom.MultiPolygon(arrayCmn[item].geometry.coordinates);
                            featureGeometry.applyTransform(tranformFn);
                            feature.setGeometry(featureGeometry)
                                //applay style in label view
                            featureLabel = feature.clone();
                           /* featureLabel.setStyle(new ol.style.Style({
                                fill: new ol.style.Stroke({
                                    color: 'transparent'
                                }),
                                text: new ol.style.Text({
                                    text: featureLabel.get("libelle"),
                                    font: "12px  sans-serif",
                                    textAlign: "center",
                                    fill: new ol.style.Fill({
                                        color: "#000"
                                    })
                                })
                            }));

                            vectorSourceLabel.addFeature(featureLabel);*/

                            feature.setStyle(this.colorDegrade.styleFunctionCmn(feature, identiteVectorLayer));
                            vectorSource.addFeature(feature)
                        }

                        //add layer
                        var vectorLayerAdd = new ol.layer.Vector({
                            source: vectorSource,
                            title: identiteVectorLayer.indecator.libelle,
                            name: identiteVectorLayer.indecator.libelle,
                            class: "indecator"
                        });
                        identiteVectorLayer.vectorLayer = vectorLayerAdd;
                        identiteVectorLayer.vectorLayerProvence = vectorLayerAdd;
                        console.log('3', vectorSource);
                        var selecti = new ol.interaction.Select({
              key: 'selecti',
                            hitTolerance: 5,
                            condition: ol.events.condition.singleClick
                          });
                          myExtObject.map.addLayer(vectorLayerAdd);



                        //add label
                        myExtObject.labelVectorLayer = new ol.layer.Vector({ source: vectorSourceLabel, name: "Label map", class: "labelMap" });
                        //add legend
                        this.legend.addLegend(identiteVectorLayer, 'serie4' , '');
                        myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
                        resolve("do graph")
                    });

                    promise.then((string) => {
                        myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'cmnOne');
                        myExtObject.ref_Component.removeBusy();
                    })

                }
            );


            return identiteVectorLayer;
    }

        // Fonction de création de la couche des '+myExtObject.ref_Component.settings.geo.cochePrv+' (par double click)
    createLayerPrv(id, identiteVectorLayer, list) {
        var url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=region_id:' + id + '&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + '&outputFormat=application%2Fjson';
        var Src_view_prv = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: url
        });

        console.log(url);
        var prv_view = new ol.layer.Vector({
            source: Src_view_prv,
            name: identiteVectorLayer.indecator.libelle,
            class: "indecator"
        })
        if (identiteVectorLayer.colorGraphList.length > 0 || !identiteVectorLayer.colorGraphList) identiteVectorLayer.colorGraphList = [];

        let arrayValTab = identiteVectorLayer.val_tab2.filter(val =>
            !isNaN(val)
        )


        identiteVectorLayer.serie2 = new geostats(arrayValTab);

        // identiteVectorLayer.interval2 = identiteVectorLayer.serie2.getClassQuantile(identiteVectorLayer.indecator.nombreClass);

        identiteVectorLayer.interval2 = this.legend.getInterval_2(identiteVectorLayer.indecator.nombreClass, identiteVectorLayer.serie2, identiteVectorLayer.indecator.methodClassifi, arrayValTab);
        identiteVectorLayer.serie2.setColors(identiteVectorLayer.couleurs);
        identiteVectorLayer.serie2.setPrecision(2);
        myExtObject.currentIndecator = identiteVectorLayer.indecator
            //this.legend.getClassificationByValue(identiteVectorLayer, "2");
            //console.log("getClassificationByValue(identiteVectorLayer, position)")
        var promise1 = new Promise((resolve, reject) => {
            prv_view.setStyle((e) => this.colorDegrade.styleFunctionProv(e, identiteVectorLayer, resolve))
        });
        promise1.then((string) => {
            myExtObject.ref_Component.changerListValeurIndecator(identiteVectorLayer.id, list, identiteVectorLayer.colorGraphList, 'pvn');
        })

        //document.getElementById('legend').innerHTML = identiteVectorLayer.serie2.getHtmlLegend(null, identiteVectorLayer.indecator.libelle, 1);
        this.legend.addLegend(identiteVectorLayer, 'serie2');

        /*  // console.log(identiteVectorLayer.colorGraphList); */
        //
        return prv_view;
    }

    //ORDT
    createLayerOfCerPrefArr(indecator, noInteractionTablur, ranges) {
        myExtObject.currentIndecator = indecator;
        var identiteVectorLayer = IdentiteLayer.getInstance();
        identiteVectorLayer.val_tab3 = [];
        for (var i = 0; i < indecator.valeurIndicateurList.length; i++) {
            identiteVectorLayer.val_tab3.push(indecator.valeurIndicateurList[i].valeur); //push les valeur
            if (indecator.valeurIndicateurList[i].cerlePrefArr) {
                identiteVectorLayer.nom3.push(indecator.valeurIndicateurList[i].cerlePrefArr.libelle);
                identiteVectorLayer.ids3.push(indecator.valeurIndicateurList[i].cerlePrefArr.id);
            }
        }
        identiteVectorLayer.id = indecator.id;
        identiteVectorLayer.indecator = indecator;
        myExtObject.currentIndecator = identiteVectorLayer.indecator;
        if (identiteVectorLayer.colorGraphList.length > 0 || identiteVectorLayer.colorGraphList)
            identiteVectorLayer.colorGraphList = [];
        let type = indicateur.valeurIndicateurList[0].cerlePrefArr.type;
        var url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCerPrefArr + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+ ";decoupage_id:"+ indecator.decoupage.id+";type:"+ type;
        //
        myExtObject.ref_Component.addBusy();
        $.get(url,
            // success callback
            (data) => {
                if (!data.features || (data.features && data.features.length == 0)) {
                    myExtObject.ref_Component.removeBusy();
                    return
                }
                // first add features
                this.legend.getClassificationByValue(identiteVectorLayer, "3");
                var vectorSource = new ol.source.Vector({
                    format: new ol.format.GeoJSON({}),
                    strategy: ol.loadingstrategy.bbox
                });
                var vectorSourceLabel = new ol.source.Vector({
                    format: new ol.format.GeoJSON({}),
                    strategy: ol.loadingstrategy.bbox
                });
                myExtObject.controlMapSevice.showLabel(null, "remove");
                var arrayCerPrefArr = data.features;
                var promise = new Promise((resolve, reject) => {
                    for (var item = 0; item < arrayCerPrefArr.length; item++) {
                        var feature = new ol.Feature({})
                        var featureLabel = new ol.Feature({})
                        feature.setProperties(arrayCerPrefArr[item].properties)
                        feature.setGeometryName("geometry")
                        feature.setId(arrayCerPrefArr[item].id)
                        var tranformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
                        //applyTransform
                        var featureGeometry = new ol.geom.MultiPolygon(arrayCerPrefArr[item].geometry.coordinates);
                        featureGeometry.applyTransform(tranformFn);
                        feature.setGeometry(featureGeometry)
                            //applay style in label view
                        featureLabel = feature.clone();

                        feature.setStyle(this.colorDegrade.styleFunctionCerPrefArr(feature, identiteVectorLayer));
                        vectorSource.addFeature(feature)
                    }

                    //add layer
                    var vectorLayerAdd = new ol.layer.Vector({
                        source: vectorSource,
                        title: identiteVectorLayer.indecator.libelle,
                        name: identiteVectorLayer.indecator.libelle,
                        class: "indecator"
                    });
                    identiteVectorLayer.vectorLayer = vectorLayerAdd;
                    identiteVectorLayer.vectorLayerCerPrefArr = vectorLayerAdd;
                    console.log('3', vectorSource);
                    var selecti = new ol.interaction.Select({
              key: 'selecti',
                        hitTolerance: 5,
                        condition: ol.events.condition.singleClick
                      });
                      myExtObject.map.addLayer(vectorLayerAdd);



                    //add label
                    myExtObject.labelVectorLayer = new ol.layer.Vector({ source: vectorSourceLabel, name: "Label map", class: "labelMap" });
                    //add legend
                    this.legend.addLegend(identiteVectorLayer, 'serie3' , '');
                    myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
                    resolve("do graph")
                });

                promise.then((string) => {
                    myExtObject.ref_Component.changerListValeurIndecator(indecator.id, indecator.valeurIndicateurList, identiteVectorLayer.colorGraphList, 'cerlePrefArrOne');
                    myExtObject.ref_Component.removeBusy();
                })

            }
        );


        return identiteVectorLayer;
    }

    createTempLayer(indicateur) {
        let pos,
            entite,
            url;

        if (indicateur.echelle == 'Provinciale') {
            pos = '2';
            entite = 'province';
            url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+ ";decoupage_id:"+ indicateur.decoupage.id;
          }
          else if (indicateur.echelle == 'Communale') {
            pos = '4';
            entite = 'commune';
            url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':'  + myExtObject.ref_Component.settings.geo.coucheCmnToReg + '&outputFormat=application%2Fjson&viewparams=region_id:'+myExtObject.stringAllRegions+ ";decoupage_id:"+ indicateur.decoupage.id;
          }
          else if (indicateur.echelle == 'Unitale') {
            pos = '10';
            entite = 'uniteTerritorial';
            let categorie = indicateur.valeurIndicateurList[0][entite].categorie.id.toString();
            url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheUntToReg + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+";categorie_id:"+categorie;
          }
          else if(indicateur.echelle == "Cercle" || indicateur.echelle == "Préfécture d'arrondissement"){
            pos = '3';
            entite = 'cerclePrefArr';
            let type = indicateur.valeurIndicateurList[0].cerlePrefArr.type;
            url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCerPrefArr + "&outputFormat=application%2Fjson&viewparams=region_id:"+myExtObject.stringAllRegions+ ";decoupage_id:"+ indicateur.decoupage.id+";type:"+ type;
          }
          else if(indicateur.echelle == "Arrondissement" || indicateur.echelle == "Douar" || indicateur.echelle == "Centre Urbain") {
            pos = '5';
            entite = 'douarCentreUrb';
            let type = indicateur.valeurIndicateurList[0].douarCentreUrb.type;
            url = myExtObject.ref_Component.settings.geo.url+'?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':'+ myExtObject.ref_Component.settings.geo.cocheDouarCentreUrb +'&outputFormat=application%2Fjson&viewparams=region_id:'+myExtObject.stringAllRegions+ ";decoupage_id:"+ indicateur.decoupage.id+';type:'+type;
          }
          else {
            pos = ''
            entite = 'region'
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg +"&viewparams=decoupage_id:" +indicateur.decoupage.id+'&outputFormat=application/json';
          }

          var identiteVectorLayer = IdentiteLayer.getInstance();
            identiteVectorLayer['val_tab'+ pos] = [];
            identiteVectorLayer['ids'+ pos]  = [];
            identiteVectorLayer['nom'+ pos] = [];
            for (var i = 0; i < indicateur.valeurIndicateurList.length; i++) {
                identiteVectorLayer['val_tab'+ pos].push(indicateur.valeurIndicateurList[i].valeur); //push les valeur
                if (indicateur.valeurIndicateurList[i][entite]) {
                    identiteVectorLayer['nom'+ pos].push(indicateur.valeurIndicateurList[i][entite].libelle);
                    identiteVectorLayer['ids'+ pos].push(indicateur.valeurIndicateurList[i][entite].id);
                }
            }

            identiteVectorLayer.id = indicateur.id;
            identiteVectorLayer.indecator = indicateur;

            this.legend.getClassificationByValue(identiteVectorLayer, pos);

            console.log(url);

            var vectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url:url,
                strategy: ol.loadingstrategy.bbox,
                id: indicateur.id
            });
            var vectorLayerAdd = new ol.layer.Vector({
                source: vectorSource,
                title: identiteVectorLayer.indecator.libelle,
                name: identiteVectorLayer.indecator.libelle,
                class: "indicateur"
            });
            console.log(identiteVectorLayer);
            identiteVectorLayer.vectorLayer = vectorLayerAdd;

            var promise;
            if (indicateur.echelle == 'Provinciale') {
              promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionProv(e, identiteVectorLayer, resolve));
            });
            }
            else if (indicateur.echelle == 'Communale') {
              promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionCmn(e, identiteVectorLayer, resolve));
            });
            }
            else if (indicateur.echelle == 'Unitale') {
              promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionUnt(e, identiteVectorLayer, resolve));
            });
            }
            else if(indicateur.echelle == "Cercle" || indicateur.echelle == "Préfécture d'arrondissement"){
              promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionCerPrefArr(e, identiteVectorLayer, resolve));
            });
            }
            else if(indicateur.echelle == "Arrondissement" || indicateur.echelle == "Douar" || indicateur.echelle == "Centre Urbain") {
              promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionDcu(e, identiteVectorLayer, resolve));
            });
            }
            else {
              promise = new Promise((resolve, reject) => {
                vectorLayerAdd.setStyle((e) => this.colorDegrade.styleFunctionReg(e, identiteVectorLayer, resolve));
            });
            }


            //ORDT
            myExtObject.tempMap.addLayer(vectorLayerAdd);


            this.legend.addTempLegend(identiteVectorLayer, 'serie'+pos);

             // prepare data for filter
             vectorSource.on('change', function(evt) {
              var source=evt.target;
              if(source.getState() === 'ready'){
                  vectorSource.getFeatures().forEach(feature => {
                      //console.log(feature);
                      var valeur = indicateur.valeurIndicateurList.filter(function (valeurIndicateur) {
                          return valeurIndicateur[entite].id == feature.values_["id_"+entite];
                      })
                      .map (valeurIndicateur => valeurIndicateur.valeur);
                      var values = new Object();
                      values["id_"+entite] = feature.values_["id_"+entite];
                      values["libelle"] = feature.values_.libelle;
                      values['surface'] = feature.values_.surface;
                      values['geometry'] = feature.values_.geometry;
                      values['valeur'] = valeur;
                      feature.values_ = values;
                  })
              }
          })

            var highlightStyle = new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0.7)',
              }),
              stroke: new ol.style.Stroke({
                color: '#3399CC',
                width: 3,
              }),
            });


            var selected = null;
            var getCenterOfExtent = (Extent) => {
              var X = Extent[0] + (Extent[2] - Extent[0]) / 2;
              var Y = Extent[1] + (Extent[3] - Extent[1]) / 2;
              return [X, Y];
           }
            myExtObject.tempMap.on('pointermove', function (e) {
              myExtObject.addtempOverlayInMap();
              var element = myExtObject.tempOverlay.getElement();
              var container = document.getElementById('temp-overlay-container');
              if (selected !== null) {
                selected.setStyle(undefined);
                selected = null;
              }

              myExtObject.tempMap.forEachFeatureAtPixel(e.pixel, function (f) {
                selected = f;
                f.setStyle(highlightStyle);
                return true;
              });

              if (selected) {
                console.log(selected)
        // the keys are quoted to prevent renaming in ADVANCED mode.
                 container.innerHTML = ('<p>'+selected.values_.valeur+'</p>');
                $('#temp-overlay').show();
                $('#temp-overlay').parent().css({
                  zIndex: 1,
                  display: 'block'
                })
                $('#temp-overlay').css({'display': 'block'});
                console.log(selected.values_.geometry.getExtent());
                console.log(selected.getGeometry());
                myExtObject.tempOverlay.setPosition(getCenterOfExtent(selected.values_.geometry.getExtent()));
              } else {
                $('#temp-overlay').hide();
                $('#temp-overlay').css({'display': 'none'});
              }
            });
            return identiteVectorLayer;
    }

    // Fonction de création de la couche communes (par double click)
    create_cmn(id, identiteVectorLayer, list) {
        //console.log("create_cmn")
        var url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=province_id:' + id + '&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCmnToPrv + '&outputFormat=application%2Fjson';
        var Src_view_cmn = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: url
        });

        var cmn_view = new ol.layer.Vector({
                source: Src_view_cmn,
                name: identiteVectorLayer.indecator.libelle,
                class: "indecator"
            })
            //// console.log("Src_view_cmn :", Src_view_cmn)
        if (identiteVectorLayer.colorGraphList.length > 0 || !identiteVectorLayer.colorGraphList) identiteVectorLayer.colorGraphList = [];

        let arrayValTab = identiteVectorLayer.val_tab4.filter(val =>
            !isNaN(val)
        )
        identiteVectorLayer.serie4 = new geostats(arrayValTab);
        // identiteVectorLayer.interval4 = identiteVectorLayer.serie4.getClassQuantile(identiteVectorLayer.indecator.nombreClass);
        identiteVectorLayer.interval4 = this.legend.getInterval_2(identiteVectorLayer.indecator.nombreClass, identiteVectorLayer.serie4, identiteVectorLayer.indecator.methodClassifi, arrayValTab);

        identiteVectorLayer.serie4.setColors(identiteVectorLayer.couleurs);
        identiteVectorLayer.serie4.setPrecision(2);
        var promiseCmn = new Promise((resolve, reject) => {
            cmn_view.setStyle((e) => this.colorDegrade.styleFunctionCmn(e, identiteVectorLayer, resolve));
        });
        promiseCmn.then((string) => {
            //console.log(list, identiteVectorLayer.colorGraphList)
            myExtObject.ref_Component.changerListValeurIndecator(identiteVectorLayer.id, list, identiteVectorLayer.colorGraphList, 'cmn');
        })

        this.legend.addLegend(identiteVectorLayer, 'serie4');
        //document.getElementById('legend').innerHTML = this.serie4.getHtmlLegend(null, "Taux de pauvret� 2014", 1);
        /***
         * Remove Names
         */
        // //myExtObject.controlMapSevice.showLabel(url);
        /***
         * Remove Names End
         */
        return cmn_view;
    }

    updateDegradeColor(identiteVectorLayerUpdate) {
        var val_tab = [];
        var nom = [];
        var ids = [];
        for (var i = 0; i < identiteVectorLayerUpdate.indecator.valeurIndicateurList.length; i++) {
            val_tab.push(identiteVectorLayerUpdate.indecator.valeurIndicateurList[i].valeur); //push les valeur
            if (identiteVectorLayerUpdate.indecator.valeurIndicateurList[i].region) {
                nom.push(identiteVectorLayerUpdate.indecator.valeurIndicateurList[i].region.libelle);
                ids.push(identiteVectorLayerUpdate.indecator.valeurIndicateurList[i].region.id);
            }
        }

        identiteVectorLayerUpdate.val_tab = val_tab
        identiteVectorLayerUpdate.nom = nom
        identiteVectorLayerUpdate.ids = ids

        myExtObject.currentIndecator = identiteVectorLayerUpdate.indecator;
        this.legend.getClassificationByValue(identiteVectorLayerUpdate);
        identiteVectorLayerUpdate.colorGraphList = [];

        var promise = new Promise((resolve, reject) => {
            identiteVectorLayerUpdate.vectorLayer.setStyle((e) => this.colorDegrade.styleFunctionReg(e, identiteVectorLayerUpdate, resolve));
        });

        promise.then((string) => {
            myExtObject.ref_Component.changerListValeurIndecator(identiteVectorLayerUpdate.id, identiteVectorLayerUpdate.valeurIndicateurList, identiteVectorLayerUpdate.colorGraphList, 'reg');
        })
        identiteVectorLayerUpdate.serie.setColors(identiteVectorLayerUpdate.couleurs);
        identiteVectorLayerUpdate.serie.setPrecision(2);

        //on doit afficher dynamicment
        this.legend.removeLegend(identiteVectorLayerUpdate);
        this.legend.addLegend(identiteVectorLayerUpdate);
    }

}

var UniqueIndecatorDegradeSeviceSingloton = (function() {

    var instance;

    function createInstance() {
        var object = new UniqueIndecatorDegradeSevice();
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
