var GraphManager = {
    ref_Component: null,
    init(arg){
        this.ref_Component = arg;

    },
    loadCharts : async function(className, indicateurName, composante, provincesData, communesData, i, indicateursCounter, provincesMapData, communesMapData, categories, totalWidth) {
        let colors = ["#F44336","#4CAF50","#2196F3","#FF5722","#fdb45c","#46bfbd","#ffeb3b"]
        //console.log(totalWidth);
        let mainCoucheUrl;
        if (provincesMapData) {
          console.log(provincesMapData, provincesMapData.joinBy );
          let decoupage_id = provincesMapData.decoupage != null ?  provincesMapData.decoupage : 2;
          if (provincesMapData.joinBy[0] == "id_region")
            mainCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.cocheReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + decoupage_id;
          else if (provincesMapData.joinBy[0] == "id_province")
            mainCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.cochePrvToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + decoupage_id;
          else if (provincesMapData.joinBy[0] == "id_commune")
            mainCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.coucheCmnToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + decoupage_id;
          else if (provincesMapData.joinBy[0] == "id_uniteTerritorial")
            mainCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.coucheUntToReg + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + decoupage_id;
          else if (provincesMapData.joinBy[0] == "id_prefArr")
            mainCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.cocheCerPrefArr + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + decoupage_id;
          else if (provincesMapData.joinBy[0] == "id_cercle")
            mainCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.cocheCerPrefArr + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + decoupage_id;
          else if (provincesMapData.joinBy[0] == "id_douar")
            mainCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.cocheDouarCentreUrb + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + decoupage_id;
          else if (provincesMapData.joinBy[0] == "id_centreUrb")
            mainCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.cocheDouarCentreUrb + "&outputFormat=application%2Fjson&viewparams=region_id:" + myExtObject.stringAllRegions + ";decoupage_id:" + decoupage_id;
        }

        let subCoucheUrl = GraphManager.ref_Component.settings.geo.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + GraphManager.ref_Component.settings.geo.dataBase + ':' + GraphManager.ref_Component.settings.geo.cocheCmnToPrv + "&outputFormat=application%2Fjson&viewparams=province_id:"
        let chartId = 'chart'+i;
        if ( composante && composante['config'] && composante['config']['gridster']) {
          chartId = composante['config']['gridster'].id;
        }
        switch (composante.fonction.categorieComposante.tag) {
            case 'Carte': {
              if(i == -999) {
                $(className + " .row").last().append('<div class="col-xl-6" id="'+ chartId + '"></div>');
                $('#'+chartId).css({
                  width: (composante.poids ? composante.poids :45) + "%",
                  boxShadow: "-1px 0 8px rgba(0,0,0,.2)",
                  borderRadius: ".5rem",
                  background: "#fff",
                  padding: "1.25rem",
                  marginBottom: "0.5%",
                  height: '450px',
                  overflowY: 'scroll'
                });
              }
              else {
                $('#'+chartId).css({
                  width: "100%",
                  height: '100%',
                });
              }
              ////console.log($('#'+chartId).width());
              var minColor = '#E6E7E8';
              var mainMap;
              $.ajax({
                type: 'get',
                url: mainCoucheUrl,
                async: false,
                success: function (response) {
                  mainMap = response;
                }
              });

              if((composante.fonction.categorieComposante.valeur) == 'mapbubble'){
                minColor = composante.couleur ? composante.couleur :'#3339d1';

              }
              // console.log(provincesMapData);
              $.each(provincesMapData.data, function(i) {
                this.value = this.y;
                this.z = this.y;
              });
              $.each(communesMapData, function(i) {
                this.value = this.y;
              });
              var chart = Highcharts.mapChart(chartId, {
                title: {
                  text: composante.title ? composante.title : composante.fonction.libelle
                },
                credits: {
                  enabled: false
                },
                chart: {
                    map: mainMap,
                    events: {
                        drilldown: function(e) {
                            if (!e.seriesOptions) {
                                var communes;
                                $.ajax({
                                        type: 'get',
                                        url: subCoucheUrl + e.point.id_province,
                                        async: false,
                                        success: function (response) {
                                            communes = response;
                                        }
                                      })
                                var chart = this;
                                chart.addSeriesAsDrilldown(e.point, {
                                    "joinBy": [
                                        "id_commune",
                                        "id_commune"
                                    ],
                                    mapData: Highcharts.geojson(communes),
                                    borderColor: "black",
                                    name: e.point.properties.libelle,
                                    subtitle: null,
                                    data: communesMapData
                                });
                            }
                        }
                    }
                },
                series: [{
                  color: '#E0E0E0',
                  enableMouseTracking: false,
                  showInLegend: false,
                  animation: {
                    duration: 200,
                  }
                },
                {
                  color: composante.couleur,
                  joinBy: provincesMapData.joinBy,
                  type : (composante.fonction.categorieComposante.valeur),
                  mapData: Highcharts.geojson(mainMap),
                  name: composante.title,
                  minSize: '5%',
                  maxSize: '20%',
                  showInLegend: false,
                  sizeBy: 'width',
                  data : provincesMapData.data,
                  dataLabels: {
                      enabled: true,
                      format: '{point.properties.libelle}',
                      style: {
                          width: '80px' // force line-wrap
                      }
                  },
                  tooltip: {
                      pointFormat: '{point.properties.libelle}: {point.value} '
                  },
                }],
                legend: {
                  enabled: true,
                  align: 'right',
                  verticalAlign: 'middle',
                  y: 15,
                },
                colorAxis: {
                  showInLegend: true,
                  minColor: '#E0E0E0',
                  maxColor: composante.couleur ? composante.couleur :'#3339d1',
                },
              });
              let valeurs = provincesMapData.data.map(entry => entry.y);
              let interval = myExtObject.getClassificationByNb(composante.config.nombreClasses, valeurs, composante.config.classification);
              interval = [...new Set(interval)];
              if(composante.fonction.categorieComposante.libelle == 'Carte') {
                let dataClasses = interval.map(function(value, index) {
                  // if(index == 0)
                  //   return { to : value };
                  if(index == interval.length)
                    return { from: value };
                  else (index > 0)
                    return { from: interval[index - 1], to: interval[index] };
                });
                dataClasses = dataClasses.slice(1);
                chart.update({
                  legend: {
                    enabled: true,
                    labelFormatter: function () {
                      if(this.name === undefined ) {
                        if(this.from !== undefined && this.to !== undefined) {
                          // if (this.from === undefined) {
                          //     return '< ' + this.to;
                          // }
                          // if (this.to === undefined) {
                          //     return '> ' + this.from;
                          // }
                          return this.from + ' - ' + this.to;
                        }
                      }
                      else
                        return this.name
                    }
                  },
                  colorAxis: {
                    minColor: '#E0E0E0',
                    maxColor: composante.couleur ? composante.couleur :'#3339d1',
                    dataClasses: dataClasses
                  }
                });
              }
              else if(composante.fonction.categorieComposante.libelle == 'Carte (Symboles)') {
                interval = interval.slice(1)
                let ranges = interval.map(function(value) {
                  return { value: value }
                })
                console.log(ranges);
                chart.series[1].update({
                  marker: {
                    fillColor: composante.couleur,
                    symbol: composante.config.symbole,
                  }
                });
                chart.update({
                  plotOptions: {
                    series: {
                      marker: {
                        enabled: true
                      }
                    }
                  },
                  legend: {
                    bubbleLegend: {
                      enabled: true,
                      ranges: ranges
                    }
                  },
                  colorAxis: {
                    minColor: '#E0E0E0',
                    maxColor: composante.couleur ? composante.couleur :'#3339d1',
                  }
                });
              }

              $('#'+chartId + ' svg').css({
                width: "inherit",
                height: "inherit"
              });

              chart.reflow();
              break;
            }
            case 'Carte (Croise)': {

              if(i == -999) {
                $(className + " .row").last().append('<div class="col-xl-6" id="'+ chartId + '"></div>');
                $('#'+chartId).css({
                  width: (composante.poids ? composante.poids :45) + "%",
                  boxShadow: "-1px 0 8px rgba(0,0,0,.2)",
                  borderRadius: ".5rem",
                  background: "#fff",
                  padding: "1.25rem",
                  marginBottom: "0.5%",
                  height: '450px',
                  overflowY: 'scroll'
                });
              }
              else {
                $('#'+chartId).css({
                  width: "100%",
                  height: '100%',
                });
              }

              ////console.log($('#'+chartId).width());
              var minColor = '#E6E7E8';

              var mainMap;
              $.ajax({
                type: 'get',
                url: mainCoucheUrl,
                async: false,
                success: function (response) {
                  mainMap = response;
                }
              });

              console.log(provincesMapData);
              var chart = Highcharts.mapChart(chartId,  {
                title: {
                  text: composante.title ? composante.title : composante.fonction.libelle
                },
                credits: {
                  enabled: false
                },
                chart: {
                    map: mainMap,
                },
                series: [{
                  color: composante.couleur,
                  enableMouseTracking: false,
                  showInLegend: false,
                  animation: {
                    duration: 200,
                  }
                },
                {
                  color: composante.couleur,
                  joinBy: provincesMapData.joinBy,
                  type: "mapbubble",
                  mapData: Highcharts.geojson(mainMap),
                  name: composante.title,
                  minSize: '5%',
                  maxSize: '20%',
                  sizeBy: 'width',
                  data : provincesMapData.data,
                  dataLabels: {
                      enabled: true,
                      format: '{point.properties.libelle}',
                      style: {
                          width: '80px' // force line-wrap
                      }
                  },
                  tooltip: {
                      pointFormat: '{point.properties.libelle}: {point.value} - {point.z} '
                  },
                }],
                legend: {
                  title: {
                    text : 'Indicateur1/ Indicateur2'
                  },
                  bubbleLegend: {
                    enabled: true,
                  }
                },
                colorAxis: {
                  showInLegend: true,
                  minColor: '#E0E0E0',
                  maxColor: composante.couleur ? composante.couleur :'#3339d1',
                }
              });
              let valeurs = provincesMapData.data.map(entry => entry.value);

              let interval = myExtObject.getClassificationByNb(4, valeurs, 'QUANTILE');
              interval = [...new Set(interval)];
              interval = interval.slice(1)

              let ranges = interval.map(function(value) {
                return { value: value }
              })

              for( let i = 0; i < interval.length; i++) {

              }
              let dataClasses = interval.map(function(value, index) {
                if(index == interval.length)
                  return { from: value };
                else (index > 0)
                  return { from: interval[index - 1], to: interval[index] };
              });
              let text = "Taille : " +provincesMapData.keys[1] + '\n </br> Couleur : ' + provincesMapData.keys[2];
              dataClasses = dataClasses.slice(1);
              chart.update({
                legend: {
                  symbolPadding: 10,
                  title: {
                    text : text,
                    style: {
                            "top": "0px" ,
                            "bottom": "3px"
                          }
                  },
                  useHTML: true,
                  enabled: true,
                  align: 'right',
                  verticalAlign: 'middle',
                  y: 15,
                  labelFormatter: function () {
                    if(this.name === undefined ) {
                      if(this.from !== undefined && this.to !== undefined) {
                        return this.from + ' - ' + this.to;
                      }
                    }
                    else
                      return this.name
                  }
                },
                colorAxis: {
                  minColor: '#E0E0E0',
                  maxColor: composante.couleur ? composante.couleur :'#3339d1',
                  dataClasses: dataClasses
                }
              });
                // chart.update({
                //   legend: {
                //     bubbleLegend: {
                //       enabled: true,
                //       ranges: ranges
                //     }
                //   },
                //   colorAxis: {
                //     showInLegend: false
                //   }
                // });
                chart.series[1].update({
                  marker: {
                    symbol: composante.config.symbole,
                  }
                });
                // chart.update({
                //   ,
                // });
                const length = interval.length;
                chart.series[1].points.forEach(function (point) {
                  for(let i = 0 ; i < length; i++) {
                      if (( i == 0 && point.value < interval[i] ) || ( i > 0 && point.value < interval[i] && point.value >= interval[i-1] ) || (i == length - 1 && point.value == interval[i]) ) {
                        point.update({
                          color: pSBC( 1 - (i/length), composante.couleur).toString()
                        })
                      }
                    }
                });
                chart.reflow();

              $('#'+chartId + ' svg').css({
                width: "inherit",
                height: "inherit"
              });

              chart.reflow();
              break;
            }
            case 'Indicateur': {
              var titre = composante.title ? composante.title : composante.fonction.libelle;
              var destDiv;
              if (i == -999)
                destDiv = indicateurName
              else
                destDiv = "#"+chartId;
              $(destDiv).append('<div class="col-xs-6 indicateurComposante"><div class="container" style="-ms-transform: translateY(-50%)"><h2>'+provincesData[0].data[0].value +'</h2><h2 style="margin: 0 auto;"><small>'+titre+'</small></h2></div></div>');

              $(destDiv+' .col-xs-6').last().css({
                background: composante.couleur ? composante.couleur : '#3339d1',
                borderRadius: "5px",
                height: "100%",
                width: "100%",
                padding: '0'
              });
              $(destDiv+' .col-xs-6 .container').css({
                position: "relative",
                top: "50%",
                width: "100%",
                display: "block",
                "transform": "translateY(-50%)"
              })
              $(destDiv+' .col-xs-6 h2').css({
                color: "#fff",
                // fontSize: "2em",
                width: "fit-content",
                margin: "0 auto",
                textAlign: "center",
                display: "block",
                position: 'relative',
                zIndex: 100,
              })

              $(destDiv+' .col-xs-6 small').css({
                color: "rgb(253 255 255 / 0.43)",
                display: "block",
                position: 'relative',
                zIndex: 100,
                // fontSize: "0.8em",
                // textAlign: "center"
              })
              if (i == -999) {
                $(destDiv+' .col-xs-6').css({
                  width: '50%',
                  height : '150px'
                })
              }
              else
                $(destDiv).css({
                  height: '100%'
                })
              indicateursCounter += 1;
              break;
            }
            case 'Carte (Bar)': {

              if(i == -999) {
                $(className + " .row").last().append('<div class="col-xl-6" id="'+ chartId + '"></div>');
                $('#'+chartId).css({
                  width: (composante.poids ? composante.poids :45) + "%",
                  boxShadow: "-1px 0 8px rgba(0,0,0,.2)",
                  borderRadius: ".5rem",
                  background: "#fff",
                  padding: "1.25rem",
                  marginBottom: "0.5%",
                  height: '450px',
                  overflowY: 'scroll'
                });
              }
              else {
                $('#'+chartId).css({
                  width: "100%",
                  height: '100%',
                });
              }

              var redrawEnabled = true;
              var mainMap;
              $.ajax({
                type: 'get',
                url: mainCoucheUrl,
                async: false,
                success: function (response) {
                  mainMap = response;
                }
              });

              ////console.log(provincesMapData);

              function positionColumnSeries(chart) {
                var mapXAxis = chart.xAxis[0],
                    mapYAxis = chart.yAxis[0],
                    minColumnWidth = 5,
                    columnWidth = 20,
                    minColumnHeight = 0;

                Highcharts.each(chart.series[0].points, function(state) {
                  console.log(state.properties)
                  var stateCenterX = mapXAxis.toPixels(state._midX),
                    stateCenterY = mapYAxis.toPixels(state._midY),
                    stateHeight = mapYAxis.toPixels(state._maxY) - mapYAxis.toPixels(state._minY),
                    columnHeight = stateHeight,
                    axisIndex = state.index + 1,
                    xAxis = chart.xAxis[axisIndex],
                    yAxis = chart.yAxis[axisIndex];
                    console.log(xAxis, yAxis);

                  // applay minimum column plot dimensions if needed
                  if (columnHeight < minColumnHeight) {
                    columnHeight = minColumnHeight;
                  }

                  var left = stateCenterX,
                    top = stateCenterY - columnHeight;

                  // hide series which don't fit in the plot area
                    xAxis.series.forEach(function(s) {
                      s.setVisible(true, false);
                    });

                    xAxis.update({
                      left: left + 'px',
                      width: columnWidth,
                    }, false);

                    yAxis.update({
                      top: top + 'px',
                      height: columnHeight,
                    }, false);

                });

                chart.redraw();
              }

              (function(H) {

                var splat = H.splat,
                pick = H.pick;

                H.Tooltip.prototype.refresh = function(pointOrPoints, mouseEvent) {
                  var tooltip = this,
                    label,
                    options = tooltip.options,
                    x,
                    y,
                    point = pointOrPoints,
                    anchor,
                    textConfig = {},
                    text,
                    pointConfig = [],
                    formatter = options.formatter || tooltip.defaultFormatter,
                    shared = tooltip.shared,
                    currentSeries;

                  if (!options.enabled) {
                    return;
                  }

                  clearTimeout(this.hideTimer);

                  // get the reference point coordinates (pie charts use tooltipPos)
                  tooltip.followPointer = splat(point)[0].series.tooltipOptions.followPointer;
                  anchor = tooltip.getAnchor(point, mouseEvent);
                  x = anchor[0] + (point.series.xAxis.left || 0) - this.chart.plotLeft;
                  y = anchor[1];

                  // shared tooltip, array is sent over
                  if (shared && !(point.series && point.series.noSharedTooltip)) {
                    each(point, function(item) {
                      item.setState('hover');

                      pointConfig.push(item.getLabelConfig());
                    });

                    textConfig = {
                      x: point[0].category,
                      y: point[0].y
                    };
                    textConfig.points = pointConfig;
                    point = point[0];

                    // single point tooltip
                  } else {
                    textConfig = point.getLabelConfig();
                  }
                  this.len = pointConfig.length; // #6128
                  text = formatter.call(textConfig, tooltip);

                  // register the current series
                  currentSeries = point.series;
                  this.distance = pick(currentSeries.tooltipOptions.distance, 16);

                  // update the inner HTML
                  if (text === false) {
                    this.hide();
                  } else {

                    label = tooltip.getLabel();

                    // show it
                    if (tooltip.isHidden) {
                      label.attr({
                        opacity: 1
                      }).show();
                    }

                    // update text
                    if (tooltip.split) {
                      this.renderSplit(text, pointOrPoints);
                    } else {

                      // Prevent the tooltip from flowing over the chart box (#6659)

                      if (!options.style.width) {

                        label.css({
                          width: this.chart.spacingBox.width
                        });

                      }


                      label.attr({
                        text: text && text.join ? text.join('') : text
                      });

                      // Set the stroke color of the box to reflect the point
                      label.removeClass(/highcharts-color-[\d]+/g)
                        .addClass('highcharts-color-' + pick(point.colorIndex, currentSeries.colorIndex));


                      label.attr({
                        stroke: options.borderColor || point.color || currentSeries.color || '#666666'
                      });


                      tooltip.updatePosition({
                        plotX: x,
                        plotY: y,
                        negative: point.negative,
                        ttBelow: point.ttBelow,
                        h: anchor[2] || 0
                      });
                    }

                    this.isHidden = false;
                  }
                };


              })(Highcharts);
              var dataClasses = [];
              provincesMapData.keys.map(function(data,index) {
                if(index > 0 )
                  dataClasses.push({name: data, color: colors[index]})
              });
              console.log(dataClasses);

              // Build the chart
              var chart = Highcharts.mapChart(chartId, {

                credits:{
                  enabled: false
                },
                title: {
                  text: composante.title
                },
                chart: {
                  animation: false,
                  credits:{
                    enabled: false
                  },
                  events: {
                    redraw: function() {
                      if (redrawEnabled) {
                        redrawEnabled = false;
                        positionColumnSeries(this);
                        redrawEnabled = true;
                      }
                    }
                  }
                },
                colorAxis: {
                  dataClasses: dataClasses
                },
                mapNavigation: {
                  enabled: false
                },
                plotOptions: {
                  series: {
                    animation: false
                  },
                  column: {
                    borderWidth: 0,
                    pointPadding: 0,
                    groupPadding: 0,
                    shadow: false,
                    tooltip: {
                      enabled: false
                    }
                  }
                },
                series: [{
                  mapData: Highcharts.geojson(mainMap),
                  color: 'rgb(170 170 181 / 0.3)',
                  borderColor: '#FFF',
                  showInLegend: false,
                  data: provincesMapData.data,
                  joinBy: provincesMapData.joinBy,
                  keys: provincesMapData.keys,
                  tooltip: {
                    headerFormat: '',
                    pointFormatter: function() {
                      var hoverVotes = this.hoverVotes; // Used by pie only
                      var point = this;
                      var datas = [];
                      provincesMapData.keys.map(function(data,index) {
                        // console.log(data);
                        if(index > 0 )
                          datas.push([data , point[data], colors[index]])
                      });
                      return '<b>' + point.properties.libelle + '</b><br/>' +
                        Highcharts.map(
                          datas.sort(function(a, b) {
                          return b[1] - a[1]; // Sort tooltip by most votes
                        }), function(line) {
                          // Colorized bullet
                          return '<span style="color:' + line[2] + '">\u25CF</span>' +
                            // Party and votes
                                line[0] + ': ' + Highcharts.numberFormat(line[1], 2) +
                            '<br/>';
                        }).join('') ;
                    }
                  }
                }, {
                  name: 'Separators',
                  type: 'mapline',
                  color: '#707070',
                  showInLegend: false,
                  enableMouseTracking: false
                }, {
                  name: 'Connectors',
                  type: 'mapline',
                  color: 'rgba(130, 130, 130, 0.5)',
                  zIndex: 5,
                  showInLegend: false,
                  enableMouseTracking: false
                }]
              });

              Highcharts.each(chart.series[0].points, function(state, index) {
                //console.log(state);
                // create axes separate axes for each column plot
                chart.addAxis({
                  visible: false
                }, true, false);

                chart.addAxis({
                  visible: false
                }, false, false);
                var datas = [];
                var legendOn = true;

                if( index > 0 )
                  legendOn = false;

                provincesMapData.keys.map(function(data, index) {
                  // console.log(data);
                  if (index > 0 ) // different de l'id geographque (id_province, id_commune...)
                      datas.push({ y: state[data], color : colors[index], name : data })
                });

                chart.addSeries({
                  type: 'column',
                  name: state.properties.libelle,
                  showInLegend: false,
                  xAxis: state.index + 1,
                  yAxis: state.index + 1,
                  data: datas
                }, false);
              });
              positionColumnSeries(chart);
              chart.reflow();
              break;
            }
            case 'List' : {
              if(i == -999) {
                $(className + " .row").last().append('<div class="col-xl-6" id="'+ chartId + '"></div>');
                $('#'+chartId).css({
                  width: (composante.poids ? composante.poids :45) + "%",
                  boxShadow: "-1px 0 8px rgba(0,0,0,.2)",
                  borderRadius: ".5rem",
                  background: "#fff",
                  padding: "1.25rem",
                  marginBottom: "0.5%",
                  height: '450px',
                  overflowY: 'scroll'
                });
              }
              else {
                $('#'+chartId).css({
                  width: "100%",
                  height: '100%',
                  overflowY: 'scroll'
                });
              }
              var head,
                  body;
              provincesData = provincesData[0].data;
              $.each(provincesData,function(index, element) {
                body += '<tr>';
                Object.keys(element)
                    .forEach(function eachKey(key) {
                      if(index == 0)
                          head += '<th>'+key+'</th>';
                      body += '<td>'+element[key]+'</td>';
                    })
                body += '</tr>';
              });

              $('#'+chartId).append('<table class="table table-striped" style="height:95%;overflow-y:scroll"><thead>'+ head +'</thead><tbody>'+body+'</tbody></table>');
              $('#'+chartId).html($('#'+chartId).html().replace('undefinedundefined',''));
              $('#'+chartId+ ' table').css({
                height: '100%'
              });

              $('#'+chartId+ ' table tr th').css({
                textAlign: 'center'
              });

              $('#'+chartId+ ' table tr td').css({
                textAlign: 'center'
              });

              $('#'+chartId+ ' table tr td:last-child').css({
                color: '#005792'
              });
              break;
            }
            case 'Carte (Pie)': {
              if(i == -999) {
                $(className + " .row").last().append('<div class="col-xl-6" id="'+ chartId + '"></div>');
                $('#'+chartId).css({
                  width: (composante.poids ? composante.poids :45) + "%",
                  boxShadow: "-1px 0 8px rgba(0,0,0,.2)",
                  borderRadius: ".5rem",
                  background: "#fff",
                  padding: "1.25rem",
                  marginBottom: "0.5%",
                  height: '450px',
                  overflowY: 'scroll'
                });
              }
              else {
                $('#'+chartId).css({
                  width: "100%",
                  height: '100%',
                });
              }

              var redrawEnabled = true;

              var mainMap;
              $.ajax({
                type: 'get',
                url: mainCoucheUrl,
                async: false,
                success: function (response) {
                  mainMap = response;
                }
              });

              // function positionColumnSeries(chart) {
              //   var mapXAxis = chart.xAxis[0],
              //       mapYAxis = chart.yAxis[0],
              //       minColumnWidth = 15,
              //       columnWidth = 20,
              //       minColumnHeight = 0;

              //   Highcharts.each(chart.series[0].points, function(state) {
              //     console.log(chart.xAxis)
              //     var stateCenterX = mapXAxis.toPixels(state._midX),
              //       stateCenterY = mapYAxis.toPixels(state._midY),
              //       stateHeight = mapYAxis.toPixels(state._maxY) - mapYAxis.toPixels(state._minY),
              //       columnHeight = stateHeight,
              //       axisIndex = state.index + 1,
              //       xAxis = chart.xAxis[0],
              //       yAxis = chart.yAxis[0];

              //       console.log(state.index);

              //     // applay minimum column plot dimensions if needed
              //     if (columnHeight < minColumnHeight) {
              //       columnHeight = minColumnHeight;
              //     }

              //     var left = stateCenterX,
              //       top = stateCenterY - columnHeight;

              //     // hide series which don't fit in the plot area
              //     if (left - chart.plotLeft < 0 || left - chart.plotLeft > chart.plotWidth || top < 0 || top - chart.plotTop + columnHeight > chart.plotHeight) {
              //       xAxis.series.forEach(function(s) {
              //         s.setVisible(false, false);
              //       });
              //       // show and position series that fit in the plot area
              //     } else {
              //       xAxis.series.forEach(function(s) {
              //         s.setVisible(true, false);
              //       });

              //       xAxis.update({
              //         left: left + 'px',
              //         width: columnWidth,
              //       }, false);

              //       yAxis.update({
              //         top: top + 'px',
              //         height: columnHeight,
              //       }, false);
              //     }
              //   });

              //   chart.redraw();
              // }
              var mapchart = Highcharts.seriesType('mappie', 'pie', {
                center: null, // Can't be array by default anymore
                clip: true, // For map navigation
                states: {
                  hover: {
                    halo: {
                      size: 5
                    }
                  }
                },
                dataLabels: {
                  enabled: false
                }
              }, {
                getCenter: function() {
                  var options = this.options,
                      chart = this.chart,
                      slicingRoom = 2 * (options.slicedOffset || 0);
                  if (!options.center) {
                    options.center = [null, null]; // Do the default here instead
                  }
                  console.log(this);
                  // Replace lat/lon with plotX/plotY
                  if (options.center.plotX !== undefined) {
                    options.center = [options.center.plotX, options.center.plotY];
                  }

                  // Handle dynamic size
                  if (options.sizeFormatter) {
                    options.size = options.sizeFormatter.call(this);
                  }
                  // Call parent function
                  var result = Highcharts.seriesTypes.pie.prototype.getCenter.call(this);
                  // Must correct for slicing room to get exact pixel pos
                  result[0] -= slicingRoom;
                  result[1] -= slicingRoom;
                  return result;
                },
                translate: function(p) {
                  this.options.center = this.userOptions.center;
                  this.center = this.getCenter();
                  return Highcharts.seriesTypes.pie.prototype.translate.call(this, p);
                }
              });
              var dataClasses = [];
              provincesMapData.keys.map(function(data,index) {
                if(index > 0 )
                  dataClasses.push({name :data, color: colors[index]})
              });
              console.log(dataClasses);
              // Build the chart
              var chart = Highcharts.mapChart(chartId, {
                title: {
                  text: composante.title
                },
                credits:{
                  enabled:false
                },
                chart: {
                  animation: false // Disable animation, especially for zooming
                },
                colorAxis: {
                  dataClasses: dataClasses
                },
                mapNavigation: {
                  enabled: false
                },

                // Limit zoom range
                tooltip: {
                  useHTML: true
                },

                // Default options for the pies
                plotOptions: {
                  mappie: {
                    borderColor: 'rgba(255,255,255,0.4)',
                    borderWidth: 1,
                    tooltip: {
                      headerFormat: ''
                    }
                  }
                },
                series: [{
                  mapData: Highcharts.geojson(mainMap),
                  color: 'rgb(170 170 181 / 0.3)',
                  borderColor: '#FFF',
                  showInLegend: false,
                  data: provincesMapData.data,
                  joinBy: provincesMapData.joinBy,
                  keys: provincesMapData.keys,
                  tooltip: {
                    headerFormat: '',
                    pointFormatter: function() {
                      var point = this;
                      var hoverVotes = this.hoverVotes;
                      var datas = [];
                      provincesMapData.keys.map(function(data,index) {
                        if(index > 0 )
                          datas.push([data , point[data], colors[index]])
                      });

                      // Used by pie only
                      return '<b>' + point.properties.libelle + '</b><br/>' +
                        Highcharts.map(datas.sort(function(a, b) {
                          return b[1] - a[1]; // Sort tooltip by most votes
                        }), function(line) {
                          return '<span style="color:' + line[2] +
                            // Colorized bullet
                            '">\u25CF</span> ' +
                            // Party and votes
                            (line[0] === hoverVotes ? '<b>' : '') +
                            line[0] + ': ' +
                            Highcharts.numberFormat(line[1], 0) +
                            (line[0] === hoverVotes ? '</b>' : '') +
                            '<br/>';
                        }).join('');
                    }
                  }
                }]
              });

              // When clicking legend items, also toggle pies
              Highcharts.each(chart.legend.allItems, function(item) {
                var old = item.setVisible;
                item.setVisible = function() {
                  var legendItem = this;
                  old.call(legendItem);
                  Highcharts.each(chart.series[0].points, function(point) {
                    if (chart.colorAxis[0].dataClasses[point.dataClass].name === legendItem.name) {
                      // Find this state's pie and set visibility
                      Highcharts.find(chart.series, function(item) {
                        return item.name === point.id;
                      }).setVisible(legendItem.visible, false);
                    }
                  });
                  chart.redraw();
                };
              });

              // Add the pies after chart load

              Highcharts.each(chart.series[0].points, function(state) {

                console.log(state.index + 1)
                if (!state.id || !state.properties) {
                  return; // Skip points with no data, if any
                }

                var datas = [];
                provincesMapData.keys.map(function(data, index) {
                  if(index > 0 )
                    datas.push({ y: state[data], color : colors[index], name: data })
                })

                // Add the  pie for this state
                chart.addSeries({
                  type: 'mappie',
                  name: state.id,
                  zIndex: 6,
                  size: 25,
                  tooltip: {
                    backgroundColor: 'none',
                    borderWidth: 0,
                    shadow: false,
                    useHTML: true,
                    padding: 0,
                    pointFormat:
                        '<span class="f32"><span class="flag {point.properties.libelle}">' +
                        '</span></span> {point.name}<br>' +
                        '<span style="font-size:30px">{point.y}</span>',
                        positioner: function () {
                          return { x: 0, y: 250 };
                        }
                  },
                  data: datas,
                  center: {
                    plotX: state.plotX,
                    plotY: state.plotY
                  }
                }, false);

              });
              // positionColumnSeries(chart)
              chart.redraw();
              chart.reflow();
              break;

            }
            case 'Texte' : {

              if(i == -999) {
                while (!document.querySelector(className + " .row")) {
                  await new Promise(r => setTimeout(r, 500));
                }
                $(className + " .row").last().append('<div class="col-xl-6" id="'+ chartId + '"></div>');
                $('#'+chartId).css({
                  width: (composante.poids ? composante.poids :45) + "%",
                  boxShadow: "-1px 0 8px rgba(0,0,0,.2)",
                  borderRadius: ".5rem",
                  background: "#fff",
                  padding: "1.25rem",
                  marginBottom: "0.5%",
                  height: '450px',
                  overflowY: 'scroll'
                });
              }
              else {
                while (!document.querySelector('#'+chartId)) {
                  await new Promise(r => setTimeout(r, 500));
                }
                $('#'+chartId).css({
                  width: "100%",
                  background: "#fff",
                  fontSize: '11.5px',
                  padding: "1.25rem",
                  height: '100%',
                });
              }
              $('#'+chartId).html('<p>'+composante.valeur+'</p>')
              break;
            }
            case 'Image' : {
              if(i == -999) {
                while (!document.querySelector(className + " .row")) {
                  await new Promise(r => setTimeout(r, 500));
                }
                $(className + " .row").last().append('<div class="col-xl-6" id="'+ chartId + '"></div>');
                $('#'+chartId).css({
                  width: (composante.poids ? composante.poids :45) + "%",
                  boxShadow: "-1px 0 8px rgba(0,0,0,.2)",
                  // borderRadius: ".5rem",
                  background: "#fff",
                  background: 'white url(' + composante.valeur + ') no-repeat scroll left top',
                  padding: "1.25rem",
                  marginBottom: "0.5%",
                  height: '450px'
                });
              } else {
                while (!document.querySelector('#'+chartId)) {
                  await new Promise(r => setTimeout(r, 500));
                }
                $('#'+chartId).css({
                  // width: (composante.poids ? composante.poids: 45 )+ "%",
                  // borderRadius: ".5rem",
                  background: "#fff",
                  // padding: "1.25rem",
                  // marginBottom: "0.5%",
                  background: 'white url(' + composante.valeur + ') no-repeat scroll left top',
                  backgroundSize: '100% 100%',
                  height: "100%"
                });
              }

              //console.log(composante.valeur);
              break;
            }
            default: {
              if(i == -999) {
                $(className + " .row").last().append('<div class="col-xl-6" id="'+ chartId + '"></div>');
                $('#'+chartId).css({
                  width: (composante.poids ? composante.poids :45) + "%",
                  boxShadow: "-1px 0 8px rgba(0,0,0,.2)",
                  borderRadius: ".5rem",
                  background: "#fff",
                  padding: "1.25rem",
                  marginBottom: "0.5%",
                  height: '450px',
                  overflowY: 'scroll'
                });
              }
              else {
                $('#'+chartId).css({
                  width: "100%",
                  height: '100%',
                });
              }
              // console.log(categories);
              if (categories)
                provincesData.forEach(function(name) {
                  name.data.forEach(function (a) {
                    for(var i=0; i < categories.length;i++){
                      if(a.name == categories[i]){
                        a.x = i;
                        break;
                      }
                    }
                  });
                });
              var chart = $('#'+chartId).highcharts({
                chart: {
                  type: (composante.fonction.categorieComposante.valeur),
                  zoomType: 'xy'
                },
                credits:{
                  enabled: false
                },
                xAxis: {
                  type: 'linear',
                  categories: categories
                },
                series: provincesData,
                title: {
                  text: composante.title ? composante.title : composante.fonction.categorieComposante.libelle
                },
                animation: {
                  duration: 200,
                }
              });

              if (provincesData.keys && provincesData.keys.length == 0 ) {
                var chosenChart;
                var charts = Highcharts.charts;
                charts.forEach(function (chart, index) {
                  if (chart != undefined && chart.renderTo.id === chartId) {
                    chosenChart = chart;
                    chosenChart.update({
                      plotOptions: {
                        series: {
                          color: composante.couleur ? composante.couleur : '#3339d1',
                          fillColor: {
                            linearGradient: [0, 0, 0, 500],
                            stops: [
                              [0, composante.couleur ? composante.couleur : '#3339d1'],
                              [1, '#fff']
                            ]
                          }
                        }
                      }
                    })
                  }
                });
              }
              i++;
              break;
            }
          }
          // console.log(totalWidth);
          if (totalWidth > 90) {
            $(className + " .row").last().children().each(function (index) {
              var parentWidth = $(className + " .row").last().outerWidth();
            //  console.log("cParent Width: ",parentWidth);
            //  console.log($(this).width() - 0.05*parentWidth/$(className + " .row").last().children().length);
            //   console.log($(this).width() - (0.05*parentWidth/$(className + " .row").last().children().length));
            //   console.log(0.05*parentWidth/($(className + " .row").last().children().length-1));
              $(this).css ({
                marginRight : 0,
                width:  $(this).width() - 0.05*parentWidth/$(className + " .row").last().children().length + 'px',
                // minHeight: "100%",
                // height: "100%"
              });

              // var width = $(this).outerWidth();
              // var width2 = $(this).outerWidth(true);
              // var width3 = $(this).width();
              // console.log("100% Width: ",width);
              // console.log("100% Width 2: ",width2);
               // console.log("100% Width 3: ",width3);

             if (index > 0) {
                $(this).css({
                  marginLeft: 0.05*parentWidth/($(className + " .row").last().children().length-1)+ 'px'
                })
              }

              //console.log($(this).width())
            });
            $(className).append('<div class ="row"></div>');
            $(className + " .row").last().css({
              display: "flex",
              flexWrap: "wrap",
              marginRight: "0",
              marginLeft: "0",
              marginBottom: "2.5rem",
              width: "100%"
            });
          }
    },
    removeShadow: function(className) {
      $(className+' .row').each(function(){
        $(this).children().css({
            boxShadow : 0
          });
      });
    },
    convertImgToBase64: function(url, code, callback, outputFormat) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var dataURL = "";
      var img = new Image;
      var _this = this;
      if (code != "END") {
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          if (code == "IMAGE_WITH_HISTO") {
            console.log("abcd" + url);
            dataURL = url;
          } else {
            dataURL = canvas.toDataURL(outputFormat || 'image/png');
          }
          //  dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, dataURL);
          // _this.imagesBase64.push({ code: code, base64: dataURL })

          callback(code, dataURL);
          // Clean up
          canvas = null;
        };
        img.src = url;
      } else {
        callback(code, "");
      }
      return dataURL
    },
    // printPDF: function(id, filename, height, composantesNum) {
    //   console.log(document.body.scrollHeight, height);
    //   console.log(composantesNum, height/composantesNum);
    //   document.getElementById('preview').scroll(0,0);
    //   $('gridster').css({
    //     height: height
    //   })
    //   $('#preview').css({
    //     height : height + document.getElementsByClassName('heading')[0].scrollHeight + 60
    //   })
    //   $(document.body).css({
    //     height : height + document.getElementsByClassName('heading')[0].scrollHeight + 60
    //   })
    //   console.log(document.body.scrollHeight, height);
    //   GraphManager.ref_Component.addBusy();
    //   var printDocument = document.getElementById(id);
    //   html2canvas(printDocument , {
    //     onrendered: function (canvas) {
    //        canvas.toBlob(function(blob) {
    //         canvas.width = printDocument.outerWidth;
    //         canvas.height = document.body.scrollHeight;
    //         var url = URL.createObjectURL(blob);
    //         var printWindow = window.open(url, '', 'width='+canvas.width*1.2+',height='+canvas.height);
    //         printWindow.print()
    //         $('gridster').css({
    //           height: '205mm'
    //         })
    //         $('#preview').css({
    //           height : '297mm'
    //         })
    //         $(document.body).css({
    //           height : '297mm'
    //         })
    //       });
    //     }
    //   }, {
    //         useCors : true,
    //         scrollX: 0,
    //         scrollY: 0,
    //         scale: 1,
    //         width: printDocument.outerWidth,
    //         height: document.body.scrollHeight + window.innerHeight,
    //         windowHeight: document.body.scrollHeight+ window.innerHeight,
    //         windowWidth: window.outerWidth
    //     }).then(async (canvas) => {
    //     var imgData = canvas.toDataURL('image/png');
    //     var imgWidth = 200; // 210
    //     var pageHeight = 297;   // 295
    //     var imgHeight = canvas.height * imgWidth / canvas.width;
    //     var heightLeft = document.body.scrollHeight;
    //     var pageNum = 1;
    //     var doc = new jsPDF('p', 'mm', 'a4');
    //     var position = 10; // give some top padding to first page
    //     let draw = false;

    //   });
    //   GraphManager.ref_Component.removeBusy();
    //       // html2pdf().from(printDocument).save();
    // },
    printPDF: async function(id, filename, height, composantesNum) {
      // $('body')[0].stopScroll();
      window.onscroll = function() {
        window.scrollTo(0, 0);
      };
      GraphManager.ref_Component.addBusy();
      // console.log(height, composantesNum, height/composantesNum * 2 + 60);
      $('gridster').css({
        height: height
      })
      $('#preview').css({
        height : height + document.getElementsByClassName('heading')[0].scrollHeight + 60 + 20// height of elements + height of heading + padding(gridster) + padding (page)
      })

      $(document.body).css({
        height : height + document.getElementsByClassName('heading')[0].scrollHeight + 60 + 20// height of elements + height of heading + padding(gridster) + padding (page)
      })
      var totalPages = height / (height/composantesNum * 2 + 30*composantesNum);
      var scrollBy = 0;
      var doc = new jsPDF('p', 'mm', 'a4');
      var pageNum = 1;
      var draw = false;
      await new Promise(r => setTimeout(r ,500));
      await html2canvas(document.getElementById('preview'), {
          allowTaint: true,
          logging: true,
          onrendered: async function (canvas) {
            var imgData = canvas.toDataURL('image/png', '1.0');
            while(scrollBy < height) {
              doc.setPage(pageNum);
              var image = new Image();

              image.onload = function() {
                // console.log(image.height);
                // ctx.drawImage(image, 0, scrollBy, image.width, height, 0 ,0 , image.width ,height);
                draw = true
              }
              if (image.complete) {
                // ctx.drawImage(image, 0, scrollBy, image.width, height , 0 ,0 , image.width ,height);
                draw = true
              }
              while (draw == false)
                await new Promise(r => setTimeout(r, 500));
              image.src = imgData;
              //scroll from bottom
              doc.addImage(image, 'JPEG', 0, -297 * (pageNum - 1) + 25 * (pageNum == 1 ? 0 : 1), 210, 297 * totalPages )
              doc.addPage();
              pageNum++;
              scrollBy += 3.7795275591 * 297 + 122// mm to px
          }
          await new Promise(r => setTimeout(r, 500));
          doc.deletePage(pageNum);
          doc.save(filename + '.pdf');
          }
        }).then(() => {

        })

      // console.log(document.body.scrollHeight, height);
      // console.log(composantesNum, height/composantesNum * 2 + 60 );
      // document.getElementById('gridster').scroll(0,0);
      // $('gridster').css({
      //   height: height/composantesNum * 2 + 60
      // })

      // GraphManager.ref_Component.addBusy();
      // var printDocument = document.getElementById(id);
      // html2canvas(printDocument , {
      //   onrendered: function (canvas) {
      //      var imgData = canvas.toDataURL('image/png');
      //   }
      // }, {
      //       useCors : true,
      //       scrollX: 0,
      //       scrollY: 0,
      //       scale: 1,
      //       width: printDocument.outerWidth,
      //       height: document.body.scrollHeight + window.innerHeight,
      //       windowHeight: document.body.scrollHeight+ window.innerHeight,
      //       windowWidth: window.outerWidth
      //   }).then(async (canvas) => {
      //   var imgData = canvas.toDataURL('image/png');
      //   var imgWidth = 200; // 210
      //   var pageHeight = 297;   // 295
      //   var imgHeight = canvas.height * imgWidth / canvas.width;
      //   var heightLeft = document.body.scrollHeight;
      //   var pageNum = 1;
      //   var doc = new jsPDF('p', 'mm', 'a4');
      //   var position = 10; // give some top padding to first page
      //   let draw = false;
      //   // doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      //   // heightLeft -= imgHeight;
      //   // while(heightLeft > 0) {
      //   //   position += heightLeft - 1225;

      //   //   doc.addPage();
      //   //   // doc.setPage(pageNum);
      //   //   doc.addImage(imgData, 'PNG', 0, position, 210, 297);
      //   //   heightLeft -= 1125;
      //   //   // pageNum++;
      //   // }
      //   // var ctx = canvas.getContext("2d");
      //   // var image = new Image();

      //   // image.onload = function() {
      //   //   console.log(image.height);
      //   //   ctx.drawImage(image, 0, 0, image.width, pageHeight);
      //   //   draw = true
      //   // }
      //   // if (image.complete) {
      //   //   console.log(image.height);
      //   //   ctx.drawImage(image, 0, 0, image.width, pageHeight);
      //   //   draw = true
      //   // }
      //   // while(draw == false)
      //   //   await new Promise(r => setTimeout(r, 500));
      //   // image.src = imgData;
      //   // image.width = canvas.width;
      //   // image.height = height
      // });
      $('#preview').css({
        height : '297mm'
      })
      $(document.body).css({
        height : document.body.scrollHeight
      })
      GraphManager.ref_Component.removeBusy();

    },
    ToImages: async function() {
      window.onscroll = function() {
        window.scrollTo(0, 0);
      };
      $('#preview').css({
        height : document.body.scrollHeight
      })
      $(document.body).css({
        height : document.body.scrollHeight
      })
      var indicateurElements = $('#preview').find('.indicateurComposante');
      window.scroll(0, 0);
			document.getElementsByTagName('gridster')[0].scroll(0,0);
      document.getElementById('preview').scroll(0, 0);
			  //console.log(indicateurElements);
			  for (var i = 0; i< indicateurElements.length;  i++ ) {
				  var currentElement = $(indicateurElements[i]).parent().attr('id');
				  console.log($(indicateurElements[i]).parent().attr('id'));
				  await html2canvas(document.getElementById(currentElement).parentElement, {
            useCors : true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            scale: 1,
            width: $("#"+currentElement).scrollWidth,
            height: $("#"+currentElement).scrollHeight,
            windowHeight: $("#"+currentElement).scrollHeight,
            windowWidth: $("#"+currentElement).scrollWidth
				 }
				).then(canvas => {
					var imgData = canvas.toDataURL('image/png');
					  var img = new Image();
					  if(img.complete) {
              console.log($("#"+currentElement));
              $("#"+currentElement).html(img);
					  }
					  img.onload = function() {
					  }
					  img.src = imgData;
					  $(img).css({
              width : '100%',
              height : '100%',
					  })
					})
			  }
        $('#preview').css({
          height : '297mm'
        })
        $(document.body).css({
          height : document.body.scrollHeight
        })
    }
}

