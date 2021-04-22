 class ColorDegradeMode {

    constructor() {
         this.cercleCalculate = CalculCercleSingleton.getInstance();
         this.symbolFactory = SymbolFactorySingleton.getInstance();
    }

    isMax(serie, value) {
         var bounds = serie.bounds
         var color = "";
         if (bounds[bounds.length - 1] < value) color = "#9d9d9d";
         return color;
    }

    isMin(serie, value) {
         var bounds = serie.bounds
         var color = "";
         if (bounds[0] > value) color = "#fff";
         return color;
    }

    styleFunctionReg(feature, identiteVectorLayer, resolve) {
         var color = "";
         // var nomReg;
         if (identiteVectorLayer.ids && identiteVectorLayer.ids.length > 0) {
             var regionIndex = identiteVectorLayer.ids.indexOf(feature.get("id_region"));
             var k = regionIndex;
             if (k > -1) {
                 var j = 0;

                 // console.log(" identiteVectorLayer.ids[k], ",  identiteVectorLayer.val_tab[k] )
                 if (isNaN(identiteVectorLayer.val_tab[k])) {

                     //console.log(".............", identiteVectorLayer)
                     /* identiteVectorLayer.colorGraphList.push({ idReg: identiteVectorLayer.ids[k], color: "#9d9d9d" }); */
                 } else {
                     while (j <= identiteVectorLayer.indecator.nombreClass) {
                         if (identiteVectorLayer.interval[j] <= identiteVectorLayer.val_tab[k] && identiteVectorLayer.interval[j + 1] >= identiteVectorLayer.val_tab[k])
                         //Affectation des couleurs selon les valeurs de l'indicateur
                         {
                             //console.log(identiteVectorLayer.ids[k]," couleurs[j] ",  identiteVectorLayer.couleurs[j] )
                             color = identiteVectorLayer.couleurs[j];
                             identiteVectorLayer.colorGraphList.push({ idReg: identiteVectorLayer.ids[k], color: color });
                             //   nomReg = feature.get("libelle");
                             break;
                         }
                         j = j + 1;
                     }


                 }
                 //anas
                 //identiteVectorLayer.interval[0] > identiteVectorLayer.val_tab[k]  =   color = identiteVectorLayer.couleurs[0];
                 // identiteVectorLayer.val_tab[k] > (identiteVectorLayer.interval[identiteVectorLayer.interval.length - 1] =   color = identiteVectorLayer.couleurs[identiteVectorLayer.interval.length - 1];
                 //si null  "#fff"
                 if (color == "") { //#9d9d9d
                    //  color = (isNaN(identiteVectorLayer.val_tab[k])) ? "#fff" : (identiteVectorLayer.interval[0] > identiteVectorLayer.val_tab[k]) ? color = identiteVectorLayer.couleurs[0] : (identiteVectorLayer.interval[identiteVectorLayer.interval.length - 1] < identiteVectorLayer.val_tab[k]) ? color = identiteVectorLayer.couleurs[identiteVectorLayer.interval.length - 1] : color = identiteVectorLayer.couleurs[identiteVectorLayer.interval.length - 1];
                     if (isNaN(identiteVectorLayer.val_tab[k])) {
                      color = "#fff";
                     }else if (identiteVectorLayer.interval[0] > identiteVectorLayer.val_tab[k]) {
                      color = identiteVectorLayer.couleurs[0] ;
                     }else if (identiteVectorLayer.interval[identiteVectorLayer.interval.length - 1] < identiteVectorLayer.val_tab[k]) {
                      color = identiteVectorLayer.couleurs[3] ;
                     }
                     identiteVectorLayer.colorGraphList.push({ idReg: identiteVectorLayer.ids[k], color: color });
                 }
                 if (feature.get("id_region") == identiteVectorLayer.ids[identiteVectorLayer.ids.length - 1]) {
                     resolve(identiteVectorLayer.id)
                 }
             } else {
                 color = "#fff";
                 if ( myExtObject.donneIsExist == false ) {
                  // console.log("unique console",myExtObject.legendColor);
                //  console.log("unique console",);
                 if ($('#donne').length) {
                  //  console.log("exist")
                 }else{
                  var before = '<div id="donne"><div class="geostats-legend-block" style="background-color:#fff"></div>  ' +
                  ' données indisponible <span class="geostats-legend-counter"></span></div>';
                 $($($($('#'+myExtObject.legendColor).find('.geostats-legend')).get(0)).children().last()).after($(before))
                 }

                 }
             }

         }
         /*    var select = new ol.interaction.Select();
            var features = select.getFeatures();
            myExtObject.map.addInteraction(select);
            features.push(feature); */
         /* for (var i = 0; i < identiteVectorLayer.val_tab.length; i++) {
             var k = i;
             if (feature.get("id_region") == identiteVectorLayer.ids[k]) {
                 var j = 0;
                 if (feature.get("id_region") == identiteVectorLayer.ids[identiteVectorLayer.ids.length - 1]) {
                     resolve(identiteVectorLayer.id)
                 }
                 while (j <= identiteVectorLayer.indecator.nombreClass) {
                     if (identiteVectorLayer.interval[j] <= identiteVectorLayer.val_tab[k] && identiteVectorLayer.interval[j + 1] >= identiteVectorLayer.val_tab[k])
                     //Affectation des couleurs selon les valeurs de l'indicateur
                     {
                         color = identiteVectorLayer.couleurs[j];
                         identiteVectorLayer.colorGraphList.push({ idReg: identiteVectorLayer.ids[k], color: color });
                         nomReg = feature.get("libelle");
                         break;
                     }

                     j = j + 1;
                 }
                 break;
             } else k = k + 1;
         } */
         var retStyle = new ol.style.Style({
             fill: new ol.style.Fill({
                 color: color
             }),
             stroke: new ol.style.Stroke({
                     color: '#000',
                     width: 1
              }),
              text: new ol.style.Text({
                  text: feature.get('libelle'),
                  font: "14px  sans-serif",
                  textAlign: "center",
                  fill: new ol.style.Fill({
                      color: "#000"
                  })
              })
         });


         return retStyle;

    }

    getLengend(legend){
       return legend
    }

    styleFunctionProv(feature, identiteVectorLayer, resolve) {
         //	 function styleFunction_prov(feature) {
         //console.log("this.ids2 : ", identiteVectorLayer.ids2)
         var color = "";
         var nomprov;
         if (identiteVectorLayer.ids2 && identiteVectorLayer.ids2.length > 0) {
             var index = identiteVectorLayer.ids2.indexOf(feature.get("id_province"));
             var k = index;
             // console.log(index, feature.get("id_province"))
             if (k > -1) {
                 var j = 0;
                 // console.log(index, identiteVectorLayer.ids2)
                 //console.log(" identiteVectorLayer.ids[k], ",  identiteVectorLayer.val_tab[k] )

                 while (j <= identiteVectorLayer.indecator.nombreClass) {
                     if (identiteVectorLayer.interval2[j] <= identiteVectorLayer.val_tab2[k] && identiteVectorLayer.interval2[j + 1] >= identiteVectorLayer.val_tab2[k])
                     //Affectation des couleurs selon les valeurs de l'indicateur
                     {
                         color = identiteVectorLayer.couleurs[j];
                         identiteVectorLayer.colorGraphList.push({ idPvn: identiteVectorLayer.ids2[k], color: color });
                         //   nomReg = feature.get("libelle");
                         break;
                     }

                     j = j + 1;
                 }

                 if (color == "") { //#9d9d9d
                     //  color = (identiteVectorLayer.interval2[0] > identiteVectorLayer.val_tab2[k] || isNaN(identiteVectorLayer.val_tab2[k])) ? "#fff" :
                     //      ((identiteVectorLayer.interval2[identiteVectorLayer.interval2.length - 1] < identiteVectorLayer.val_tab2[k]) ?
                     //          "#9d9d9d" : "#9d9d9d");
                    //  color = (isNaN(identiteVectorLayer.val_tab2[k])) ? "#fff" : (identiteVectorLayer.interval2[0] > identiteVectorLayer.val_tab2[k]) ? "#E0E0E0" : (identiteVectorLayer.interval2[identiteVectorLayer.interval2.length - 1] < identiteVectorLayer.val_tab2[k]) ? "#9d9d9d" : "#9d9d9d";
                     if (isNaN(identiteVectorLayer.val_tab2[k])) {
                      color = "#fff";
                     }else if (identiteVectorLayer.interval2[0] > identiteVectorLayer.val_tab2[k]) {
                      color = identiteVectorLayer.couleurs[0] ;
                     }else if (identiteVectorLayer.interval2[identiteVectorLayer.interval2.length - 1] < identiteVectorLayer.val_tab2[k]) {
                       color = identiteVectorLayer.couleurs[3] ;
                     }
                     identiteVectorLayer.colorGraphList.push({ idPvn: identiteVectorLayer.ids2[k], color: color });
                 }
                 if (feature.get("id_province") == identiteVectorLayer.ids2[identiteVectorLayer.ids2.length - 1]) {
                     resolve(identiteVectorLayer.id)
                 }
             } else {
                 color = "#fff";
             }
         }
         /* for (var i = 0; i < identiteVectorLayer.val_tab2.length; i++) {
             var k = i;

             if (feature.get("id_province") == identiteVectorLayer.ids2[k]) {
                 var j = 0;
                 if (feature.get("id_province") == identiteVectorLayer.ids2[identiteVectorLayer.ids2.length - 1]) {
                     resolve(identiteVectorLayer.id)
                 }
                 while (j <= identiteVectorLayer.indecator.nombreClass) {
                     //// console.log("in ", identiteVectorLayer)
                     if (identiteVectorLayer.interval2[j] <= identiteVectorLayer.val_tab2[k] && identiteVectorLayer.interval2[j + 1] >= identiteVectorLayer.val_tab2[k])
                     //Affectation des this.couleurs selon les valeurs de l'indicateur
                     {
                         color = identiteVectorLayer.couleurs[j];
                         identiteVectorLayer.colorGraphList.push({ idPvn: identiteVectorLayer.ids2[k], color: color });

                         nomprov = feature.get("libelle");
                         break;
                     }

                     j = j + 1;
                 }
             } else k = k + 1;
         } */
         //// console.log("in color style: ", identiteVectorLayer.colorGraphList)
         // console.log(feature)
         var retStyle = new ol.style.Style({
             fill: new ol.style.Fill({
                 color: color
             }),
             stroke: new ol.style.Stroke({
                     color: '#000',
                     width: 1
                 }),
                 text: new ol.style.Text({
                   text: feature.get('libelle'),
                   font: "14px  sans-serif",
                   textAlign: "center",
                   fill: new ol.style.Fill({
                       color: "#000"
                   })
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

    }

    styleFunctionUnt(feature, identiteVectorLayer, resolve) {
        //	 function styleFunction_prov(feature) {
        //console.log("this.ids2 : ", identiteVectorLayer.ids2)
        var color = "";
        var nomprov;
        if (identiteVectorLayer.ids10 && identiteVectorLayer.ids10.length > 0) {
            var index = identiteVectorLayer.ids10.indexOf(feature.get("id_unite_territorial"));
            var k = index;
            // console.log(index, feature.get("id_province"))
            if (k > -1) {
                var j = 0;
                // console.log(index, identiteVectorLayer.ids10)
                //console.log(" identiteVectorLayer.ids[k], ",  identiteVectorLayer.val_tab[k] )

                while (j <= identiteVectorLayer.indecator.nombreClass) {
                    console.log(identiteVectorLayer.val_tab10[k]);
                    if (identiteVectorLayer.interval10[j] <= identiteVectorLayer.val_tab10[k] && identiteVectorLayer.interval10[j + 1] >= identiteVectorLayer.val_tab10[k])
                    //Affectation des couleurs selon les valeurs de l'indicateur
                    {
                        console.log(identiteVectorLayer.val_tab10[k]);
                        color = identiteVectorLayer.couleurs[j];
                        identiteVectorLayer.colorGraphList.push({ idUnt: identiteVectorLayer.ids10[k], color: color });
                        //   nomReg = feature.get("libelle");
                        break;
                    }

                    j = j + 1;
                }
                console.log(identiteVectorLayer);
                if (color == "") { //#9d9d9d
                    //  color = (identiteVectorLayer.interval10[0] > identiteVectorLayer.val_tab10[k] || isNaN(identiteVectorLayer.val_tab10[k])) ? "#fff" :
                    //      ((identiteVectorLayer.interval10[identiteVectorLayer.interval10.length - 1] < identiteVectorLayer.val_tab10[k]) ?
                    //          "#9d9d9d" : "#9d9d9d");
                   //  color = (isNaN(identiteVectorLayer.val_tab10[k])) ? "#fff" : (identiteVectorLayer.interval10[0] > identiteVectorLayer.val_tab10[k]) ? "#E0E0E0" : (identiteVectorLayer.interval10[identiteVectorLayer.interval10.length - 1] < identiteVectorLayer.val_tab10[k]) ? "#9d9d9d" : "#9d9d9d";
                    if (isNaN(identiteVectorLayer.val_tab10[k])) {
                     color = "#fff";
                    } else if (identiteVectorLayer.interval10[0] > identiteVectorLayer.val_tab10[k]) {
                     color = identiteVectorLayer.couleurs[0] ;
                    } else if (identiteVectorLayer.interval10[identiteVectorLayer.interval10.length - 1] < identiteVectorLayer.val_tab10[k]) {
                      color = identiteVectorLayer.couleurs[3] ;
                    }
                    identiteVectorLayer.colorGraphList.push({ idUnt: identiteVectorLayer.ids10[k], color: color });
                }
                if (feature.get("id_unite_territorial") == identiteVectorLayer.ids10[identiteVectorLayer.ids10.length - 1]) {
                    resolve(identiteVectorLayer.id)
                }
            } else {
                color = "#fff";
            }
        }
        console.log(identiteVectorLayer);
        /* for (var i = 0; i < identiteVectorLayer.val_tab10.length; i++) {
            var k = i;

            if (feature.get("id_province") == identiteVectorLayer.ids10[k]) {
                var j = 0;
                if (feature.get("id_province") == identiteVectorLayer.ids10[identiteVectorLayer.ids10.length - 1]) {
                    resolve(identiteVectorLayer.id)
                }
                while (j <= identiteVectorLayer.indecator.nombreClass) {
                    //// console.log("in ", identiteVectorLayer)
                    if (identiteVectorLayer.interval10[j] <= identiteVectorLayer.val_tab10[k] && identiteVectorLayer.interval10[j + 1] >= identiteVectorLayer.val_tab10[k])
                    //Affectation des this.couleurs selon les valeurs de l'indicateur
                    {
                        color = identiteVectorLayer.couleurs[j];
                        identiteVectorLayer.colorGraphList.push({ idPvn: identiteVectorLayer.ids10[k], color: color });

                        nomprov = feature.get("libelle");
                        break;
                    }

                    j = j + 1;
                }
            } else k = k + 1;
        } */
        //// console.log("in color style: ", identiteVectorLayer.colorGraphList)
        // console.log(feature)
        var retStyle ;
        console.log(feature.getGeometry().getType());
        if( feature.getGeometry().getType() == "Point") {
             retStyle = new ol.style.Style ({
                image: new ol.style.Circle({
                    radius:10,
                    fill: new ol.style.Fill({
                        color: color
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 1
                    }),
                    text: new ol.style.Text({
                      text: feature.get('libelle'),
                      font: "14px  sans-serif",
                      textAlign: "center",
                      fill: new ol.style.Fill({
                          color: "#000"
                      })
                  })
                })
            })
        }
        else if(feature.getGeometry().getType == "LineString" || feature.getGeometry().getType == "MultiLineString" ) {
          retStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: color,
              width: 3,
            }),
          });
        }
        else{
             retStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                        color: color,
                        width: 3
                    }),
                    text: new ol.style.Text({
                      text: feature.get('libelle'),
                      font: "14px  sans-serif",
                      textAlign: "center",
                      fill: new ol.style.Fill({
                          color: "#000"
                      })
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
        }


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

    }

    styleFunctionCerPrefArr(feature, identiteVectorLayer, resolve) {
        var color = "";
        var nomprov;
        if (identiteVectorLayer.ids3 && identiteVectorLayer.ids3.length > 0) {
            var index = identiteVectorLayer.ids3.indexOf(feature.get("id_cercle_pref_arr"));
            var k = index;
            if (k > -1) {
                var j = 0;

                while (j <= identiteVectorLayer.indecator.nombreClass) {
                    if (identiteVectorLayer.interval3[j] <= identiteVectorLayer.val_tab3[k] && identiteVectorLayer.interval3[j + 1] >= identiteVectorLayer.val_tab3[k])
                    //Affectation des couleurs selon les valeurs de l'indicateur
                    {
                        color = identiteVectorLayer.couleurs[j];
                        identiteVectorLayer.colorGraphList.push({ idCerPrefArr: identiteVectorLayer.ids3[k], color: color });
                        //   nomReg = feature.get("libelle");
                        break;
                    }

                    j = j + 1;
                }

                if (color == "") { //#9d9d9d
                   if (isNaN(identiteVectorLayer.val_tab3[k])) {
                     color = "#fff";
                    }else if (identiteVectorLayer.interval3[0] > identiteVectorLayer.val_tab3[k]) {
                     color = identiteVectorLayer.couleurs[0] ;
                    }else if (identiteVectorLayer.interval3[identiteVectorLayer.interval3.length - 1] < identiteVectorLayer.val_tab3[k]) {
                      color = identiteVectorLayer.couleurs[3] ;
                    }
                    identiteVectorLayer.colorGraphList.push({ idCerPrefArr: identiteVectorLayer.ids3[k], color: color });
                }
                if (feature.get("id_cercle_pref_arr") == identiteVectorLayer.ids3[identiteVectorLayer.ids3.length - 1]) {
                    resolve(identiteVectorLayer.id)
                }
            } else {
                color = "#fff";
            }
        }

        var retStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                }),
                text: new ol.style.Text({
                  text: feature.get('libelle'),
                  font: "14px  sans-serif",
                  textAlign: "center",
                  fill: new ol.style.Fill({
                      color: "#000"
                  })
              })
            });



        return retStyle;


    }

    styleFunctionCmn(feature, identiteVectorLayer, resolve) {
         var color = "";
         var nomcmn;
         //console.log("test", identiteVectorLayer.ids4, feature.get("id_commune"))
         if (identiteVectorLayer.ids4 && identiteVectorLayer.ids4.length > 0) {

             var index = identiteVectorLayer.ids4.indexOf(feature.get("id_commune"));
             var k = index;
             // console.log(index, feature.get("id_province"))
             if (k > -1) {
                 var j = 0;
                 // console.log(" identiteVectorLayer.ids[k], ",  identiteVectorLayer.val_tab[k] )

                 // console.log(index, identiteVectorLayer.ids4)
                 while (j <= identiteVectorLayer.indecator.nombreClass) {
                     if (identiteVectorLayer.interval4[j] <= identiteVectorLayer.val_tab4[k] && identiteVectorLayer.interval4[j + 1] >= identiteVectorLayer.val_tab4[k])
                     //Affectation des couleurs selon les valeurs de l'indicateur
                     {
                         color = identiteVectorLayer.couleurs[j];
                         identiteVectorLayer.colorGraphList.push({ idCmn: identiteVectorLayer.ids4[k], color: color });
                         //   nomReg = feature.get("libelle");
                         break;
                     }

                     j = j + 1;
                 }

                 if (color == "") { //#9d9d9d

                     if (isNaN(identiteVectorLayer.val_tab4[k])) {
                      color = "#fff";
                     }else if (identiteVectorLayer.interval4[0] > identiteVectorLayer.val_tab4[k]) {
                      color = identiteVectorLayer.couleurs[0] ;
                     }else if (identiteVectorLayer.interval4[identiteVectorLayer.interval4.length - 1] < identiteVectorLayer.val_tab4[k]) {
                       color = identiteVectorLayer.couleurs[3] ;
                     }
                     identiteVectorLayer.colorGraphList.push({ idCmn: identiteVectorLayer.ids4[k], color: color });
                 }
                 if (feature.get("id_commune") == identiteVectorLayer.ids4[identiteVectorLayer.ids4.length - 1]) {
                     if (resolve) resolve(identiteVectorLayer.id);
                 }
             } else {
                 color = "#fff";
             }
         }

         var retStyle = new ol.style.Style({

             fill: new ol.style.Fill({
                 color: color
             }),
             stroke: new ol.style.Stroke({
                     color: '#000',
                     width: 1
                 }),
                 text: new ol.style.Text({
                   text: feature.get('libelle'),
                   font: "14px  sans-serif",
                   textAlign: "center",
                   fill: new ol.style.Fill({
                       color: "#000"
                   })
               })

         });
         // // console.log(retStyle)
         // feature.setStyle(retStyle);
         return retStyle;

         // return retStyle;
    }

    styleFunctionDcu(feature, identiteVectorLayer, resolve) {
        var color = "";
        var nomprov;
        if (identiteVectorLayer.ids5 && identiteVectorLayer.ids5.length > 0) {
            var index = identiteVectorLayer.ids5.indexOf(feature.get("id_douar_centreurbain"));
            var k = index;
            if (k > -1) {
                var j = 0;

                while (j <= identiteVectorLayer.indecator.nombreClass) {
                    if (identiteVectorLayer.interval5[j] <= identiteVectorLayer.val_tab5[k] && identiteVectorLayer.interval5[j + 1] >= identiteVectorLayer.val_tab5[k])
                    //Affectation des couleurs selon les valeurs de l'indicateur
                    {
                        color = identiteVectorLayer.couleurs[j];
                        identiteVectorLayer.colorGraphList.push({ idDcu: identiteVectorLayer.ids5[k], color: color });
                        //   nomReg = feature.get("libelle");
                        break;
                    }

                    j = j + 1;
                }

                if (color == "") { //#9d9d9d
                if (isNaN(identiteVectorLayer.val_tab5[k])) {
                    color = "#fff";
                    }else if (identiteVectorLayer.interval5[0] > identiteVectorLayer.val_tab5[k]) {
                    color = identiteVectorLayer.couleurs[0] ;
                    }else if (identiteVectorLayer.interval5[identiteVectorLayer.interval5.length - 1] < identiteVectorLayer.val_tab5[k]) {
                    color = identiteVectorLayer.couleurs[3] ;
                    }
                    identiteVectorLayer.colorGraphList.push({ idDcu: identiteVectorLayer.ids5[k], color: color });
                }
                if (feature.get("id_douar_centreurbain") == identiteVectorLayer.ids5[identiteVectorLayer.ids5.length - 1]) {
                    resolve(identiteVectorLayer.id)
                }
            } else {
                color = "#fff";
            }
        }

        var retStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                }),
                text: new ol.style.Text({
                  text: feature.get('libelle'),
                  font: "14px  sans-serif",
                  textAlign: "center",
                  fill: new ol.style.Fill({
                      color: "#000"
                  })
              })
            });

        return retStyle;

    }

}

var ColorDegradeModeSingleton = (function() {
     var instance;

     function createInstance() {
         var object = new ColorDegradeMode();
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
