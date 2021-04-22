class SymbolMode {

    constructor() {
            this.cercleCalculate = CalculCercleSingleton.getInstance();
            this.symbolFactory = SymbolFactorySingleton.getInstance();
            this.legend = LegendSingleton.getInstance();
        }
        //cercle empty
    emptySymbol(feature, IdentiteVectorLayer, echelle) {
        var geom, center, valeur, position;
        // niv = (niv) ? niv : 'region';
        // if (niv == 'province') {
        //     position = "2"
        // } else {
        //     position = "4"
        // }
        if ( IdentiteVectorLayer.indecator.echelle == "Provinciale"){
          position = '2';
          echelle = "province";
        }

        else if ( IdentiteVectorLayer.indecator.echelle == "Communale") {
            position = '4';
            echelle = "commune";
        }

        else if ( IdentiteVectorLayer.indecator.echelle == "Cercle" || IdentiteVectorLayer.indecator.echelle == "Préfécture d'arrondissement") {
            position = '3';
            echelle = "cerclePrefArr";
        }
        else if ( IdentiteVectorLayer.indecator.echelle == "Unitale") {
            position = '10';
            echelle = "uniteTerritorial";
        }
        else if ( IdentiteVectorLayer.indecator.echelle == "Arrondissement" || IdentiteVectorLayer.indecator.echelle == "Douar" || IdentiteVectorLayer.indecator.echelle == "Centre Urbain") {
            position = '5';
            echelle = "douarCentreUrb";
        }
        else {
            position = '';
            echelle = "region";
        }

        for (var i = 0; i < IdentiteVectorLayer.val_tab_global.length; i++) {
            if (feature.getProperties().id == IdentiteVectorLayer.val_tab_global[i][echelle].id) {

                var extent = feature.getGeometry().getExtent();
                center = ol.extent.getCenter(extent);
                geom = new ol.geom.Point(center);
                valeur = IdentiteVectorLayer.val_tab_global[i].valeur;
                break;
            }
        }
        console.log(position, echelle);
        var retStyle = new ol.style.Style({
            geometry: geom,

            image: this.symbolFactory.createSymbol({
                type: IdentiteVectorLayer.symbolMode,
                bgColor: '',
                contorColor: IdentiteVectorLayer.colorBase,
                //raduis: this.cercleCalculate.radiusCalculation2(valeur, IdentiteVectorLayer.val_tab_global),
                raduis: this.cercleCalculate.radiusCalculationPerClass(valeur, this.legend.getClassificationByValue(IdentiteVectorLayer, position)),
                rotation: 0
            }).getForm()
        });
        return retStyle;
    }
    fieldOneColorSymbol(feature, IdentiteVectorLayer, echelle) {
            var geom, center, valeur, position;
            // niv = (niv) ? niv : 'region';
            // if (niv == 'province') {
            //     position = "2"
            // } else {
            //     position = ""
            // }
           if ( IdentiteVectorLayer.indecator.echelle == "Provinciale"){
              position = '2';
              echelle = "province";
            }

            else if ( IdentiteVectorLayer.indecator.echelle == "Communale") {
                position = '4';
                echelle = "commune";
            }

            else if ( IdentiteVectorLayer.indecator.echelle == "Cercle" || IdentiteVectorLayer.indecator.echelle == "Préfécture d'arrondissement") {
                position = '3';
                echelle = "cerclePrefArr";
            }
            else if ( IdentiteVectorLayer.indecator.echelle == "Unitale") {
                position = '10';
                echelle = "uniteTerritorial";
            }
            else if ( IdentiteVectorLayer.indecator.echelle == "Arrondissement" || IdentiteVectorLayer.indecator.echelle == "Douar" || IdentiteVectorLayer.indecator.echelle == "Centre Urbain") {
                position = '5';
                echelle = "douarCentreUrb";
            }
            else {
                position = '';
                echelle = "region";
            }


            for (var i = 0; i < IdentiteVectorLayer.val_tab_global.length; i++) {
                if (feature.getProperties().id == IdentiteVectorLayer.val_tab_global[i][echelle].id) {
                    var extent = feature.getGeometry().getExtent();
                    center = ol.extent.getCenter(extent);
                    geom = new ol.geom.Point(center);
                    valeur = IdentiteVectorLayer.val_tab_global[i].valeur;
                    break;
                }
            }
            // console.log("val tab global: ", IdentiteVectorLayer.val_tab_global, niv, center)
            var retStyle;
            if (isNaN(valeur)) {
                retStyle = new ol.style.Style({
                    geometry: geom
                });

            } else {
                retStyle = new ol.style.Style({
                    geometry: geom,
                    image: this.symbolFactory.createSymbol({
                        type: IdentiteVectorLayer.symbolMode,
                        bgColor: IdentiteVectorLayer.colorBase,
                        contorColor: '#000',
                        width: 1,
                        //raduis: this.cercleCalculate.radiusCalculation2(valeur, IdentiteVectorLayer.val_tab_global),
                        raduis: this.cercleCalculate.radiusCalculationPerClass(valeur, this.legend.getClassificationByValue(IdentiteVectorLayer, position)),
                        rotation: 0
                    }).getForm()
                });
            }
            return retStyle;
        }
        //symbol remple
    fieldSymbol(feature, IdentiteVectorLayer, compose, resolve, niv) {
            var geom, center, valeur, color, position;
            var layerColorDegrade = (compose) ? IdentiteVectorLayer.composentIdentiteLayerList[0] : IdentiteVectorLayer;
            var colorGraph, isEndCollection;
            // for (var i = 0; i < IdentiteVectorLayer.val_tab_global.length; i++) {

            //     if (feature.getProperties().id == IdentiteVectorLayer.val_tab_global[i].region.id) {

            //         var extent = feature.getGeometry().getExtent();
            //         center = ol.extent.getCenter(extent);
            //         geom = new ol.geom.Point(center);
            //         valeur = (IdentiteVectorLayer.val_tab_global[i] && IdentiteVectorLayer.val_tab_global[i].valeur) ? IdentiteVectorLayer.val_tab_global[i].valeur : null;
            //         colorGraph = { idReg: IdentiteVectorLayer.val_tab_global[i].region.id, color: "" }
            //         isEndCollection = feature.getProperties().end;
            //         console.log("--- region ", layerColorDegrade.val_tab_global[i])
            //         break;
            //     }
            // }
            if ( IdentiteVectorLayer.indecator.echelle == "Provinciale"){
              position = '2';
              niv = "province";
            }

            else if ( IdentiteVectorLayer.indecator.echelle == "Communale") {
                position = '4';
                niv = "commune";
            }

            else if ( IdentiteVectorLayer.indecator.echelle == "Cercle" || IdentiteVectorLayer.indecator.echelle == "Préfécture d'arrondissement") {
                position = '3';
                niv = "cerclePrefArr";
            }
            else if ( IdentiteVectorLayer.indecator.echelle == "Unitale") {
                position = '10';
                niv = "uniteTerritorial";
            }
            else if ( IdentiteVectorLayer.indecator.echelle == "Arrondissement" || IdentiteVectorLayer.indecator.echelle == "Douar" || IdentiteVectorLayer.indecator.echelle == "Centre Urbain") {
                position = '5';
                niv = "douarCentreUrb";
            }
            else {
                position = '';
                niv = "region";
            }

            console.log("test : ", layerColorDegrade.val_tab_global)
            var itemSeleted, i, k, value2;
            if (layerColorDegrade.val_tab_global && layerColorDegrade.val_tab_global.length > 0) {
                switch (niv) {
                    case 'region':
                        i = layerColorDegrade.val_tab_global.map(a => a.region.id).indexOf(feature.getProperties().id);
                        k = IdentiteVectorLayer.val_tab_global.map(a => a.region.id).indexOf(feature.getProperties().id);
                        itemSeleted = (i != -1) ? layerColorDegrade.val_tab_global[i].region : null;
                        colorGraph = (itemSeleted) ? { idReg: itemSeleted.id, color: "" } : null;
                        break;
                    case 'province':
                        i = layerColorDegrade.val_tab_global.map(a => a.province.id).indexOf(feature.getProperties().id);
                        k = IdentiteVectorLayer.val_tab_global.map(a => a.province.id).indexOf(feature.getProperties().id);
                        itemSeleted = (i != -1) ? layerColorDegrade.val_tab_global[i].province : null;
                        colorGraph = (itemSeleted) ? { idPvn: itemSeleted.id, color: "" } : null;
                        break;
                    case 'commune':
                        i = layerColorDegrade.val_tab_global.map(a => a.commune.id).indexOf(feature.getProperties().id);
                        k = IdentiteVectorLayer.val_tab_global.map(a => a.commune.id).indexOf(feature.getProperties().id);
                        itemSeleted = (i != -1) ? layerColorDegrade.val_tab_global[i].commune : null;
                        colorGraph = (itemSeleted) ? { idCmn: itemSeleted.id, color: "" } : null;
                        break;
                    case 'uniteTerritorial':
                        i = layerColorDegrade.val_tab_global.map(a => a.uniteTerritorial.id).indexOf(feature.getProperties().id);
                        k = IdentiteVectorLayer.val_tab_global.map(a => a.uniteTerritorial.id).indexOf(feature.getProperties().id);
                        itemSeleted = (i != -1) ? layerColorDegrade.val_tab_global[i].uniteTerritorial : null;
                        colorGraph = (itemSeleted) ? { idUnt: itemSeleted.id, color: "" } : null;
                        break;
                    case 'cerclePrefArr':
                        i = layerColorDegrade.val_tab_global.map(a => a.cerclePrefArr.id).indexOf(feature.getProperties().id);
                        k = IdentiteVectorLayer.val_tab_global.map(a => a.cerclePrefArr.id).indexOf(feature.getProperties().id);
                        itemSeleted = (i != -1) ? layerColorDegrade.val_tab_global[i].cerclePrefArr : null;
                        colorGraph = (itemSeleted) ? { idCpa: itemSeleted.id, color: "" } : null;
                        break;
                    case 'douarCentreUrb':
                        i = layerColorDegrade.val_tab_global.map(a => a.douarCentreUrb.id).indexOf(feature.getProperties().id);
                        k = IdentiteVectorLayer.val_tab_global.map(a => a.douarCentreUrb.id).indexOf(feature.getProperties().id);
                        itemSeleted = (i != -1) ? layerColorDegrade.val_tab_global[i].douarCentreUrb : null;
                        colorGraph = (itemSeleted) ? { idDcu: itemSeleted.id, color: "" } : null;
                        break;
                    default:
                        i = layerColorDegrade.val_tab_global.map(a => a.region.id).indexOf(feature.getProperties().id);
                        k = IdentiteVectorLayer.val_tab_global.map(a => a.region.id).indexOf(feature.getProperties().id);
                        itemSeleted = (i != -1) ? layerColorDegrade.val_tab_global[i].region : null;
                        colorGraph = (itemSeleted) ? { idReg: itemSeleted.id, color: "" } : null;
                        break;
                }
            }

            if (itemSeleted && i != -1 && k != -1) {
                var extent = feature.getGeometry().getExtent();
                center = ol.extent.getCenter(extent);
                geom = new ol.geom.Point(center);
                valeur = (layerColorDegrade.val_tab_global[i] && layerColorDegrade.val_tab_global[i].valeur) ? layerColorDegrade.val_tab_global[i].valeur : null;
                // colorGraph = { idReg: itemSeleted.id, color: "" }
                isEndCollection = feature.getProperties().end;
                value2 = IdentiteVectorLayer.val_tab_global[k].valeur
            }

            var j = 0;
            if (isEndCollection) {
                resolve(layerColorDegrade.colorGraphList);
            }
            var retStyle;
            if (valeur == null || isNaN(valeur)) {

                retStyle = new ol.style.Style({
                    geometry: geom
                });

            } else {
                while (j <= layerColorDegrade.indecator.nombreClass) {
                    if (valeur && layerColorDegrade.interval[j] <= valeur && layerColorDegrade.interval[j + 1] >= valeur)
                    //Affectation des this.couleurs selon les valeurs de l'indicateur
                    {
                        color = layerColorDegrade.couleurs[j];
                        colorGraph.color = layerColorDegrade.couleurs[j];
                        layerColorDegrade.colorGraphList.push(colorGraph);
                        break;
                    }

                    j = j + 1;
                }
                retStyle = new ol.style.Style({
                    geometry: geom,
                    image: this.symbolFactory.createSymbol({
                        type: IdentiteVectorLayer.symbolMode,
                        bgColor: color,
                        width: 1,
                        contorColor: '#000',
                        //raduis: this.cercleCalculate.radiusCalculation2(valeur, IdentiteVectorLayer.val_tab_global),
                        raduis: this.cercleCalculate.radiusCalculationPerClass(value2, this.legend.getClassificationByValue(IdentiteVectorLayer)),
                        rotation: 0
                    }).getForm()
                });
            }
            return retStyle;
        }
        //cercle rempler
    CirclestyleFunction(feature, IdentiteVectorLayer) {
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
    }


    doSymbolVector(IdentiteVectorLayer, vectorSource, croise, niv, resolve) {
        niv = (niv) ? niv : 'region';

        var currentIndecator = (croise) ? IdentiteVectorLayer.indecator : myExtObject.currentIndecator;
        IdentiteVectorLayer.val_tab_global = currentIndecator.valeurIndicateurList;
        console.log("IdentiteVectorLayer.val_tab_global : ", IdentiteVectorLayer.val_tab_global)
        var indecator = currentIndecator;
        var urlvector = "",
            position = '',
            echelle = '',
            entite = '',
            type,
            url = "";
        indecator.decoupage = (indecator.decoupage) ? indecator.decoupage : indecator.decopage;
        // var geo = function(echelle, decopageId) {
        //     var echellFromSetting = ""
        //     switch (echelle) {
        //         case 'Régionale':
        //             echellFromSetting = (decopageId == 1) ? myExtObject.ref_Component.settings.geo.cocheReg_2009 : myExtObject.ref_Component.settings.geo.cocheReg;
        //             break;
        //         case 'Provinciale':
        //             echellFromSetting = myExtObject.ref_Component.settings.geo.cochePrvToReg;
        //             break;
        //         case 'Communale':
        //             echellFromSetting = myExtObject.ref_Component.settings.geo.cocheCmnToPrv;
        //             break;
        //         default:
        //             echellFromSetting = myExtObject.ref_Component.settings.geo.cocheReg;
        //             break;
        //     }
        //     return echellFromSetting;
        // }

        if ( indecator.echelle == "Provinciale") {
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + indecator.decoupage.id;
            position = '2';
            echelle = "province";
            entite = echelle;
        }
        else if ( indecator.echelle == "Communale") {
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheCmnToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + indecator.decoupage.id;
            position = '4';
            echelle = "commune";
            entite = echelle;
        }
        else if ( indecator.echelle == "Cercle" || indecator.echelle == "Préfécture d'arrondissement") {
            type = indecator.valeurIndicateurList[0].cerclePrefArr.type
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCerPrefArr + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";type:" + type;
            position = '3';
            echelle = "cerclePrefArr";
            entite = 'cercle_pref_arr';
        }
        else if ( indecator.echelle == "Unitale") {
            let categorie = indecator.valeurIndicateurList[0].uniteTerritorial.categorie.id.toString();
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheUntToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";categorie_id:"+ categorie;
            position = '10';
            echelle = "uniteTerritorial";
            entite = 'unite_territorial';
        }
        else if ( indecator.echelle == "Arrondissement" || indecator.echelle == "Douar" || indecator.echelle == "Centre Urbain") {
            type = indecator.valeurIndicateurList[0].douarCentreUrb.type
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheDouarCentreUrb + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";type:" + type;
            position = '5';
            echelle = "douarCentreUrb";
            entite = 'douar_centreurbain';
        }
        else {
            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg +"&viewparams=decoupage_id:" +indecator.decoupage.id+'&outputFormat=application/json';
            position = '';
            echelle = "region";
            entite = echelle;
        }
        console.log(echelle);
        // urlvector = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
        //     '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + geo(indecator.echelle, 0) + '&outputFormat=application/json&viewparams=region_id:'+myExtObject.inRegions + "decoupage_id";

        console.log(url);
        vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: () => {
                return url;
            },
            strategy: ol.loadingstrategy.bbox
        });

        IdentiteVectorLayer.vectorLayer = new ol.layer.Vector({
            updateWhileInteracting: false,
            source: vectorSource
        });

        myExtObject.map.addLayer(IdentiteVectorLayer.vectorLayer);

        var vectorSource2 = new ol.source.Vector({});

        var doneDrow;
        vectorSource.on('change', (e) => {
            /*      console.log("IdentiteVectorLayer features in doSymboleVetor   :::::", e.getFeatures()); */
            if (vectorSource.getState() == 'ready' && !doneDrow) {
                var feature = vectorSource.getFeatures();
                /* console.log("IdentiteVectorLayer features in doSymboleVetor   :::::", feature, IdentiteVectorLayer.val_tab_global);*/
                console.log("--------- ** test :", IdentiteVectorLayer.val_tab_global, vectorSource.getFeatures(), currentIndecator, url)

                for (var i = 0; i < feature.length; i++) {
                    var m = 0; //
                    var code_feat =  feature[i].get("id_" + entite); //

                    while (m < IdentiteVectorLayer.val_tab_global.length) { //

                        if (code_feat == IdentiteVectorLayer.val_tab_global[m][echelle].id) { //
                            var extent = feature[i].getGeometry().getExtent();
                            var center = ol.extent.getCenter(extent);
                            vectorSource2.addFeature(new ol.Feature({
                                id: feature[i].get("id_" + entite),
                                end: ((feature.length - 1) == i),
                                val_indic2: IdentiteVectorLayer.val_tab_global[m].valeur,
                                geometry: new ol.geom.Point(center),
                                style: new ol.style.Style({
                                    fill: new ol.style.Stroke({
                                        color: 'transparent'
                                    })
                                })
                            }));
                            break;
                        } else m = m + 1;
                    }
                }
                console.log("--------- ** test :", vectorSource2.getFeatures())
                if(resolve != null)
                    resolve("yes")
                doneDrow = true;
            }
        })

        IdentiteVectorLayer.vectorLayer = new ol.layer.Vector({
            source: vectorSource2,
            name: IdentiteVectorLayer.indecator.libelle,
            layerPrent: IdentiteVectorLayer.vectorLayer
        });

    }
    generateStyleSymbol(IdentiteVectorLayer, niv) {
        console.log(IdentiteVectorLayer.vectorLayer);
        IdentiteVectorLayer.vectorLayer.setStyle((e) => this.emptySymbol(e, IdentiteVectorLayer, niv));
        console.log(IdentiteVectorLayer.vectorLayer);
    }
    generateStyleSymbolSrok(IdentiteVectorLayer, composet, resolve, niv) {

        IdentiteVectorLayer.vectorLayer.setStyle((e) => {
            console.log(e);
            return this.fieldSymbol(e, IdentiteVectorLayer, composet, resolve, niv)
        });
    }
    generateStyleSymbolSrokOneColor(IdentiteVectorLayer, niv) {
        console.log(IdentiteVectorLayer.vectorLayer);
        IdentiteVectorLayer.vectorLayer.setStyle((e) => this.fieldOneColorSymbol(e, IdentiteVectorLayer,niv));
        console.log(IdentiteVectorLayer.vectorLayer);
    }
}

var SymbolModeSingleton = (function() {
    var instance;

    function createInstance() {
        var object = new SymbolMode();
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
