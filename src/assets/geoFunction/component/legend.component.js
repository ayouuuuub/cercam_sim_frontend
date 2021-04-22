class Legend {

    constructor() {
            this.cercleCalculate = CalculCercleSingleton.getInstance();
            this.symbolFactory = SymbolFactorySingleton.getInstance();
            this.colorClass = ColorClassSingleton.getInstance();
        }
        //Fonction pour la classification des valeurs statistiques
    getClassificationByValue(identiteVectorLayer, position) {
        position = (position) ? position : "";
        // // myExtObject.currentIndecator = identiteVectorLayer.indecator
        // console.log("identiteVectorLayer valtab", identiteVectorLayer);
        // console.log("identiteVectorLayer val tab position ", identiteVectorLayer['val_tab' + position], "position", position);
        var arrayValTab, currentIndecator;
        var currentIndecator = identiteVectorLayer.indecator;
        // console.log("----------arrayValTab ", identiteVectorLayer['val_tab' + position], position)
        if (identiteVectorLayer['val_tab' + position] && identiteVectorLayer['val_tab' + position].length > 0) {
            arrayValTab = identiteVectorLayer['val_tab' + position].filter(val =>
                    !isNaN(val)
                )
                // console.log("----------arrayValTab ", arrayValTab)
            identiteVectorLayer['serie' + position] = new geostats(arrayValTab);
        } else {
            identiteVectorLayer['serie' + position] = [];
        }

        // console.log("currentIndecator.nombreClass", currentIndecator.nombreClass)
        //Récupération du nombre de classes
        var nbre_class = parseInt(currentIndecator.nombreClass);
        // console.log("nombre de classe in js", nbre_class);
        //Récupération de la gamme de couleur
        var couleur = this.colorClass.getColorByChroma(currentIndecator.couleur);
        var taille = nbre_class - 1;
        identiteVectorLayer.couleurs = chroma.scale([couleur[0], couleur[taille]]).colors(nbre_class);

        // Récupération de l'intervalle des données statistiques classifiées
        identiteVectorLayer['interval' + position] = this.getIntervalSerie(identiteVectorLayer, position);
        console.log(identiteVectorLayer['interval' + position]);
        identiteVectorLayer['serie' + position].setColors(identiteVectorLayer.couleurs);
        identiteVectorLayer['serie' + position].setPrecision(2);
        return identiteVectorLayer['interval' + position];
    }


    getIntervalSerie(identiteVectorLayer, position) {
        position = (position) ? position : "";
        var interval;
        var nbre_class = parseInt(identiteVectorLayer.indecator.nombreClass);
        if (identiteVectorLayer.indecator && nbre_class > 0) {
            if (identiteVectorLayer.indecator.methodClassifi === "NONE" || myExtObject.ref_Component.customValues) {
                let items = [];
                for (let item of identiteVectorLayer.indecator.intervalClassifi) {
                    //console.log("Item: " + item);
                    items.push(parseFloat(item));
                }
                // if(identiteVectorLayer.indecator.methodClassifi !== "ECART_TYPE" && identiteVectorLayer.indecator.methodClassifi !== "INTERVALLE_GEOMETRIQUE"
                //   && identiteVectorLayer.indecator.methodClassifi !== "QUANTILE" && identiteVectorLayer.indecator.methodClassifi !== "SEUILS_NATURELS") {
                //   interval = identiteVectorLayer['serie' + position].setClassManually(items);
                // } else {
                var _t = function(str) {
                    return str;
                };
                console.log('serie' + position);
                identiteVectorLayer['serie' + position].setBounds(items);
                identiteVectorLayer['serie' + position].setRanges();
                // we specify the classification method
                identiteVectorLayer['serie' + position].method = _t('manual classification') + ' (' + (items.length - 1) + ' ' + _t('classes') + ')';
                // identiteVectorLayer['serie' + position].bounds = items;
                interval = identiteVectorLayer['serie' + position].bounds;
                // }
                console.log(identiteVectorLayer['serie' + position]);
                //console.log("Interval: " + interval);
                //console.log("Items: " + items);
            } else if (identiteVectorLayer.indecator.methodClassifi === "INTERVALLES_EGAUX") {
                interval = identiteVectorLayer['serie' + position].getClassEqInterval(nbre_class);
            } else if (identiteVectorLayer.indecator.methodClassifi === "QUANTILE") {
                interval = identiteVectorLayer['serie' + position].getClassQuantile(nbre_class);
            } else if (identiteVectorLayer.indecator.methodClassifi === "ECART_TYPE") {
                interval = identiteVectorLayer['serie' + position].getClassStdDeviation(nbre_class);
            } else if (identiteVectorLayer.indecator.methodClassifi === "method_AP") {
                interval = identiteVectorLayer['serie' + position].getClassArithmeticProgression(nbre_class);
            } else if (identiteVectorLayer.indecator.methodClassifi === "INTERVALLE_GEOMETRIQUE") {

                identiteVectorLayer['serie' + position] = this.INTERVALLE_GEOMETRIQUE_FilterNegative(identiteVectorLayer.indecator.methodClassifi, identiteVectorLayer['val_tab' + position]).classification;
                interval = identiteVectorLayer['serie' + position].getClassGeometricProgression(nbre_class);

            } else if (identiteVectorLayer.indecator.methodClassifi === "SEUILS_NATURELS") {
                interval = identiteVectorLayer['serie' + position].getClassJenks(nbre_class);
            } else {
                return [];
            }
        } else {
            return [];
        }
        return interval;
    }
    getInterval(nbre_class, listValue, type) {
        var interval;
        var nbre_class = parseInt(nbre_class);

        var classification = new geostats(listValue);
        console.log(classification);
        if (nbre_class > 0 && classification) {
            if (type === "INTERVALLES_EGAUX") {
                interval = classification.getClassEqInterval(nbre_class);
            } else if (type === "QUANTILE") {
                interval = classification.getClassQuantile(nbre_class);
            } else if (type === "ECART_TYPE") {
                interval = classification.getClassStdDeviation(nbre_class);
            } else if (type === "method_AP") {
                interval = classification.getClassArithmeticProgression(nbre_class);
            } else if (type === "INTERVALLE_GEOMETRIQUE") {
                classification = this.INTERVALLE_GEOMETRIQUE_FilterNegative(type, listValue).classification;
                interval = classification.getClassGeometricProgression(nbre_class);
            } else if (type === "SEUILS_NATURELS") {
                interval = classification.getClassJenks(nbre_class);
            } else {
                interval = classification.getClassEqInterval(nbre_class);
            }
        } else {
            return [];
        }
        return interval;
    }
    INTERVALLE_GEOMETRIQUE_FilterNegative(type, listValue) {
        var classification = new geostats(listValue);
        if (type === "INTERVALLE_GEOMETRIQUE") {
            listValue = listValue.filter(val =>
                !isNaN(val) && val != 0 && val > 0
            )
            classification = new geostats(listValue);
        }
        return { classification: classification, listValue: listValue }
    }
    getInterval_2(nbre_class, serie, type, arrayValTab) {
            var interval = [];
            //console.log(type)
            if (type === "INTERVALLES_EGAUX") {
                interval = serie.getClassEqInterval(nbre_class);
            } else if (type === "QUANTILE") {
                interval = serie.getClassQuantile(nbre_class);
            } else if (type === "ECART_TYPE") {
                interval = serie.getClassStdDeviation(nbre_class);
            } else if (type === "method_AP") {
                interval = serie.getClassArithmeticProgression(nbre_class);
            } else if (type === "INTERVALLE_GEOMETRIQUE") {
                serie = this.INTERVALLE_GEOMETRIQUE_FilterNegative(type, arrayValTab).classification;
                interval = serie.getClassGeometricProgression(nbre_class);
            } else if (type === "SEUILS_NATURELS") {
                interval = serie.getClassJenks(nbre_class);
            } else {
                interval = serie.getClassEqInterval(nbre_class);
            }
            return interval;
        }
          /**
           * @ghostloufissi
           */
      getMaxIntervalClassification(legend, serie ,identiteVectorLayer){
            // console.log(legend.innerHTML);
              var format = (n) => {
                  var x = Number(n);
                  var p = x + "";
                  if (p.indexOf(".") > -1 && p.indexOf(".00") != -1) {
                      p = x.toPrecision(2)
                  }
                  //p = new Intl.NumberFormat().format(Number(p));
                  return p
                      .replace('.', ',') // replace decimal point character with ,
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
              }
              /***
               * @anasloufissi
               */
              // var valueArry = $($($(legend).find(".geostats-legend")).children().eq(1).contents()).eq(1).text().split(/[-]+/)
              // var valueFinal = valueArry[1]
              // $($($(legend).find(".geostats-legend")).children().eq(1).contents()).eq(2).empty();
              // $($($(legend).find(".geostats-legend")).children().eq(1).contents()).eq(2).text("< "+valueFinal)
              /***
               * End
               */
              var list = serie.serie.sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0))
              var bounds = serie.bounds ;
              var max = list[list.length - 1] ;
              var value = format(Number.parseFloat(bounds[bounds.length - 1]).toFixed(2))
              var valueMax = format(Number.parseFloat(max).toFixed(2));
              this.equalMin(legend)
              // var intervalMaxClassfication  =  bounds[bounds.length - 1] ;
              var maxInterval = Number(bounds[bounds.length -1 ].toFixed(2))
              if (bounds[bounds.length - 1] < max &&  value != valueMax) {
                var ind = 0 ;
                list.map(x =>{
                  if (x > maxInterval) {
                   ind = ind + 1;
                  }
                })
                if (myExtObject.donneIsExist == true   ) {
                //  console.log("classification number is equal is true" );
                //  var lengend =  myExtObject.legendIntervale ;
                // var lengend =  myExtObject.legendIntervale ;
                // var textValue = $($($(legend).find('.geostats-legend')).children().last()).after().children().last().text().split(/[()]+/);
                // var oldVlaue = textValue[1];
                // var newValue = Number(oldVlaue) +  ind ;
                // console.log(oldVlaue);
                // $($($(legend).find('.geostats-legend')).children().last()).after().children().last().text('('+newValue+')');
                var textValue = $($($(legend).find('.geostats-legend')).find('.geostats-legend-counter').length)
                var maxLenght = textValue[0] ;
                var textValues = $($($(legend).find('.geostats-legend')).find('.geostats-legend-counter')).eq(Number(maxLenght) - 2).text().split(/[()]+/)
                var oldVlaue = textValues[1];
                var newValue = Number(oldVlaue) +  ind ;
                $($($(legend).find('.geostats-legend')).find('.geostats-legend-counter')).eq(Number(maxLenght) - 2).text('('+newValue+')') ;
                // $($($(legend).find('.geostats-legend')).find('.geostats-legend-block').length)
                this.maxToLengend(legend);

                this.addMin(legend , serie);
                } else {
                  // console.log("classification number is equal is false" )
                  var textValue = $($($(legend).find('.geostats-legend')).children().last()).children().last().text().split(/[()]+/);
                  var oldVlaue = textValue[1];
                  // console.log(oldVlaue);
                  var newValue = Number(oldVlaue) +  ind ;
                  $($($(legend).find('.geostats-legend')).children().last()).children().last().text('('+newValue+')');
                  this.maxToLengend(legend);

                  this.addMin(legend , serie);
                }
                // var after = '<div><div class="geostats-legend-block" style="background-color:#a1a1a1"></div>&gt; ' +
                //     value + '   <span class="geostats-legend-counter"></span></div>'
                //     console.log(bounds[bounds.length - 1], format(bounds[bounds.length - 1]))
                // $(after).insertAfter($(legend.find('.geostats-legend').children().last().get(0)));
                // console.log("classification number is equal ", ind)
            }

           }


           /***
            * End Function
            */
        //ajddig : add max gray min banch
    addMin(legend, serie) {

        var format = (n) => {
            var x = Number(n);
            var p = x + "";
            if (p.indexOf(".") > -1 && p.indexOf(".00") != -1) {
                p = x.toPrecision(2)
            }
            //p = new Intl.NumberFormat().format(Number(p));
            return p
                .replace('.', ',') // replace decimal point character with ,
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        }
        var list = serie.serie.sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0))
        var bounds = serie.bounds;
        var min = list[0];
        //  legend.find('.geostats-legend .geostats-legend-title').get(0).after("<p>Test</p>");

        var value = format(Number.parseFloat(bounds[0]).toFixed(2));
        var valueMin = format(Number.parseFloat(min).toFixed(2));
        if (bounds[0] > min && value != valueMin) {

          this.minToLengend(legend);
            // var before = '<div><div class="geostats-legend-block" style="background-color:#E0E0E0"></div> &lt; ' +
            //     value + ' <span class="geostats-legend-counter"></span></div>';
            // $(legend.find('.geostats-legend .geostats-legend-title').get(0)).after($(before));
            // return { min: value, status: true };
        }
        return { min: value, status: false };
        //find valeur null or not existe
    }
    addMax(legend, serie) {

      // console.log(legend.innerHTML);
        var format = (n) => {
            var x = Number(n);
            var p = x + "";
            if (p.indexOf(".") > -1 && p.indexOf(".00") != -1) {
                p = x.toPrecision(2)
            }
            //p = new Intl.NumberFormat().format(Number(p));
            return p
                .replace('.', ',') // replace decimal point character with ,
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        }
        /***
         * @anasloufissi
         */
        // var valueArry = $($($(legend).find(".geostats-legend")).children().eq(1).contents()).eq(1).text().split(/[-]+/)
        // var valueFinal = valueArry[1]
        // $($($(legend).find(".geostats-legend")).children().eq(1).contents()).eq(2).empty();
        // $($($(legend).find(".geostats-legend")).children().eq(1).contents()).eq(2).text("< "+valueFinal)
        /***
         * End
         */
        var list = serie.serie.sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0))
        var bounds = serie.bounds
        var max = list[list.length - 1]
        var value = format(Number.parseFloat(bounds[bounds.length - 1]).toFixed(2))
        var valueMax = format(Number.parseFloat(max).toFixed(2));
        var maxInterval = Number(bounds[bounds.length -1 ].toFixed(2))
        if (bounds[bounds.length - 1] < max &&  value != valueMax) {
          // var ind = 0 ;
            // var after = '<div><div class="geostats-legend-block" style="background-color:#a1a1a1"></div>&gt; ' +
            //     value + '   <span class="geostats-legend-counter"></span></div>'
            //     console.log(bounds[bounds.length - 1], format(bounds[bounds.length - 1]))
            // $(after).insertAfter($(legend.find('.geostats-legend').children().last().get(0)));
            // list.map(x =>{
            //   if (x > maxInterval) {
            //    ind = ind + 1;
            //   }
            // })
            // console.log("number is equal ", ind)
        }

    }
    checkIsNull(legend, identiteVectorLayer, parmSerie, minStatus) {
      myExtObject.donneIsExist = false ;
            if (!minStatus.status) {
                var insertIn;
                switch (parmSerie) {
                    case 'serie2':
                        insertIn = (identiteVectorLayer.val_tab2 && identiteVectorLayer.val_tab2.length > 0 && identiteVectorLayer.val_tab2.indexOf(undefined) != -1);
                        break;
                    case 'serie3':
                        insertIn = (identiteVectorLayer.val_tab3 && identiteVectorLayer.val_tab3.length > 0 && identiteVectorLayer.val_tab3.indexOf(undefined) != -1);
                        break;
                    case 'serie4':
                        insertIn = (identiteVectorLayer.val_tab4 && identiteVectorLayer.val_tab4.length > 0 && identiteVectorLayer.val_tab4.indexOf(undefined) != -1);
                        break;
                    case 'serie5':
                        insertIn = (identiteVectorLayer.val_tab5 && identiteVectorLayer.val_tab5.length > 0 && identiteVectorLayer.val_tab5.indexOf(undefined) != -1);
                        break;
                    case 'serie10':
                        insertIn = (identiteVectorLayer.val_tab10 && identiteVectorLayer.val_tab10.length > 0 && identiteVectorLayer.val_tab10.indexOf(undefined) != -1);
                        break;
                    default:
                        insertIn = (identiteVectorLayer.val_tab && identiteVectorLayer.val_tab.length > 0 && identiteVectorLayer.val_tab.indexOf(undefined) != -1);
                        break;
                }
                insertIn = true;
                if (insertIn && minStatus.min) {
                    var value = minStatus.min;
                    var before = '<div id="donne"><div class="geostats-legend-block" style="background-color:#fff"></div>  ' +
                        value + ' <span class="geostats-legend-counter"></span></div>';
                  $ ( $(legend.find('.geostats-legend').get(0)).children().last()).after($(before));
                  myExtObject.donneIsExist = true ;
                }
            }

        }
        /**
         * @ghostloufissi
         * Add Number Max Lengend  .
         */
        maxToLengend(legend){

          if ( myExtObject.donneIsExist == true) {
            var deleteindex = $($(legend).find(".geostats-legend")).children().length ;
            var firstItem = deleteindex - 2 ;
            var valueResult = $($(legend).find(".geostats-legend")).children().eq(firstItem).contents().eq(1).text().split(/[-]+/) ;
            var valueNumber = $($(legend).find(".geostats-legend")).children().eq(firstItem).contents().eq(2).text().split(/[()]+/);
            var valueFinalResult = valueResult[1] ;
            var valueFinalNumber = valueNumber[1];
            var before = '<div><div class="geostats-legend-block" style="background-color:#f16913"></div>  ' +
            valueFinalResult + " <" +' <span class="geostats-legend-counter">'+'('+valueFinalNumber+')'+'</span></div>';
          $($(legend).find(".geostats-legend")).children().eq(firstItem).remove();
          $($(legend).find(".geostats-legend")).children().eq(firstItem - 1 ).after($(before))
          }else{
            var deleteindex = $($(legend).find(".geostats-legend")).children().length ;
            var firstItem = deleteindex - 1 ;
            var valueResult = $($(legend).find(".geostats-legend")).children().eq(firstItem).contents().eq(1).text().split(/[-]+/) ;
            var valueNumber = $($(legend).find(".geostats-legend")).children().eq(firstItem).contents().eq(2).text().split(/[()]+/);
            var valueFinalResult = valueResult[1];
            var valueFinalNumber = valueNumber[1];
            var before = '<div><div class="geostats-legend-block" style="background-color:#f16913"></div>  ' +
            valueFinalResult + " <" +' <span class="geostats-legend-counter">'+'('+valueFinalNumber+')'+'</span></div>';
          $($(legend).find(".geostats-legend")).children().eq(firstItem).remove();
          $($(legend).find(".geostats-legend")).children().eq(firstItem - 1 ).after($(before))
          }

        }
        /**
         * End function
         */

         /***
          * @ghostloufissi
          *
          * if value is equal
          */
         equalMin(legend){

          var deleteindex = $($(legend).find(".geostats-legend")).children().length ;
          var firstItem = deleteindex - (deleteindex - 1 ) ;
          var valueResult = $($(legend).find(".geostats-legend")).children().eq(firstItem).contents().eq(1).text().split(/[-]+/) ;
          var valueNumber = $($(legend).find(".geostats-legend")).children().eq(firstItem).contents().eq(2).text().split(/[()]+/);
          if (valueResult.length > 1) {
            var valueNumberOne = Number(valueResult[0]);
            var valueNubertow = Number(valueResult[1]);
            var valueFinalNumber = valueNumber[1];
            if (valueNumberOne == valueNubertow) {
              var before = '<div><div class="geostats-legend-block" style="background-color:#fdd0a2"></div>  '
              +valueNubertow + ' <span class="geostats-legend-counter">'+'('+valueFinalNumber+')'+'</span></div>';
            $($(legend).find(".geostats-legend")).children().eq(firstItem).remove();
            $($(legend).find(".geostats-legend")).children().eq(firstItem - 1 ).after($(before))
            }
          }
         }
         /***
          * End Function
          */
        /***
         * @ghostloufissi
         * Add Min Number to Lengend .
         */
        minToLengend(legend){

          var deleteindex = $($(legend).find(".geostats-legend")).children().length ;
          var firstItem = deleteindex - (deleteindex - 1 ) ;
          var valueResult = $($(legend).find(".geostats-legend")).children().eq(firstItem).contents().eq(1).text().split(/[-]+/) ;
          var valueNumber = $($(legend).find(".geostats-legend")).children().eq(firstItem).contents().eq(2).text().split(/[()]+/);
          var valueFinalResult = valueResult[1];
          var valueFinalNumber = valueNumber[1];
          var valueNumberOne = Number(valueResult[0]);
          var valueNubertow = Number(valueResult[1]);
          if (valueNumberOne == valueNubertow) {
          //   var before = '<div><div class="geostats-legend-block" style="background-color:#fdd0a2"></div>  ' +
          //   "< "+valueNumberOne + ' <span class="geostats-legend-counter">'+'('+valueFinalNumber+')'+'</span></div>';
          // $($(legend).find(".geostats-legend")).children().eq(firstItem).remove();
          // $($(legend).find(".geostats-legend")).children().eq(firstItem - 1 ).after($(before))
          }else{
            var before = '<div><div class="geostats-legend-block" style="background-color:#fdd0a2"></div>  ' +
            "< "+valueFinalResult + ' <span class="geostats-legend-counter">'+'('+valueFinalNumber+')'+'</span></div>';
          $($(legend).find(".geostats-legend")).children().eq(firstItem).remove();
          $($(legend).find(".geostats-legend")).children().eq(firstItem - 1 ).after($(before))
          }


        }

         /***
          * End Fcuntion
          */

        //ajouter les legend dynamic
        addLegend(identiteVectorLayer, parmSerie , order) {
            if(order == undefined){
              order = '';
            }
              var currentIndecator = myExtObject.currentIndecator
              var serie = (parmSerie) ? parmSerie : "serie"
              var legend = $("<div></div>").text("");
              legend.addClass("legendCss");
              legend.attr('id', 'legend-' + identiteVectorLayer.id);
              myExtObject.legendColor = 'legend-' + identiteVectorLayer.id ;
              if (!identiteVectorLayer.symbolCanva) {
                  var format = (n) => {
                      var x = Number(n);
                      var p = x + "";
                      if (p.indexOf(".") > -1 && p.indexOf(".00") != -1) {
                          p = x.toPrecision(2)
                      }
                      //p = new Intl.NumberFormat().format(Number(p));
                      return p
                          .replace('.', ',') // replace decimal point character with ,
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
                  }
                  var showInclude = ">";
                  var i = 0;

                  legend.html(identiteVectorLayer[serie].getHtmlLegend(null, order+""+identiteVectorLayer.indecator.titre, 1, function(event) {
                      i++;
                      //add
                      var formatValue = ((i != 1 && i != 2) ? showInclude : "") + "  " + format(event);
                      showInclude = (showInclude == "") ? ">" : ""
                      return formatValue;
                  }));
                  myExtObject.donneIsExist = false ;
                  // this.checkIsNull(legend, identiteVectorLayer, serie, this.addMin(legend, identiteVectorLayer[serie]));
                  // this.getMaxIntervalClassification(legend , identiteVectorLayer[serie])
                  // this.addMin(legend, identiteVectorLayer[serie]) ;
                  // this.addMax(legend, identiteVectorLayer[serie]) ;

                  this.checkIsNull(legend, identiteVectorLayer, serie, { min: "données indisponible", status: false });
                  this.getMaxIntervalClassification(legend  ,identiteVectorLayer[serie] , identiteVectorLayer);
              } else {
                  var geostat = $('<div class="geostats-legend"></div>')
                  geostat.prepend('<div class="geostats-legend-title">' +order+""+ identiteVectorLayer.indecator.titre + '</div>')
                  geostat.append(identiteVectorLayer.symbolCanva[0])
                  legend.append(geostat)
              }

              this.removeLegend(identiteVectorLayer);
              if (currentIndecator && identiteVectorLayer.id == currentIndecator.id) {
                  $("#mainLegend #body-legend").prepend(legend);
              } else if (currentIndecator && identiteVectorLayer.id != currentIndecator.id) {
                  $("#mainLegend #body-legend").append(legend);
              }

              if ($('#mainLegend #body-legend .legendCss').length == 1) {
                  $("#mainLegend #legend h4").css({ "display": "block" });
                  $("#mainLegend #legend").css({ "background-color": "rgba(255, 255, 255, .4)", "height": "18em", "width": "20em", "padding-left": "14px", "bottom": "0px", "margin-left": "22px", "z-index": " -1", "overflow-y" : "auto"});
              }
              $('#mainLegend #legendButton').css({ "display": "block" });
              $('#mainLegend #legendButton').addClass("icon icon-arrow-left")
              $("#mainLegend #legend").css({ "display": "block" });

          }


        //ajouter les legend dynamic
    addTempLegend(identiteVectorLayer, parmSerie , order) {
        if(order == undefined){
          order = '';
        }
          var currentIndecator = myExtObject.currentIndecator
          var serie = (parmSerie) ? parmSerie : "serie"
          var legend = $("<div></div>").text("");
          legend.addClass("legendCss");
          legend.attr('id', 'legend-' + identiteVectorLayer.id);
          myExtObject.legendColor = 'legend-' + identiteVectorLayer.id ;
          if (!identiteVectorLayer.symbolCanva) {
              var format = (n) => {
                  var x = Number(n);
                  var p = x + "";
                  if (p.indexOf(".") > -1 && p.indexOf(".00") != -1) {
                      p = x.toPrecision(2)
                  }
                  //p = new Intl.NumberFormat().format(Number(p));
                  return p
                      .replace('.', ',') // replace decimal point character with ,
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
              }
              var showInclude = ">";
              var i = 0;

              legend.html(identiteVectorLayer[serie].getHtmlLegend(null, order+""+identiteVectorLayer.indecator.titre, 1, function(event) {
                  i++;
                  //add
                  var formatValue = ((i != 1 && i != 2) ? showInclude : "") + "  " + format(event);
                  showInclude = (showInclude == "") ? ">" : ""
                  return formatValue;
              }));
              myExtObject.donneIsExist = false ;
              // this.checkIsNull(legend, identiteVectorLayer, serie, this.addMin(legend, identiteVectorLayer[serie]));
              // this.getMaxIntervalClassification(legend , identiteVectorLayer[serie])
              // this.addMin(legend, identiteVectorLayer[serie]) ;
              // this.addMax(legend, identiteVectorLayer[serie]) ;

              this.checkIsNull(legend, identiteVectorLayer, serie, { min: "données indisponible", status: false });
              this.getMaxIntervalClassification(legend  ,identiteVectorLayer[serie] , identiteVectorLayer);
          } else {
              var geostat = $('<div class="geostats-legend"></div>')
              geostat.prepend('<div class="geostats-legend-title">' +order+""+ identiteVectorLayer.indecator.titre + '</div>')
              geostat.append(identiteVectorLayer.symbolCanva[0])
              legend.append(geostat)
          }

          this.removeLegend(identiteVectorLayer);
          if (currentIndecator && identiteVectorLayer.id == currentIndecator.id) {
              $("#body-temp-legend").prepend(legend);
          } else if (currentIndecator && identiteVectorLayer.id != currentIndecator.id) {
              $("#body-temp-legend").append(legend);
          }

          if ($('#body-temp-legend .legendCss').length == 1) {
              $("#temp-legend h4").css({ "display": "block" });
              $("#temp-legend").css({ "background-color": "rgba(255, 255, 255, .4)", "height": "18em", "width": "20em", "padding-left": "14px", "bottom": "0px", "margin-left": "22px", "z-index": " -1" , "overflow-y" : "auto"});
          }
          $('#tempLegendButton').css({ "display": "block" });
          $('#tempLegendButton').addClass("icon icon-arrow-left")
          $("#temp-legend").css({ "display": "block" });

      }
    removeTempLegend() {
        if($('#body-temp-legend').children().length > 0){
            console.log('removing legend ................');
            $('#body-temp-legend .legendCss').remove();
        }
    }
    removeAllLegend() {
        if($('#body-legend').children().length > 0){
            console.log('removing legend ................');
            $('#body-legend .legendCss').remove();
        }

    }
    removeLegend(identiteVectorLayer) {
        if (identiteVectorLayer && identiteVectorLayer.id && $('#legend-' + identiteVectorLayer.id).length == 1) {
            // console.log($('#legend-' + identiteVectorLayer.id), identiteVectorLayer)
            console.log(identiteVectorLayer.id)
            $('#legend-' + identiteVectorLayer.id).remove();
        } else {
            return;
        }

        if ( $('#body-legend .legendCss').length == 0 ) {
            $("#legend").css({ "display": "none" });
            //$(".slide-toggle").css({ "display": "none" });
            $('#legendButton').css({ "display": "none" });
            $('#legendButton').removeClass("icon icon-arrow-left")
            $('#legendButton').addClass("fa fa-list-ul")
        } else {
            $("#legend").css({ "display": "block" });
            // $(".slide-toggle").css({ "display": "inline-block" });
        }
    }



    generateCanvasOfSymobol(identiteVectorLayer) {
        // console.log("identiteVectorLayer passé dans generateCanvasOfSymobol   :", identiteVectorLayer);
        if (myExtObject.positionPrv == null && myExtObject.positionPrv == undefined) {
          myExtObject.positionPrv = "";
        }
        var interval = this.getClassificationByValue(identiteVectorLayer ,  myExtObject.positionPrv);
        // console.log("interval recu by getClassificationbyVAlue   :", interval);
        var val_indic2 = [];
        if (interval && interval.length) {
            var nbrClasses = interval.length - 1;
            var n = interval.length;

            /// id du 2eme indicateur
            // console.log(identiteVectorLayer)
            for (var i = 0; i < identiteVectorLayer.val_tab_global.length; i++) {
                if (!isNaN(identiteVectorLayer.val_tab_global[i].valeur))
                    val_indic2.push(identiteVectorLayer.val_tab_global[i].valeur);

            }

            let tabInterval = this.getClassificationByValue(identiteVectorLayer ,myExtObject.positionPrv)
            const max = Math.max(...tabInterval);
            const min = Math.min(...tabInterval);
            var canvas = $('<canvas/>', { 'class': 'legendSymbol' })
            canvas.attr("id", "legend-imag-" + identiteVectorLayer.indecator.id);
            //var coeff = this.coeffCalculation(this.sumSurface(identiteVectorLayer.val_tab_global), identiteVectorLayer.val_tab_global)
            //// console.log("coeff : ", coeff, " sumSurface:", this.sumSurface(identiteVectorLayer.val_tab_global), " min:", this.minSurface(identiteVectorLayer.val_tab_global))

            var minradius = this.cercleCalculate.radiusCalculationPerClass(min,tabInterval);
            var maxradius = this.cercleCalculate.radiusCalculationPerClass(max,tabInterval);

            var canevasHeight = 0;
            if (nbrClasses <= 3)
                canevasHeight = 2 * maxradius + 10;
            else
                canevasHeight = (2 * maxradius * nbrClasses) + 10

            var vectorContext = ol.render.toContext(canvas[0].getContext('2d'), {
              //WIDTH
                size: [maxradius * 3 + ((max + "").length <= 3 ? (max + "").length + 2 : (max + "").length) * 14,
                    canevasHeight
                ]
            });

            var nbrClasses = interval.length - 1;
            var n = interval.length - 1;
            //var n = interval.length;

            // console.log("interval classif: ", interval);

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
            var radiusStack = 0;
            // add the max interval
            /***
             * @anasloufissi
             */
            var maxInterval = Math.max(...tabInterval);
            var maxValeurIndicateur = Math.max(...val_indic2);
            var minValeurIndicateur = Math.min(...val_indic2);
            var minInterval = Math.min(...tabInterval);
            var include ;
            // if (maxValeurIndicateur >  maxInterval ) {
            //   include = "<"
            // }else{
            //   include = ""
            // }
            /***
             * End Max Values :
             */
            /////
            //added by imrane this function for legend cercle
            tabVal.reverse()
                .forEach((val) => {
                    //const radius = this.cercleCalculate.radiusCalculation2(val, identiteVectorLayer.val_tab_global);
                    if (val == maxInterval && maxValeurIndicateur >  maxInterval) {
                      include = " <"
                    }else if(val == minInterval && minValeurIndicateur < minInterval){
                      include = " >"
                    }else{
                      include = ""
                    }
                    const radius = (n - i) / n * maxradius;

                    //console.log("reduis: ", radius)

                    if (nbrClasses <= 3)
                        var decalageY = 0; //stacked symbols
                    else
                        var decalageY = radiusStack; //+ 14 * (i + 1);

                    var decalageIfCarre = 0;
                    var decalageIfXsymbol = 0;

                    if (identiteVectorLayer.indecator.modeRepresentation == 'SQUARE')
                        decalageIfCarre = radius - radius / Math.sqrt(2);
                    else if (identiteVectorLayer.indecator.modeRepresentation == 'X') {
                        decalageIfCarre = radius - radius / Math.sqrt(2);
                        decalageIfXsymbol = radius;
                    }

                    var lineLength = maxradius + 60;
                    //
                    var xtranslation = 10;
                    var ytranslation = 7 - decalageIfCarre;
                    var format = (n) => {
                            var x = Number(n);
                            var p = x + "";
                            if (p.indexOf(".") > -1 && p.indexOf(".00") != -1) {
                                p = x.toPrecision(2)
                            }
                            //p = new Intl.NumberFormat().format(Number(p));
                            return p
                                .replace('.', ',') // replace decimal point character with ,
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
                        }
                        /* text position is relative to the line */

                    //line coordinates
                    var xpoint1 = xtranslation + maxradius + decalageIfXsymbol; // + (max + "").length;
                    var xpoint2 = xtranslation + lineLength; //13 * maxradius / 4;

                    var ypoint1 = ytranslation + (2 * maxradius - 2 * radius) + decalageY + decalageIfCarre;
                    var ypoint2 = ytranslation + (2 * maxradius - 2 * radius) + decalageY + decalageIfCarre;
                    //
                    const length = identiteVectorLayer.indecator.ranges ? identiteVectorLayer.indecator.ranges.length - 1 : null;
                    const text = new ol.style.Text({
                        //offsetX: maxradius + ((max + "").length * 7) / 2,
                        offsetX: 2 * maxradius + (maxradius / 4) + 6,
                        offsetY: -radius + decalageIfCarre,
                        // overflow: true,
                        text: (identiteVectorLayer.indecator.ranges && identiteVectorLayer.indecator.ranges[length - i ] != null && identiteVectorLayer.indecator.ranges[length - i] != '')  ? identiteVectorLayer.indecator.ranges[length - i]  :  format(Math.floor(val)) + include,
                        textAlign: 'start',
                        font: 'bold 14px sans-serif',
                        fill: new ol.style.Fill({ color: '#000' })
                    });

                    //+ (identiteVectorLayer.indecator && identiteVectorLayer.indecator.unite && identiteVectorLayer.indecator.unite.libelle) ? identiteVectorLayer.indecator.unite.libelle : ''


                    var symbolLegendStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: "#000",
                            width: 0.5
                        }),
                    })
                    vectorContext.setStyle(symbolLegendStyle);


                    vectorContext.drawGeometry(new ol.geom.LineString([
                        [xpoint1, ypoint1],
                        [xpoint2, ypoint2]
                    ]));
                    //console.log("color : ", identiteVectorLayer.width, identiteVectorLayer.colorBase)
                    symbolLegendStyle = new ol.style.Style({
                        /* image: new ol.style.Circle({
                            stroke: new ol.style.Stroke({
                                color: identiteVectorLayer.colorBase,
                                width: 2
                            }),
                            radius: radius
                        }) */
//addd
                        image: this.symbolFactory.createSymbol({
                            type: identiteVectorLayer.symbolMode,
                            bgColor: (identiteVectorLayer.indecator.figurecolor) ? identiteVectorLayer.colorBase : "",
                            contorColor: (!identiteVectorLayer.indecator.figurecolor) ? identiteVectorLayer.colorBase : "#000",
                            width: (!identiteVectorLayer.indecator.figurecolor) ? identiteVectorLayer.width : 1,
                            raduis: radius,
                            rotation: 0
                        }).getForm(),
                        text: text
                    })

                    vectorContext.setStyle(symbolLegendStyle);
                    vectorContext.drawGeometry(new ol.geom.Point([xtranslation + maxradius, ytranslation + (2 * maxradius - radius) + decalageY]));

                    i = i + 1;
                    radiusStack = radiusStack + 2 * radius;

                });
            return canvas;
        }
    }

}

var LegendSingleton = (function() {
    var instance;

    function createInstance() {
        var object = new Legend();
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
