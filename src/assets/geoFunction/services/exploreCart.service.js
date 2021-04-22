class ExploreCartSevice {

    constructor() {
        this.colorClass = ColorClassSingleton.getInstance();
        this.legend = LegendSingleton.getInstance();
        this.symbolModePresentation = SymbolModeSingleton.getInstance();
        this.colorDegrade = ColorDegradeModeSingleton.getInstance();
        this.uniqueIndecatorDegradeSevice = UniqueIndecatorDegradeSeviceSingloton.getInstance();

    }
    removeSelectFeatureInMap() {
        if (myExtObject.selectInMap) myExtObject.map.removeInteraction(myExtObject.selectInMap);
        myExtObject.selectInMap = null;
        $('#tooltip').css({ 'display': 'none' });
    }
    selectFeatureInMap(zone, identiteVectorLayer, sub) {
        this.removeSelectFeatureInMap()
        myExtObject.selectInMap = new ol.interaction.Select();
        myExtObject.map.addInteraction(myExtObject.selectInMap);
        var features = myExtObject.selectInMap.getFeatures();
        features.clear();
            // now you have an ol.Collection of features that you can add features to

        // now the pushed feature is highlighted
        var arrayVect = identiteVectorLayer.vectorLayer.getSource().getFeatures();
        var idzone = (itemTableur) => (itemTableur.id_region) ? itemTableur.id_region : ((itemTableur.id_province) ? itemTableur.id_province : ((itemTableur.id_commune) ? itemTableur.id_commune : (itemTableur.id_unite_territorial ?itemTableur.id_unite_territorial: (itemTableur.id) ? itemTableur.id : "")))

        var zoneCmpId = (zone.region && zone.region.id) ? zone.region.id : ((zone.province && zone.province.id) ? zone.province.id : ((zone.commune && zone.commune.id) ? zone.commune.id : null))
        console.log(zoneCmpId);
        var pos = arrayVect.map(function(itemin) {
            // return (item.id_region) ? item.id_region : ((item.id_province) ? item.id_province : ((item.id_commune) ? item.id_commune : ''))
            return idzone(itemin.getProperties())

        }).indexOf(zoneCmpId);

        if (pos > -1) {
            features.push(arrayVect[pos]);
            features.dispatchEvent({
                type: 'select',
                selected: [arrayVect[pos]],
                deselected: []
            });
            this.hoverValeurLabel(arrayVect[pos], (sub) ? sub.indecator : identiteVectorLayer.indecator);
        }

        //to dehighlight, just simply remove the feature from select
        // features.remove(feature);
    }
    pointerMoveInMap(identiteVectorLayer) {

        if (identiteVectorLayer.selectPointerSelectFeature) {
            myExtObject.map.removeInteraction(identiteVectorLayer.selectPointerSelectFeature);
            identiteVectorLayer.selectPointerSelectFeature = null;
        }
        //  console.log(identiteVectorLayer)
        identiteVectorLayer.selectPointerSelectFeature = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            layers: [identiteVectorLayer.vectorLayer]
        });


        identiteVectorLayer.selectPointerSelectFeature.on('select', (e) => {
            e.stopPropagation();
            //identiteVectorLayer.selectFeature.getFeatures().clear();
            /*   console.log(e.selected[0], e.deselected[0]) */
            $(".hover-class").css({ "background-color": "" });
            if(e == null) {
                $('#tooltip').css({'display': 'none'});
            }

            if (e.deselected && e.deselected.length > 0) {

              var itemTableur = e.deselected[0].values_ ? e.deselected[0].values_ : e.deselected[0].H;
              var idHtml = ((itemTableur.id_province) ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_province :
              (itemTableur.id_commune ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_commune :
              (itemTableur.id_unite_territorial ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_unite_territorial :
              (itemTableur.id_cercle_pref_arr ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_cercle_pref_arr :
              (itemTableur.id_douar_centreurbain ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_douar_centreurbain :
              (itemTableur.id_region ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_region :
              (itemTableur.id) ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id : ''))))))
              if ($('#'+ idHtml)) $('#'+ idHtml).css({ "background-color": "" });
              this.hoverGraph(identiteVectorLayer, itemTableur, false);
              //this.hoverGraph(identiteVectorLayer.indecator, itemTableur, false)
              // $('#tooltip').css({ 'display': 'none' })
              if (myExtObject.overlay) {
                myExtObject.map.removeOverlay(myExtObject.overlay);
              }
                  //sub List tablur
              if (identiteVectorLayer.composentIdentiteLayerList && identiteVectorLayer.composentIdentiteLayerList.length > 0) {
                  //highcharts graph
                  this.hoverGraph(identiteVectorLayer.composentIdentiteLayerList[0], itemTableur, false);
                  // $('#tooltip').css({ 'display': 'none' })
              }
            }
            if (e.selected && e.selected.length > 0) {
              var itemTableur = e.selected[0].values_ ? e.selected[0].values_ : e.selected[0].H;
              if (identiteVectorLayer && identiteVectorLayer.indecator && identiteVectorLayer.composentIdentiteLayerList.length == 0 ) {
                  // console.log("Have just one indicateur")
                  var idHtml =  ((itemTableur.id_province) ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_province :
                  ((itemTableur.id_commune) ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_commune :
                  (itemTableur.id_unite_territorial ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_unite_territorial :
                  (itemTableur.id_cercle_pref_arr ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_cercle_pref_arr :
                  (itemTableur.id_douar_centreurbain ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_douar_centreurbain :
                  ((itemTableur.id_region) ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_region :
                  ( itemTableur.id ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id :'')))))));
                  var itemLibelle = '';
                  if (itemTableur.id_commune ) {
                    itemLibelle = itemTableur.libelle+' : ' ;
                  }else{
                    itemLibelle = '';
                  }
                  console.log(itemTableur, idHtml);
                  console.log(idHtml, $("#" + idHtml), $("#" + idHtml).offset())
                 //tablur
                 if ($("#" + idHtml) && $("#" + idHtml).length > 0) {
                  $("#" + idHtml).css({ "background-color": "#f1f0eb" });
                  var elmnt = document.getElementById(idHtml);
                  // elmnt.scrollIntoView();
                }


                //highcharts graph
                this.hoverGraph(identiteVectorLayer, itemTableur, true);

                this.hoverGraph(identiteVectorLayer.indecator, itemTableur, true);
                //hover Tableur
                this.hoverValeurLabel(e, identiteVectorLayer , identiteVectorLayer , itemLibelle);

                // this.hoverValeurLabelCroisemment(identiteVectorLayer ,  'croisement 1', e);
                }
                if (identiteVectorLayer && identiteVectorLayer.indecator && identiteVectorLayer.composentIdentiteLayerList.length > 0 ) {
                    console.log("have two indicateur", identiteVectorLayer.composentIdentiteLayerList)
                    var indecator = identiteVectorLayer.indecator;
                    //if(indecator)
                    if (indecator) {
                      var idHtml1 = ((itemTableur.id_province) ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_province :
                                    (itemTableur.id_commune ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_commune :
                                    (itemTableur.id_unite_territorial ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_unite_territorial :
                                    (itemTableur.id_cercle_pref_arr ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_cercle_pref_arr :
                                    (itemTableur.id_douar_centreurbain ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_douar_centreurbain :
                                    (itemTableur.id_region ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id_region :
                                    (itemTableur.id) ? 'hover-' + identiteVectorLayer.indecator.id + '-' + itemTableur.id : ''))))))
                     if ($("#" + idHtml1) && $("#" + idHtml1).length > 0) {
                      $("#" + idHtml1).css({ "background-color": "#f1f0eb" });
                      var elmnt1 = document.getElementById(idHtml1);
                      // elmnt1.scrollIntoView();
                      $('#prent-hover-'+identiteVectorLayer.indecator.id+' table tbody').animate({
                        scrollTop: $("#"+idHtml1).offset().top
                      });
                    }
                    }

                    var indecatortow = identiteVectorLayer.composentIdentiteLayerList[0].indecator;
                    if (indecatortow) {
                      var idHtml2 = ((itemTableur.id_province) ? 'hover-' + indecatortow.id + '-' + itemTableur.id_province :
                                    (itemTableur.id_commune ? 'hover-' + indecatortow.id + '-' + itemTableur.id_commune :
                                    (itemTableur.id_unite_territorial ? 'hover-' + indecatortow.id + '-' + itemTableur.id_unite_territorial :
                                    (itemTableur.id_cercle_pref_arr ? 'hover-' + indecatortow.id + '-' + itemTableur.id_cercle_pref_arr :
                                    (itemTableur.id_douar_centreurbain ? 'hover-' + indecatortow.id + '-' + itemTableur.id_douar_centreurbain :
                                    (itemTableur.id_region ? 'hover-' + indecatortow.id + '-' + itemTableur.id_region :
                                    (itemTableur.id) ? 'hover-' + indecatortow.id + '-' + itemTableur.id : ''))))))
                        if ($("#" + idHtml2) && $("#" + idHtml2).length > 0) {
                            $("#" + idHtml2).css({ "background-color": "#f1f0eb" });
                            var elmnt2 = document.getElementById(idHtml2);
                            // elmnt2.scrollIntoView();
                            $('#prent-hover-'+indecatortow.id+' table tbody').animate({
                              scrollTop: $("#"+idHtml2).offset().top
                            });
                        }
                    }
                    console.log(identiteVectorLayer);
                    //highcharts graph
                    //this.hoverGraph(identiteVectorLayer, itemTableur, true);
                    this.hoverGraph(identiteVectorLayer.indecator, itemTableur, true);
                    this.hoverGraph(identiteVectorLayer.composentIdentiteLayerList[0], itemTableur, true);
                    this.hoverValeurLabel(e, identiteVectorLayer , identiteVectorLayer , itemLibelle);
                    // this.hoverValeurLabelCroisemment(identiteVectorLayer , 'croisement 2', e);

                }

                //sub List tablur
                // if (identiteVectorLayer.composentIdentiteLayerList && identiteVectorLayer.composentIdentiteLayerList.length > 0) {
                //     var indecator = identiteVectorLayer.composentIdentiteLayerList[0].indecator;
                //     //if(indecator)
                //     idHtml = (itemTableur.id_region) ? 'hover-' + indecator.id + '-' + itemTableur.id_region : ((itemTableur.id_province) ? 'hover-' + indecator.id + '-' + itemTableur.id_province : ((itemTableur.id_commune) ? 'hover-' + indecator.id + '-' + itemTableur.id_commune :
                //         ((itemTableur.id) ? 'hover-' + indecator.id + '-' + itemTableur.id : '')));
                //     if ($("#" + idHtml) && $("#" + idHtml).length > 0) {
                //         $("#" + idHtml).css({ "background-color": "#f1f0eb" });
                //         var elmnt = document.getElementById(idHtml);
                //         elmnt.scrollIntoView();
                //     }
                //     //highcharts graph
                //     this.hoverGraph(identiteVectorLayer.composentIdentiteLayerList[0], itemTableur, true);
                //     this.hoverValeurLabel(e, identiteVectorLayer.composentIdentiteLayerList[0].indecator);
                //     this.hoverValeurLabelCroisemment(identiteVectorLayer , 'croisement 2');
                // }
            }

        });
        myExtObject.map.addInteraction(identiteVectorLayer.selectPointerSelectFeature);
    }
    hoverValeurLabel(e, currentIndecator , identiteVectorLayer , itemLibelle) {
        let feature = (e.selected && e.selected[0] && (e.selected[0].H ? e.selected[0].H  : e.selected[0].values_ )) ? e.selected[0] : e;
        if (feature) {

            var getCenterOfExtent = (Extent) => {
                var X = Extent[0] + (Extent[2] - Extent[0]) / 2;
                var Y = Extent[1] + (Extent[3] - Extent[1]) / 2;
                return [X, Y];
            }
            var idzoneListValeur = (zone) => ((zone.province && zone.province.id) ? zone.province.id : ((zone.commune && zone.commune.id) ? zone.commune.id :
            ((zone.uniteTerritorial && zone.uniteTerritorial.id) ? zone.uniteTerritorial.id :
            ((zone.cerclePrefArr && zone.cerclePrefArr.id) ? zone.cerclePrefArr.id :
            ((zone.douarCentreUrb && zone.douarCentreUrb.id) ? zone.douarCentreUrb.id :
            (zone.region && zone.region.id) ? zone.region.id : null)))))
            var idzoneInMap = (zone) => (zone.id_province ? zone.id_province :
             (zone.id_commune ? zone.id_commune :
             (zone.id_unite_territorial ? zone.id_unite_territorial :
             (zone.id_cercle_pref_arr ? zone.id_cercle_pref_arr :
             (zone.id_douar_centreurbain ? zone.id_douar_centreurbain :
             (zone.id_region ? zone.id_region : (zone.id) ? zone.id : ""))))));

            myExtObject.addOverlayInMap();
            var tooltip = $('#tooltip').find("#centant-tooltip");
            $('#tooltip').css({ 'display': 'block' })
            var i = 0;
            var idregion = idzoneInMap((feature.H) ? feature.H : (feature.values_ ? feature.values_ : feature.getProperties()));
            var format = (n) => {

                if (isNaN(n)) { //tester si la valeur est n'exist pas
                    var p = "?";
                    return p
                } else {
                    var x = Number(n);
                    var p = x + "";
                    if (p.indexOf(".") > -1) {
                        p = Number.parseFloat(x).toFixed(2);
                    }
                    //p = new Intl.NumberFormat().format(Number(p));
                    return p
                        .replace('.', ',') // replace decimal point character with ,
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
                }
            }
            // var indicator1 = false ;
            // var indicator2 = false ;
            var itemlibeeleTooltip = '' ;
            if (itemLibelle && itemLibelle !== undefined) {
              itemlibeeleTooltip = itemLibelle ;
            }
            if (currentIndecator && currentIndecator.indecator && currentIndecator.indecator.valeurIndicateurList && currentIndecator.indecator.valeurIndicateurList.length > 0)  {

                for (i = 0; i < currentIndecator.indecator.valeurIndicateurList.length; i++) {
                      // console.log("e : ", idregion, idzoneListValeur(currentIndecator.indecator.valeurIndicateurList[i]))
                    if (idregion == idzoneListValeur(currentIndecator.indecator.valeurIndicateurList[i])) {

                        if (currentIndecator.indecator.unite) {

                            var n1 = Number(currentIndecator.indecator.valeurIndicateurList[i].valeur);
                            // console.log("valeur indicateur 1 : " , n1)
                            // console.log("valeur is : ", n)
                            tooltip.html(itemlibeeleTooltip+format(Number.parseFloat(n1).toFixed(2)) + ' ' + currentIndecator.indecator.unite.label);
                            var formatedSimple = itemlibeeleTooltip+format(Number.parseFloat(n1).toFixed(2)) + ' ' + currentIndecator.indecator.unite.label ;
                        } else {
                            var n1 = Number(currentIndecator.indecator.valeurIndicateurList[i].valeur);
                            // console.log("valeur indicateur 1 : " , n1)
                            tooltip.html(itemlibeeleTooltip+format(Number.parseFloat(n1).toFixed(2)));
                            var formatedSimple = itemlibeeleTooltip+format(Number.parseFloat(n1).toFixed(2));

                        }
                        myExtObject.overlay.setPosition(getCenterOfExtent(feature.getGeometry().getExtent()));
                        break;
                    }
                }

            }
            if (identiteVectorLayer !== undefined && identiteVectorLayer.composentIdentiteLayerList !== undefined && identiteVectorLayer.composentIdentiteLayerList[0] !== undefined && identiteVectorLayer.composentIdentiteLayerList[0].indecator != undefined && identiteVectorLayer.composentIdentiteLayerList[0].indecator.modeRepresentation !== undefined && identiteVectorLayer.composentIdentiteLayerList.length > 0 ) {
              console.log("go to next step 2 ")
              // var indecator = identiteVectorLayer.composentIdentiteLayerList[0].indecator;
              for (i = 0; i < identiteVectorLayer.composentIdentiteLayerList[0].indecator.valeurIndicateurList.length; i++) {
                //   console.log("e : ", idregion, idzoneListValeur(currentIndecator.valeurIndicateurList[i]))
                if (idregion == idzoneListValeur(identiteVectorLayer.composentIdentiteLayerList[0].indecator.valeurIndicateurList[i])) {

                    if (identiteVectorLayer.composentIdentiteLayerList[0].indecator.unite) {

                        var n2 = Number(identiteVectorLayer.composentIdentiteLayerList[0].indecator.valeurIndicateurList[i].valeur);
                        var valueformat1 = format(Number.parseFloat(n2).toFixed(2)) + ' ' + identiteVectorLayer.composentIdentiteLayerList[0].indecator.unite.label ;
                        var valueformated
                        // console.log("valeur indicateur 2 : " , valueformat1)
                        // console.log("valeur is : ", n)
                       var order = (identiteVectorLayer.composentIdentiteLayerList[0].indecator.modeRepresentation != "DEGRADE_COULEUR")? 2 : 1;
                       if(order == 2) {
                        valueformated = '<div>'+'1) '+formatedSimple + '</div>'+ '<div>'+'2) '+  valueformat1+'</div>'
                       }else {
                        valueformated = '<div>'+'1) '+valueformat1 + '</div>'+ '<div>'+'2) '+ formatedSimple+'</div>'
                       }

                        tooltip.html(valueformated);
                    } else {
                        var n2 = Number(identiteVectorLayer.composentIdentiteLayerList[0].indecator.valeurIndicateurList[i].valeur);
                        var valueformat1 = format(Number.parseFloat(n2).toFixed(2));
                        // console.log("valeur indicateur 2 : " , valueformat1)
                        var valueformated;
                        var order = (identiteVectorLayer.composentIdentiteLayerList[0].indecator.modeRepresentation != "DEGRADE_COULEUR")? 2 : 1;
                        if(order == 2){
                         valueformated = '<div>'+'1) '+formatedSimple + '</div>'+ '<div>'+'2) '+  valueformat1+'</div>'
                        }else{
                         valueformated = '<div>'+'1) '+valueformat1 + '</div>'+ '<div>'+'2) '+ formatedSimple+'</div>'
                        }
                        tooltip.html(valueformated);
                    }
                    myExtObject.overlay.setPosition(getCenterOfExtent(feature.getGeometry().getExtent()));
                    break;
                }
            }
            }
            // if ( identiteVectorLayer.composentIdentiteLayerList && identiteVectorLayer.composentIdentiteLayerList.length > 0) {
            //   // var indecator = identiteVectorLayer.composentIdentiteLayerList[0].indecator;
            //   for (i = 0; i <= identiteVectorLayer.composentIdentiteLayerList[0].indecator.valeurIndicateurList.length - 1; i++) {
            //     //   console.log("e : ", idregion, idzoneListValeur(currentIndecator.valeurIndicateurList[i]))
            //     if (idregion == idzoneListValeur(identiteVectorLayer.composentIdentiteLayerList[0].indecator.valeurIndicateurList[i])) {

            //         if (identiteVectorLayer.composentIdentiteLayerList[0].indecator.unite) {

            //             var n2 = Number(identiteVectorLayer.composentIdentiteLayerList[0].indecator.valeurIndicateurList[i].valeur);
            //             console.log("valeur indicateur 2 : " , n2)
            //             var valueformat1 = format(Number.parseFloat(n).toFixed(2)) + ' ' + identiteVectorLayer.composentIdentiteLayerList[0].indecator.unite.label ;
            //             // console.log("valeur is : ", n)
            //             // tooltip.html(format(Number.parseFloat(n).toFixed(2)) + ' ' + identiteVectorLayer.composentIdentiteLayerList[0].indecator.unite.label);
            //         } else {
            //             var n2 = Number(identiteVectorLayer.composentIdentiteLayerList[0].indecator.valeurIndicateurList[i].valeur);
            //             var valueformat1 = format(Number.parseFloat(n).toFixed(2)) + ' ' + identiteVectorLayer.composentIdentiteLayerList[0].indecator.unite.label ;
            //             console.log("valeur indicateur 2 : " , n2)
            //             // tooltip.html(format(Number.parseFloat(n).toFixed(2)));
            //         }
            //         myExtObject.overlay.setPosition(getCenterOfExtent(feature.getGeometry().getExtent()));
            //         break;
            //     }
            // }
            // /// add tow format togothe
            // }

        }
        else {
          $('#tooltip').css({'display': 'none'});
        }
    }
    hoverValeurLabelCroisemment(identiteVectorLayer , mode, e){

      // console.log("Valeur Indicateur "+mode , identiteVectorLayer);
      let feature = (e.selected && e.selected[0] && (e.selected[0].H  ? e.selected[0].H : e.selected[0].values_))? e.selected[0] : e;
      console.log(feature);
      if (feature) {

          var getCenterOfExtent = (Extent) => {
              var X = Extent[0] + (Extent[2] - Extent[0]) / 2;
              var Y = Extent[1] + (Extent[3] - Extent[1]) / 2;
              return [X, Y];
          }
          var idzoneListValeur = (zone) => ((zone.province && zone.province.id) ? zone.province.id : ((zone.commune && zone.commune.id) ? zone.commune.id :
          ((zone.uniteTerritorial && zone.uniteTerritorial.id) ? zone.uniteTerritorial.id :
          ((zone.cerclePrefArr && zone.cerclePrefArr.id) ? zone.cerclePrefArr.id :
          ((zone.douarCentreUrb && zone.douarCentreUrb.id) ? zone.douarCentreUrb.id :
          (zone.region && zone.region.id) ? zone.region.id : null)))));

          var idzoneInMap = (zone) => ((zone.id_province) ? zone.id_province : ((zone.id_commune) ? zone.id_commune :(
           (zone.id_unite_territorial) ? zone.id_unite_territorial :
           (zone.id_cercle_pref_arr) ? zone.id_cercle_pref_arr :
           (zone.id_douar_centreurbain ? zone.id_douar_centreurbain :
           ((zone.id) ? zone.id : (zone.id_region) ? zone.id_region : "")))));

           myExtObject.addOverlayInMap();
          $('#tooltip').parent().css({
              zIndex: 1
          })
          var tooltip = $('#tooltip').find("#centant-tooltip");
          $('#tooltip').css({ 'display': 'block' })
          var i = 0;
          var idregion = idzoneInMap((feature.H) ? feature.H : (feature.values_ ? feature.values_ : feature.getProperties()));
          var format = (n) => {

            if (isNaN(n)) { //tester si la valeur est n'exist pas
                var p = "?";
                return p
            } else {
                var x = Number(n);
                var p = x + "";
                if (p.indexOf(".") > -1) {
                    p = Number.parseFloat(x).toFixed(2);
                }
                //p = new Intl.NumberFormat().format(Number(p));
                return p
                    .replace('.', ',') // replace decimal point character with ,
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
            }
        }
        if (identiteVectorLayer && identiteVectorLayer.indecator.valeurIndicateurList && identiteVectorLayer.indecator.valeurIndicateurList.length > 0) {

          for (i = 0; i <= identiteVectorLayer.indecator.valeurIndicateurList.length - 1; i++) {
              //   console.log("e : ", idregion, idzoneListValeur(currentIndecator.valeurIndicateurList[i]))
              if (idregion == idzoneListValeur(identiteVectorLayer.indecator.valeurIndicateurList[i])) {

                  if (identiteVectorLayer.indecator.unite) {
                      var n = Number(identiteVectorLayer.indecator.valeurIndicateurList[i].valeur);
                      // console.log("valeur is : ", n)
                      tooltip.append(format(Number.parseFloat(n).toFixed(2)) + ' ' + currentIndecator.unite.label);
                  } else {
                      var n = Number(identiteVectorLayer.indecator.valeurIndicateurList[i].valeur);
                      tooltip.append(format(Number.parseFloat(n).toFixed(2)));
                  }
                  myExtObject.overlay.setPosition(getCenterOfExtent(feature.getGeometry().getExtent()));
                  break;
              }
          }
      }
    }
    else {

      $('#tooltip').css({'display': 'none'});
    }

  }
    hoverGraph(indecator, itemTableur, show) {
        if ($('#indecatorS-' + indecator.id) && $('#indecatorS-' + indecator.id).length > 0) {
            var chart = $('#indecatorS-' + indecator.id).highcharts();
            if (chart && chart.series && chart.series.length > 0) {
                var arrayCol = chart.series[0].data;

                if (chart.series[0].data && chart.series[0].data.length > 0) {
                    var idzone = ((itemTableur.id_province) ? itemTableur.id_province :
                                (itemTableur.id_commune ? itemTableur.id_commune :
                                (itemTableur.id_unite_territorial ? itemTableur.id_unite_territorial :
                                (itemTableur.id_cercle_pref_arr ? itemTableur.id_cercle_pref_arr :
                                (itemTableur.id_douar_centreurbain ? itemTableur.id_douar_centreurbain :
                                (itemTableur.id_region ? itemTableur.id_region :
                                (itemTableur.id) ? itemTableur.id : ''))))))
                    var idzoneGraph = (zone) => ((zone.province && zone.province.id) ? zone.province.id : ((zone.commune && zone.commune.id) ? zone.commune.id :
                                                ((zone.uniteTerritorial && zone.uniteTerritorial.id) ? zone.uniteTerritorial.id :
                                                ((zone.cerclePrefArr && zone.cerclePrefArr.id) ? zone.cerclePrefArr.id :
                                                ((zone.douarCentreUrb && zone.douarCentreUrb.id) ? zone.douarCentreUrb.id :
                                                (zone.region && zone.region.id) ? zone.region.id : null)))));

                    if (idzone) {
                        var pos = arrayCol.map(function(item) {
                            return (item.valeurIndector) ? idzoneGraph(item.valeurIndector) : null
                        }).indexOf(idzone);
                        if (pos > -1) {
                            arrayCol[pos].select(show, true);
                        }
                    }
                }
            }
        }
    }

    exploreRegToPrv(identiteVectorLayer) {

        identiteVectorLayer.selectPointerMove1 = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            layers: [identiteVectorLayer.vectorLayer]
        });
        myExtObject.map.addInteraction(identiteVectorLayer.selectPointerMove1);
        identiteVectorLayer.selectFeature = new ol.interaction.Select({
            condition: ol.events.condition.doubleClick,
            layers: [identiteVectorLayer.vectorLayer],

        });
        myExtObject.map.addInteraction(identiteVectorLayer.selectFeature);

        identiteVectorLayer.selectFeature.on('select', (e) => {
            // myExtObject.controlMapSevice.addButtonBack(identiteVectorLayer.indecator);
            this.explorePrvToCmn(e);
        });
    }

    //explore juste layer prv to cmn
    explorePrvToCmnExplore(identiteVectorLayer) {
      console.log(identiteVectorLayer);
      console.log('clicked drilldown started');
      identiteVectorLayer.selectPointerMove2 = new ol.interaction.Select({
          condition: ol.events.condition.pointerMove,
          layers: [identiteVectorLayer.vectorLayer]
      });
      myExtObject.map.addInteraction(identiteVectorLayer.selectPointerMove2);
      identiteVectorLayer.selectFeature2 = new ol.interaction.Select({
          condition: ol.events.condition.doubleClick,
          layers: [identiteVectorLayer.vectorLayer],

      });
      myExtObject.map.addInteraction(identiteVectorLayer.selectFeature2);

      identiteVectorLayer.selectFeature2.on('select', (e) => {
          this.exploreCmn(e);
      });
    }

    explorePrvToCmn(e) {
        if (e.selected && e.selected[0] && (e.selected[0].H || e.selected[0].values_) && myExtObject.currentIndecator && myExtObject.currentIndecator.id) {
            var id_region = (e.selected[0].H) ? e.selected[0].H.id_region : (e.selected[0].values_ ? e.selected[0].values_.id_region : null);
            console.log(id_region);
            var identiteVectorLayer = myExtObject.findIdentiteVectorLayer(myExtObject.currentIndecator.id);

            //get layer from geoserver
            if (typeof(id_region) != "undefined" && id_region > 0 && identiteVectorLayer) {
              myExtObject.regionNiveauId = id_region ;
              // myExtObject.provinceNiveauId = null ;
                myExtObject.ref_Component.loadValeurIndectorOfRegion(identiteVectorLayer.id, (id_region)).subscribe(list => {
                    var data_prv = list;
                    console.log(list);
                    if (list) {
                        myExtObject.controlMapSevice.addButtonBack(identiteVectorLayer.indecator);
                        identiteVectorLayer.val_tab2 = [];
                        identiteVectorLayer.ids2 = [];
                        identiteVectorLayer.nom2 = [];
                        for (var i = 0; i < data_prv.length; i++) {
                            identiteVectorLayer.val_tab2.push(data_prv[i].valeur);
                            identiteVectorLayer.nom2.push(data_prv[i].province.libelle);
                            identiteVectorLayer.ids2.push(data_prv[i].province.id);
                        }

                        identiteVectorLayer.vectorLayerProvence = this.uniqueIndecatorDegradeSevice.createLayerPrv(id_region, identiteVectorLayer, data_prv);
                        console.log(identiteVectorLayer.vectorLayerProvence);
                        myExtObject.map.removeLayer(identiteVectorLayer.vectorLayer);
                        identiteVectorLayer.vectorLayer = identiteVectorLayer.vectorLayerProvence;
                        myExtObject.map.addLayer(identiteVectorLayer.vectorLayer);

                        var url;

                        if (identiteVectorLayer.indecator && identiteVectorLayer.indecator.decoupage && identiteVectorLayer.indecator.decoupage.id == 1) {
                            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=region_id:' + id_region + '&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + '&outputFormat=application%2Fjson';
                        } else {
                            url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=region_id:' + id_region + '&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + '&outputFormat=application%2Fjson';
                        }
                        // console.log(url);
                        // myExtObject.controlMapSevice.showLabel(url);
                        var geom = e.selected[0].getGeometry();
                        var view = myExtObject.map.getView();
                        view.fit(geom, myExtObject.map.getSize());
                        //myExtObject.map.getView().setZoom(myExtObject.map.getView().getZoom() + 2);
                        identiteVectorLayer.level = 2;

                        // myExtObject.map.getView().setCenter(ol.proj.transform([e.mapBrowserEvent.coordinate[1], e.mapBrowserEvent.coordinate[0]], 'EPSG:4326', 'EPSG:3857'));
                        // myExtObject.map.getView().setZoom(5);
                        this.removeAllInteration();

                        // myExtObject.map.removeInteraction(identiteVectorLayer.selectPointerMove1)
                        identiteVectorLayer.selectPointerMove2 = new ol.interaction.Select({
                            condition: ol.events.condition.pointerMove,
                            layers: [identiteVectorLayer.vectorLayer]
                        });

                        myExtObject.map.addInteraction(identiteVectorLayer.selectPointerMove2);
                        identiteVectorLayer.selectPointerMove2.on('select', (e) => {

                        })

                        myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);

                        // myExtObject.map.removeInteraction(identiteVectorLayer.selectFeature)
                        identiteVectorLayer.selectFeature2 = new ol.interaction.Select({
                            condition: ol.events.condition.doubleClick,
                            layers: [identiteVectorLayer.vectorLayer]
                        });
                        myExtObject.map.addInteraction(identiteVectorLayer.selectFeature2);
                        identiteVectorLayer.selectFeature2.on('select', (e) => {
                            this.exploreCmn(e);
                        })
                    }
                })
            }
            myExtObject.visibleSurCartIndectorALL(false, identiteVectorLayer.id);
            identiteVectorLayer.selectFeature.getFeatures().clear();
        }

    }

    exploreCmn(e) {
      console.log(e);
        if (e.selected && e.selected[0] && (e.selected[0].H || e.selected[0].values_) && myExtObject.currentIndecator && myExtObject.currentIndecator.id) {

            var id_province = (e.selected[0].H) ? e.selected[0].H.id_province : (e.selected[0].values_ ? e.selected[0].values_.id_province:  null);
            console.log(id_province);
            var identiteVectorLayer = myExtObject.findIdentiteVectorLayer(myExtObject.currentIndecator.id); //get layer from geoserver

            if (typeof(id_province) != "undefined" && id_province > 0 && identiteVectorLayer) {
              myExtObject.provinceNiveauId = id_province ;
              // myExtObject.regionNiveauId = null ;
                myExtObject.ref_Component.loadValeurIndectorOfPrv(identiteVectorLayer.id, (e.selected[0].H ? e.selected[0].H.id_province : e.selected[0].values_.id_province)).subscribe(list => {
                    var data_cmn = list;
                    if (list) {
                        myExtObject.controlMapSevice.addButtonBack(identiteVectorLayer.indecator);
                        identiteVectorLayer.val_tab4 = [];
                        identiteVectorLayer.ids4 = [];
                        identiteVectorLayer.nom4 = [];
                        for (var i = 0; i < data_cmn.length; i++) {
                            identiteVectorLayer.val_tab4.push(data_cmn[i].valeur);
                            identiteVectorLayer.nom4.push(data_cmn[i].commune.libelle);
                            identiteVectorLayer.ids4.push(data_cmn[i].commune.id);
                        }

                        identiteVectorLayer.vectorLayerCmn = this.uniqueIndecatorDegradeSevice.create_cmn(id_province, identiteVectorLayer, data_cmn);


                        //myExtObject.map.getView().fit(extent, myExtObject.map.getSize()); //zomme la zone
                        myExtObject.map.removeLayer(identiteVectorLayer.vectorLayer);
                        identiteVectorLayer.vectorLayer = identiteVectorLayer.vectorLayerCmn;
                        myExtObject.map.addLayer(identiteVectorLayer.vectorLayer);
                        myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
                        var url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&viewparams=province_id:' + id_province + '&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCmnToPrv + '&outputFormat=application%2Fjson';
                        console.log(url)
                        /**
                         *
                         */
                        // myExtObject.controlMapSevice.showLabel(url);
                        /***
                         *
                         */
                        var geom = e.selected[0].getGeometry();
                        var view = myExtObject.map.getView();
                        view.fit(geom, myExtObject.map.getSize());
                        identiteVectorLayer.level = 1;
                        identiteVectorLayer.selectFeature2.getFeatures().clear();
                    }
                })
            }
        }

    }

    removeAllInteration() {
        console.log('removed');
        if (myExtObject.vectorLayerList && myExtObject.vectorLayerList.length > 0) {
            for (var i = 0; i <= myExtObject.vectorLayerList; i++) {
                if (myExtObject.vectorLayerList[i].selectPointerMove1) myExtObject.map.removeInteraction(myExtObject.vectorLayerList[i].selectPointerMove1);
                if (myExtObject.vectorLayerList[i].selectPointerMove2) myExtObject.map.removeInteraction(myExtObject.vectorLayerList[i].selectPointerMove2);
                if (myExtObject.vectorLayerList[i].selectFeature) myExtObject.map.removeInteraction(myExtObject.vectorLayerList[i].selectFeature);
                if (myExtObject.vectorLayerList[i].selectFeature2) myExtObject.map.removeInteraction(myExtObject.vectorLayerList[i].selectFeature2);
            }
        }
        var interactions = myExtObject.map.getInteractions();
        for (var i = 0; i < interactions.getLength(); i++) {
            var interaction = interactions.item(i);
            if (interaction instanceof ol.interaction.Select) {
                myExtObject.map.removeInteraction(interaction);
                // // console.log(interaction)
            }
        }
    }
