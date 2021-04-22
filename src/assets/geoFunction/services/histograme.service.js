class HistogrameSevice {

    constructor() {

    }
    /// param 2 , listMaxValueIndicateur
    createoverlayDivInCenter(listDesIndicateursSelectioonnee , listMaxValueIndicateur, echelle ) {
        ////////////////

        var checkHistograme = true ;
        myExtObject.controlMapSevice.showLabel(null, "remove");
        myExtObject.desctory(); //vider la iste vectorLayerList
        var indecator = listDesIndicateursSelectioonnee[0];
        var urlvector;
        var valeurRectTBR = [];
        let type = "",
            entite;
        if ( echelle == "region") {
          urlvector = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheReg +"&viewparams=decoupage_id:" +indecator.decoupage.id+'&outputFormat=application/json';
          entite = echelle
        }
        if ( echelle == "province") {
          urlvector = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + indecator.decoupage.id;
          entite = echelle
        }
        if ( echelle == "commune") {
          urlvector = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheCmnToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + indecator.decoupage.id;
          entite = echelle
        }
        if ( echelle == "cerclePrefArr") {
            type = listDesIndicateursSelectioonnee[0].valeurIndicateurList[0].cerclePrefArr.type
            urlvector = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheCerPrefArr + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";type:" + type;
            entite = 'cercle_pref_arr'
        }
        if ( echelle == "uniteTerritorial") {
            type = listDesIndicateursSelectioonnee[0].valeurIndicateurList[0].uniteTerritorial.type
            let categorie = listDesIndicateursSelectioonnee[0].valeurIndicateurList[0].uniteTerritorial.categorie.id.toString();
            urlvector = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.coucheUntToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";categorie_id:"+ categorie;
            entite = 'unite_territorial'
        }
        if ( echelle == "douarCentreUrb") {
            type = listDesIndicateursSelectioonnee[0].valeurIndicateurList[0].douarCentreUrb.type
            urlvector = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cocheDouarCentreUrb + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id+ ";type:" + type;
            entite = 'douar_centreurbain'
        }


        // urlvector = myExtObject.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + myExtObject.ref_Component.settings.geo.dataBase + ':' + myExtObject.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions+";decoupage_id:" + indecator.decoupage.id;
        var vectorSourceRg = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: () => {
                return urlvector;
            },
            strategy: ol.loadingstrategy.bbox
        });
        // myExtObject.ref_Component.addBusy();//add bysy while histogramme is on...

        var identiteVectorLayer = IdentiteLayer.getInstance();
        var vectorLayer = new ol.layer.Vector({ updateWhileInteracting: false, source: vectorSourceRg });
        myExtObject.map.addLayer(vectorLayer);
        identiteVectorLayer.indecator = indecator;
        identiteVectorLayer.vectorLayer = vectorLayer;
        identiteVectorLayer.listOverlay = [];
        identiteVectorLayer.composentIdentiteLayerList = listDesIndicateursSelectioonnee;
        myExtObject.vectorLayerList.push(identiteVectorLayer); //remplir la liste vectorLayerList
        myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);

        var features = vectorSourceRg.getFeatures();
        var ResFeatures = [];
        var polygon;
        var nb;
        var data = [];
            // for (let item of listDesIndicateursSelectioonnee)
            //     console.log(item.valeurIndicateurList);

        // var vals = JSON.stringify(listDesIndicateursSelectioonnee[0]);
        // console.log(vals);
        // console.log(console.log(Object.keys(listDesIndicateursSelectioonnee[0])));
        // for(var i=0, k=0;i<listDesIndicateursSelectioonnee[0].valeurIndicateurList.length;i++,k++)
        //     for(var j=0; j< features.length;j++)
        //         if(listDesIndicateursSelectioonnee[i].valeurIndicateurList[j].province.libelle == features[j].H.libelle){
        //                 polygon = turf.polygon(features[j].getGeometry().coordinates);
        //                 center = turf.centroid(polygon);
        //                 console.log(features[j].getGeometry());

        //                 for(var j=0; j< listDesIndicateursSelectioonnee[i].valeurIndicateurList.length;j++){
        //                     data.push(listDesIndicateursSelectioonnee[i].valeurIndicateurList[j]);
        //                     n = Math.round(8*Math.random());
        //                     nb += n;
        //                 }

        //                 ResFeatures[k] = new ol.Feature({
        //                     geometry : new ol.geom.Point(center.geometry.coordinates),
        //                     data: data,
        //                     size: nb
        //                 });
        //         }
        // console.log(features);

        vectorSourceRg.on('change', (e) => {
            if(identiteVectorLayer.listOverlay == undefined || identiteVectorLayer.listOverlay == null  || identiteVectorLayer.listOverlay.length == 0) {
           // console.log("vectorSourceRg.getFeatures() : ", vectorSourceRg.getFeatures())
              console.log(vectorSourceRg.getState());
              if (vectorSourceRg.getState() == 'ready') {
                  var features = vectorSourceRg.getFeatures();
                  // console.log(features);
                  var listOverlay = [];
                  var colors = ['#B18904', '#21610B', '#610B4B', '#0404B4', '#6E6E6E', '#81F7F3', '#FF9655', '#FFF263', '#6AF9C4', '#003300', '#adc2eb', '#ffffcc', '#a3a3c2'];
                  //was added for chart in legend
                  // var listRegionID = [] ;
                  var heightValues = [];
                  var histrogramValues = [] ;
                  var uniteValue = "";
                  var i = 0;
                  for(var i = 0; i < features.length ; i++) {
                      console.log(features[i].values_.libelle);
                      var extent = features[i].getGeometry().getExtent();
                      var center = ol.extent.getCenter(extent);
                      let centerupdate = [];
                      centerupdate[0] = center[0] /* +(center[0]/5) */ ;
                      centerupdate[1] = center[1] /* +(center[1]/12.456801097018786) */ ;
                      // console.log(centerupdate);
                      var divregionid = features[i].values_['id_'+entite];
                      var overlayDivDom = document.getElementById('highchartsDiv' + divregionid);
                      // console.log(overlayDivDom);
                      var innerDiv = $('<div id="overlayDiv' + divregionid + '" style="height: 40px;width: 250px;"></div>');
                      $('#overlayDiv' + divregionid).append(innerDiv);
                      var overlayDiv = new ol.Overlay({
                          //positioning: 'bottom-center',
                          position: centerupdate,
                          element: overlayDivDom,
                          offset: indecator.tabOffsetInHistogramme,
                      });

                      myExtObject.map.addOverlay(overlayDiv);


                      listOverlay.push(overlayDiv);
                  }
                  // console.log(listOverlay.length);

                  var innerDiv = $('<div id="overlayDivLg' + 100 + '" style="height: 40px;width: 250px;"></div>');

                  // var divregionidNewDiv = features[0].values_['id_'+entite];
                  var divtarget = $('#highchartsDivLg100');
                  myExtObject.dividhistograme = '#highchartsDivLg100';
                  divtarget.html('');
                  identiteVectorLayer.listOverlay = listOverlay;
                  // console.log("new target",divtarget.html());
              }
              //was added for chart in legend
            // add functiuon

            var arrrayRect  = []
            var arrryRactHiegh = [] ;
            var arrryRactHieghSorted = [] ;
            var arrrayRectSorted = [] ;
            var valueArrayRect = [];
            var arrayRectY = [];
            var arrayRectX = [];
            var arrryRectHalf = [];
            var sortedhalf = [] ;
            console.log(listMaxValueIndicateur);
            for (let index = 0; index < listMaxValueIndicateur.length; index++) {
                  var rect = $($("#highchartsDiv"+listMaxValueIndicateur[index][echelle+'Id']).find("g.highcharts-series-group")).find("rect").eq(index).clone();
                  var hightRect = $($("#highchartsDiv"+listMaxValueIndicateur[index][echelle+'Id']).find("g.highcharts-series-group")).find("rect").eq(index).height();
                  var hightRectY = $($("#highchartsDiv"+listMaxValueIndicateur[index][echelle+'Id']).find("g.highcharts-series-group")).find("rect").eq(index).attr("y");
                  var hightRectX = $($("#highchartsDiv"+listMaxValueIndicateur[index][echelle+'Id']).find("g.highcharts-series-group")).find("rect").eq(index).attr("x");
                  //console.log(hightRect, hightRectX, hightRectY);
                  arrrayRect.push(rect);
                  arrrayRectSorted.push(rect);
                  arrryRactHiegh.push(hightRect);
                  arrryRactHieghSorted.push(hightRect);
                  valueArrayRect.push(listMaxValueIndicateur[index].valeur);
                  arrayRectY.push(hightRectY);
                  arrayRectX.push(Number(hightRectX));
                  var half = hightRect /2 ;
                  arrryRectHalf.push(half);
                  sortedhalf.push(half)
              }


            // sorting min to max

            sortedhalf.sort(function(a, b) { return b-a });
            arrryRactHieghSorted.sort(function(a, b) { return b-a });
            arrrayRectSorted.sort(function(a, b) { return b.attr('height')-a.attr('height') });
            arrayRectX.sort(function(a, b) { return b-a });
            var maxValueRect = Math.max(...valueArrayRect) ;
            var maxRect = Math.max(...arrryRactHiegh) / 2 ;
            var maxHighRect = Math.max(...arrryRactHiegh) ;
            var maxRectIndex = arrryRactHiegh.indexOf(Math.max(...arrryRactHiegh));
            var maxRectY = Number(arrayRectY[maxRectIndex]);

            myExtObject.yRect  = [] ;
            myExtObject.xRect = [] ;
            myExtObject.sortedRect = [] ;
            $($(divtarget.find("g.highcharts-series-group")).find("rect")).each(function(index) {
                  /* fonction de calcule  centimeters = pixels * 2.54 / 96
                */
                // var centimeteresClone  Number(Number.parseFloat(centimeteres).toFixed(4))

                // max centime
                var centimeteresMax = ( maxValueRect * 2.54) / 96 ;
                // var centimeteresMaxClone = Number(Number.parseFloat(centimeteresMax).toFixed(4));
                /// 100 %
                const valueCent = 100 ;
                /// centimeter
                var centimeteres = (arrryRactHiegh[index] * 2.54) / 96 ;
                var valeurRectCurrent = valueArrayRect[index] ;
                var routeurvalueTRB = ( centimeteres / valeurRectCurrent ) * maxValueRect ;
                // var centimeteresClone  = Number(Number.parseFloat(centimeteres).toFixed(4));
                var xvalue = (valueCent * routeurvalueTRB ) / centimeteresMax ;
                var valueRect = (maxValueRect * xvalue ) / valueCent ;

                valeurRectTBR.push(valueRect);
                // console.log(xvalue, valueRect, valeurRectTBR);


              })


              // var div = '<table class="table "><thead><tr>'+' <th scope="col">#</th>'+'<th scope="col">Max</th>'+'</tr>'+'</thead>'+'</table>';

              // divtarget.css("display"," inline-block");
              // $($('#legend-group-indicateur').find('.geostats-legend-title')).after($(tbl));

              // var targetDiv = $('<div id="div-target" ></div>');
              // targetDiv.append(divtarget);

            //  var uniteValue = (listDesIndicateursSelectioonnee[0] && listDesIndicateursSelectioonnee[0].unite && listDesIndicateursSelectioonnee[0].unite.libelle) ? listDesIndicateursSelectioonnee[0].unite.libelle : "";

            if (listMaxValueIndicateur !== undefined && listMaxValueIndicateur.length > 0 ) {
              for (let index = 0; index < listMaxValueIndicateur.length; index++) {
                // console.log(  $($("#highchartsDiv"+listMaxValueIndicateur[index][echelle+'Id']).find("g.highcharts-series-group")).find("rect").eq(index).height() );
                const value = $($("#highchartsDiv"+listMaxValueIndicateur[index][echelle+'Id']).find("g.highcharts-series-group")).find("rect").eq(index).height();

                // console.log("vals : " ,valeurRectTBR)
                if (valueArrayRect.length > 0) {
                  var option = { y: listMaxValueIndicateur[index].valeur , color: colors[index] };
                  // console.log( option );
                  histrogramValues.push(option)
                }
                heightValues.push(listMaxValueIndicateur[index].valeur);
                // var option = {y: listMaxValueIndicateur[index].valeur , color:colors[index]};
                // histrogramValues.push(option)
              }
              //  console.log(histrogramValues);
              //  console.log("vals : " , histrogramValues)
              var maxValue = Math.max(...heightValues);
              //  console.log("vals",histrogramValues);
              //  console.log(maxValue);
              // histrogramValues.sort(function(a ,b ) {
              //   return a.y - b.y;
              // })
            //  console.log("vals",histrogramValues);
            // console.log("the value hight ")
            // $("#container-charts").height(85)
            // console.log(histrogramValues);
            myExtObject.ref_Component.getHistogramme(heightValues,  histrogramValues);
            // Max to Min
            //  heightValues.sort(function(a, b){return b - a});


            }

            //   console.log("value of id region ordered" , listRegionID)

          }
        })



        ////////////////
        myExtObject.controlMapSevice.showLabel(urlvector);
        myExtObject.controlMapSevice.showLabel(null, "show");
        this.addListogrammeLegend(listDesIndicateursSelectioonnee , listMaxValueIndicateur);


    }

    addListogrammeLegend(listDesIndicateursSelectioonnee , listMaxValueIndicateur) {
        this.removeHistogrammeLegend()
        var legend = $("<div></div>").text("");
        legend.addClass("legendCss");
        legend.attr('id', 'legend-group-indicateur');
        var geostatLegendDiv = $('<div class="geostats-legend" ></div>');
        var uniteValue = (listDesIndicateursSelectioonnee[0].unite && listDesIndicateursSelectioonnee[0].unite.libelle) ? '('+listDesIndicateursSelectioonnee[0].unite.libelle+')' : "";
        var legendTitle = $('<div class="geostats-legend-title">' + listDesIndicateursSelectioonnee[0].libelle + " "+uniteValue+'</div>')
            /* legendTitle.html(); */
        geostatLegendDiv.append(legendTitle);
        $(myExtObject.divdi).css({
          "display": "inline-block",
        });


        var chartCanva = myExtObject.divdi;

        var listMaValues = Math.max.apply(Math, listMaxValueIndicateur.map(function(o) { return o.valeur; }))
        var texthead = listMaValues + uniteValue ;
        var divtable = $("<div id='tableid'></div>");
        var table = $("<table ></table>");
        var tr = $("<tr></tr>");
        var th = $("<td></td>");
        var th2 = $("<td></td>");
        // div.append(table);
        divtable.append(table)
        table.append(tr);
        tr.append(th);
        tr.append(th2);
        th.append(chartCanva);
        th2.text(texthead);
        geostatLegendDiv.append(divtable);

        // geostatLegendDiv.append(chartCanva );
        // var valueDiv =  $("<div></div>").css({
        //   "display": "inline-block",
        //   "position": "absolute",
        //   "margin-top": "25px",
        // })

        // var valueSpan = $("<span></span>").text(texthead);
        // valueDiv.append(valueSpan);
        // geostatLegendDiv.append(valueDiv)
        for (let item of listDesIndicateursSelectioonnee) {

            var div = $("<div></div>").text("");
            var legendblock = $('<div class="geostats-legend-block" id="legendblock' + item.id + '"></div>').css('background-color', item.colorInHistogramme);
            var p = $('<span id="paragraphe' + item.id + '"></span>');
            p.html(item.annee );
            div.append(legendblock);
            div.append(p);
            geostatLegendDiv.append(div);
        }
        legend.append(geostatLegendDiv);
        $("#body-legend").append(legend);
        $('#legendButton').css({ "display": "block" });
        $('#legendButton').addClass("icon icon-arrow-left")
        $("#legend").css({ "display": "block" });
        $("#legend").css({ "height": "18em", "width": "20em", "padding-left": "14px", "bottom": "0px", "margin-left": "22px", "z-index": " -1" });

    }

    removeHistogrammeLegend() {
        $('#legend-group-indicateur').remove();
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
    }
    removeAllHistograme(identiteVectorLayer) {
        if (identiteVectorLayer.listOverlay && identiteVectorLayer.listOverlay.length > 0) {
            for (var item of identiteVectorLayer.listOverlay) {
                myExtObject.map.removeOverlay(item);
            }
        }
    }

}

var HistogrameSeviceSingloton = (function() {

    var instance;

    function createInstance() {
        var object = new HistogrameSevice();
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