//need
    zommeOut(id) {
        var index = myExtObject.vectorLayerList.findIndex(element => element.id === id);
        if (index > -1 && myExtObject.vectorLayerList[index].level == 1) {
            this.removeAllInteration();
            myExtObject.map.removeLayer(myExtObject.vectorLayerList[index].vectorLayer);
            myExtObject.vectorLayerList[index].vectorLayer = myExtObject.vectorLayerList[index].vectorLayerProvence
            myExtObject.map.addLayer(myExtObject.vectorLayerList[index].vectorLayer);
            myExtObject.exploreCartSevice.pointerMoveInMap(myExtObject.vectorLayerList[index]);
            myExtObject.vectorLayerList[index].level = 2;
            this.legend.addLegend(myExtObject.vectorLayerList[index], 'serie2');
            myExtObject.map.addInteraction(myExtObject.vectorLayerList[index].selectPointerMove2);
            myExtObject.map.addInteraction(myExtObject.vectorLayerList[index].selectFeature2);
            myExtObject.map.render();

            var extent = myExtObject.vectorLayerList[index].vectorLayer.getSource().getExtent();
            myExtObject.map.getView().fit(extent, myExtObject.map.getSize());
            myExtObject.ref_Component.changerListValeurIndecator(id, null, null, 'zoom_out_pvn');

            var url = myExtObject.vectorLayerList[index].vectorLayer.getSource().Z;
            console.log("zoom out", myExtObject.vectorLayerList[index].vectorLayer, url)
            // myExtObject.controlMapSevice.showLabel(url);
            // // console.log(geom)
            /* var view = myExtObject.map.getView();
            view.fit(geom, myExtObject.map.getSize());
            myExtObject.map.getView().setZoom(myExtObject.map.getView().getZoom() + 2); */
        } else if (index > -1 && myExtObject.vectorLayerList[index].level == 2) {
            this.removeAllInteration();
            myExtObject.map.removeLayer(myExtObject.vectorLayerList[index].vectorLayer);
            myExtObject.vectorLayerList[index].vectorLayer = myExtObject.vectorLayerList[index].vectorLayerRegion;
            myExtObject.map.addLayer(myExtObject.vectorLayerList[index].vectorLayer);
            myExtObject.exploreCartSevice.pointerMoveInMap(myExtObject.vectorLayerList[index]);
            myExtObject.vectorLayerList[index].level = 3;
            this.legend.addLegend(myExtObject.vectorLayerList[index], 'serie');
            myExtObject.map.addInteraction(myExtObject.vectorLayerList[index].selectPointerMove1);
            myExtObject.map.addInteraction(myExtObject.vectorLayerList[index].selectFeature);
            myExtObject.map.render()
            myExtObject.ref_Component.changerListValeurIndecator(id, null, null, 'zoom_out_reg');
            var url = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0' +
                '&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg + '&outputFormat=application/json';


            // myExtObject.controlMapSevice.showLabel(url);
            var extent = myExtObject.vectorLayerList[index].vectorLayer.getSource().getExtent();
            // myExtObject.map.getView().fit(extent, myExtObject.map.getSize());
            /*   myExtObject.map.setView({center: ol.proj.fromLonLat(myExtObject.homePosition),
               zoom: myExtObject.zoomValeur,
               minZoom: 4,
               maxZoom: 10}) */
            myExtObject.map.getView().setCenter(ol.proj.transform(myExtObject.homePosition, 'EPSG:4326', 'EPSG:3857'));
            myExtObject.map.getView().setZoom(myExtObject.zoomValeur);

            myExtObject.visibleSurCartIndectorALL(true)
        }
    }
}

var ExploreCartSeviceSingloton = (function() {

    var instance;

    function createInstance() {
        var object = new ExploreCartSevice();
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
