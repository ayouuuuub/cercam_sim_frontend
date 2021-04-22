class PrintCart {

  constructor() {
    this.logoImage = new Image();
    this.imgDerection = new Image();
    this.imagesBase64 = [];
    this.valueMapDefault = 'Fonds        : Carte topographique';

  }
  async printCart(wms, print) {
    var extent = myExtObject.initLayer.getSource().getExtent();
    await myExtObject.map.getView().fit(extent, myExtObject.map.getSize());
    myExtObject.map.updateSize();
    var currentIndecators = myExtObject.vectorLayerList;
    console.log(currentIndecators.length);
    if (myExtObject.vectorLayerWMSList && myExtObject.vectorLayerWMSList.length > 0 && myExtObject.vectorLayerList && myExtObject.vectorLayerList.length == 0) {
      wms = true;
    }
    /*  if (myExtObject.vectorLayerList.length > 1 && $('.legendCss').length == 1) {
         return this.printHistograme(currentIndecators, wms, print);
     } else { */
      if(myExtObject.vectorLayerList.length > 0)
        return this.printAllFrom(currentIndecators, wms, print);
      else
        myExtObject.ref_Component.showCustomWarning("Veuillez d'abord visualiser un indicateur ");
    /* } */
  }

  async printAllFrom(currentIndecatorsIn, wms, print) {
    myExtObject.ref_Component.addBusy();
    if ((currentIndecatorsIn && currentIndecatorsIn.length == 0) || !currentIndecatorsIn) return;
    var currentIndecators = []
    currentIndecators.push(Object.assign({}, currentIndecatorsIn[0]));
    if (myExtObject.vectorLayerList[0] && myExtObject.vectorLayerList[0].composentIdentiteLayerList.length > 0 && myExtObject.vectorLayerList[0].composentIdentiteLayerList[0]) {
      currentIndecators.unshift(Object.assign({}, myExtObject.vectorLayerList[0].composentIdentiteLayerList[0]))
    }
    var canvas2 = document.createElement('canvas');
    canvas2.id = "legend-imge";
    canvas2.width = 1224;
    canvas2.height = 768;
    var ctx = canvas2.getContext("2d");

    //Map
    console.log($('#map canvas'))
    var canvas = $('#map canvas')[0];
    console.log(canvas);
    var mapCanvas = document.createElement('canvas');
    mapCanvas.width = canvas.width;
    mapCanvas.height = canvas.height;
    var mapCtx = mapCanvas.getContext("2d");
    var mapReady = 0;
    var fondImage = new Image();
    fondImage.onload = function() {
      mapCtx.drawImage(fondImage, 0, 0);
      mapReady++;
    }
    fondImage.src = $('#map canvas')[0].toDataURL('image/png');
    fondImage.width = $('#map canvas')[0].width;
    fondImage.height = $('#map canvas')[0].height;
    if($('#map canvas')[1]) {
      var LayerImage = new Image();
      LayerImage.onload = function() {
        mapCtx.drawImage(LayerImage, 0, 0);
        mapReady++;
      }
      LayerImage.src = $('#map canvas')[1].toDataURL('image/png');
      LayerImage.width = $('#map canvas')[1].width;
      LayerImage.height = $('#map canvas')[1].height;
    }
    else
      mapReady++

    this.tabValeurposi = [];
    this.tabValeurposi = this.gettabOfimagesAndPosition(ctx);

    // var canvas_img = window.document.querySelector('#map canvas');
    // canvas_img.setAttribute('crossorigin', 'anonymous')
    while (mapReady < 2)
      await new Promise( r => setTimeout(r, 100));
    var data = mapCanvas.toDataURL('image/png');
    // console.log(data);

    var imgMap = new Image();
    imgMap.onload = function() {
      console.log(imgMap);
    }
    imgMap.src = data;
    imgMap.width = canvas.width;
    imgMap.height = canvas.height;


    //legend
    var imgsLegend = [];
    var sourceMap = " ";
    var titleOfCart = "";
    console.log(currentIndecators.length);
    for (var i = 0; i < currentIndecators.length; i++) {
      console.log(currentIndecators[i]);
      var currentIndecator = currentIndecators[i]
      if(currentIndecator.id) {
        console.log(myExtObject.vectorLayerList[0].composentIdentiteLayerList);
        if (myExtObject.vectorLayerList[0].composentIdentiteLayerList.length > 0 && $('.legendCss').length == 1 && $('.legendCss')[0].id == "legend-group-indicateur") {
          var imgLegend = new Image();
          var imgsLegend = [];
          console.log('histogramme');
          $('')
          imgLegend = await this.toImageDegradeColor(currentIndecator.indecator, ctx);
          imgsLegend.push(imgLegend);
          var firstIndector = myExtObject.vectorLayerList[0].composentIdentiteLayerList[0]
          titleOfCart = firstIndector.label;
          sourceMap = ((firstIndector.source) ? firstIndector.source : " ");
        } else if (currentIndecator.indecator && currentIndecator.indecator.modeRepresentation == 'DEGRADE_COULEUR') {
          var imgLegend = new Image();
          //  var imgsLegend = [];
          console.log('2');
          imgLegend = await this.toImageDegradeColor(currentIndecator.indecator, ctx);
          imgsLegend.push(imgLegend);
          titleOfCart = titleOfCart + currentIndecator.indecator.titre;
          titleOfCart = (titleOfCart && titleOfCart.length > 0 && (currentIndecators.length) > (i + 1)) ? titleOfCart + " - " : titleOfCart;
          sourceMap = sourceMap + ((currentIndecator.indecator.source) ? currentIndecator.indecator.source : " ");
        } else if (currentIndecator.indecator && currentIndecator.indecator.modeRepresentation != 'DEGRADE_COULEUR') {
          var imgLegend = new Image();
          //var imgsLegend = [];

          imgLegend = this.toImageSymbol(currentIndecator.indecator, ctx);
          imgsLegend.push(imgLegend);
          titleOfCart = titleOfCart + currentIndecator.indecator.titre
          titleOfCart = (titleOfCart && titleOfCart.length > 0 && (currentIndecators.length) > (i + 1)) ? titleOfCart + " - " : titleOfCart;
          sourceMap = sourceMap + ((currentIndecators.length > 2) ? " - " : " ") + ((currentIndecator.indecator.source) ? currentIndecator.indecator.source : "")
        }
      }
    }
    console.log(imgsLegend);
    //echel
    var imgEchel = this.toImageEchel(ctx)
    // couche externe
    var imgWms = this.toImageWms(ctx);
    // console.log(imgMap);
    //transform to one image for print
    var images = await this.convertToOneImg(print, imgMap, imgsLegend, imgEchel, titleOfCart, sourceMap, wms, imgWms, this.tabValeurposi);
    // console.log("++ ", myExtObject.vectorLayerList);
    // console.log("LogoOdt", myExtObject.logoOdtImage);
    // console.log("LogoMinistre", myExtObject.logoMinistreImage);
    if (myExtObject.vectorLayerList[0].composentIdentiteLayerList[0]) {
      console.log("before : ", currentIndecators)
      // currentIndecators.splice(0, 1); // first element removed
      console.log("after : ", currentIndecators)
    }
    return images;

  }

  toImageWms(ctx) {

    var imgWms = new Image();

    var divGlobal = $('<div>' +
      '<h3 style="margin: 5px 3px;">Couches externes</h3>' +
      '<div id="wmsLayer"></div>' +
      '<div>')

    for (let layer of myExtObject.vectorLayerWMSList) {
      console.log(layer.node)
      if (layer.node && layer.node.label)
        divGlobal.find("#wmsLayer").append('<h5 style=" font-size: 12px;margin: 2px 0px; font-style: italic;"> * ' + layer.node.label + '</h5>')
    }

    var html = divGlobal.html();
    console.log(html);
    //html = html.replace(/"/g, "'");
    //// console.log(html)
    var dataHtml = "data:image/svg+xml," +
      "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
      "<foreignObject width='100%' height='100%'>" +
      "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px;'>" +
      html + "</div>" +
      "</foreignObject>" +
      "</svg>";
    imgWms.src = dataHtml;
    imgWms.onload = function () {
      ctx.drawImage(imgWms, 0, 0);
    }
    return imgWms;

  }

  extractTranslateFromTransform(transform) {
    var currTrans = transform.split(/[()]/)[1]
    console.log(currTrans);
    let translateValue = {};
    if (currTrans) {
            translateValue.x = currTrans.split(',')[4];
            translateValue.y = currTrans.split(',')[5];
    }
    return translateValue;
  }

  gettabOfimagesAndPosition(ctx) {
    console.log(" myExtObject.vectorLayerList .................:", myExtObject.vectorLayerList);
    console.log(" myExtObject.vectorLayerList lenght .................:", myExtObject.vectorLayerList[0].composentIdentiteLayerList.length);
    var tab = [];
    let heightOoOverlayDiv,
        widthToOverlayDiv,
        tabOffsetInHistogramme = [],
        self = this;
    if (myExtObject.vectorLayerList[0].composentIdentiteLayerList.length > 0 && $('.legendCss').length == 1 && $('.legendCss')[0].id == "legend-group-indicateur") {
      console.log("  ol-overlay-container   exist .....");
      var divsFromMap = $('.ol-overlay-container').each(function (index) {
        if ($(this)[0].attributeStyleMap.size == 3 && $(this)[0].childNodes.length > 0) {

          var imgoverlay = new Image();
          var canvasdivoverlay = $(this);
          var html = canvasdivoverlay.html();

          html = html.replace(/"/g, "'");

          // SilentGhostXV
          html = html.replace(/#/g, "");
          html = html.replace(/B18904/g, "rgb(177,137,4)");
          html = html.replace(/21610B/g, "rgb(33,97,11)");
          html = html.replace(/610B4B/g, "rgb(97,11,75)");
          html = html.replace(/0404B4/g, "rgb(4,4,180)");
          html = html.replace(/6E6E6E/g, "rgb(110,110,110)");
          html = html.replace(/81F7F3/g, "rgb(129,247,243)");
          html = html.replace(/FF9655/g, "rgb(255,150,85)");
          html = html.replace(/FFF263/g, "rgb(255,242,99)");
          html = html.replace(/6AF9C4/g, "rgb(106,249,196)");
          html = html.replace(/003300/g, "rgb(0,51,0)");
          html = html.replace(/adc2eb/g, "rgb(173,194,235)");
          html = html.replace(/ffffcc/g, "rgb(255,255,204)");
          html = html.replace(/a3a3c2/g, "rgb(163,163,194)");
          html = html.replace(/B18904/g, "rgb(177,137,4)");
          html = html.replace(/21610B/g, "rgb(33,97,11)");
          html = html.replace(/610B4B/g, "rgb(97,11,75)");


          var dataHtml = "data:image/svg+xml," +
            "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>" +
            "<foreignObject width='100%' height='100%'>" +
            "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px;'>" +
            html +
            "</div>" +
            "</foreignObject>" +
            "</svg>";
          imgoverlay.src = dataHtml;
          imgoverlay.onload = function () {
            ctx.drawImage(imgoverlay, 0, 0);
          }
            switch (myExtObject.zoomValeur) {
              default:
                  heightOoOverlayDiv = 85;
                  widthToOverlayDiv = 100;
                  tabOffsetInHistogramme[0] = -50;
                  tabOffsetInHistogramme[1] = -84;
                  break;
              case 5.5:
                  heightOoOverlayDiv = 70;
                  widthToOverlayDiv = 90;
                  tabOffsetInHistogramme[0] = -40;
                  tabOffsetInHistogramme[1] = -70;
                  break;
              case 5:
                  heightOoOverlayDiv = 53;
                  widthToOverlayDiv = 70;
                  tabOffsetInHistogramme[0] = -36;
                  tabOffsetInHistogramme[1] = -52;
                  break;
              case 4.5:
                  heightOoOverlayDiv = 42;
                  widthToOverlayDiv = 67;
                  tabOffsetInHistogramme[0] = -36;
                  tabOffsetInHistogramme[1] = -38;
                  break;
            }
          tab.push({
            "image": imgoverlay,
            "id": $(this)[0].children[0].id,
            "left": self.extractTranslateFromTransform($(this).css("transform")).x,
            "top": self.extractTranslateFromTransform($(this).css("transform")).y
          })
          console.log($(this).css("transform"));
          console.log(self.extractTranslateFromTransform($(this).css("transform")));


        }

      });
      console.log(tab);
      return tab;
    } else {
      console.log("  ol-overlay-container n'exist  Pas  .....");
    }


  }



  /*  toImageDegradeColor2(currentIndecator, ctx) {

       var html;
       var dataHtml;
       var imgLegend = new Image();




       var legendDegrade = $('#legend-group-indicateur').clone();

       legendDegrade.find('.geostats-legend-title').css({ "margin": "3px 10px 10px 10px", "font-weight": "bold", "font-size": "15px", "font-family": "Arial" })
       var height = 25;
       legendDegrade.find('.geostats-legend-block').each(function(index) {
           var color = $(this).css('backgroundColor');
           $(this).css({ "background-color": color })
           $(this).css({
               "margin": "0px 5px 0px 0px",
               "border": "1px solid #555555",
               "display": "inline-block",
               "float": "left",
               "height": "15px",
               "width": " 30px"
           })
           $(this).parent().css({ "font-size": "15px", "display": "block", "margin": "3px 10px 5px 10px" });
           height += 30
       });


       var html = legendDegrade.html();
       html = html.replace(/"/g, "'");

       var dataHtml = "data:image/svg+xml," +
           "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='" + height + "'>" +
           "<foreignObject width='100%' height='100%'>" +
           "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px'>" +
           html +
           "</div>" +
           "</foreignObject>" +
           "</svg>";
       imgLegend.src = dataHtml;


       imgLegend.onload = function() {
           ctx.drawImage(imgLegend, 0, 0);

           imgLegend.src = ctx.toDataURL("image/jpeg");
       }


       return imgLegend;
   } */
  toImageEchel(ctx) {

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
      var html = $('.ol-scale-line').html();
      html = html.replace(/"/g, "'");
      // console.log(html);
      var dataHtml = "data:image/svg+xml," +
        "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
        "<foreignObject width='100%' height='100%'>" +
        "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px;'>" +
        "<div style=' width:" + $($('.ol-scale-line .ol-scale-line-inner').get(0)).css('width') + ";padding:2px;  border-radius :" + $($('.ol-scale-line').get(0)).css('borderRadius') + "; background: " + $($('.ol-scale-line').get(0)).css('background') + "'>" + html + "</div>" +
        "</div>" +
        "</foreignObject>" +
        "</svg>";

      imgEchel.src = dataHtml;
      imgEchel.onload = function () {
        ctx.drawImage(imgEchel, 0, 0);
      }
      return imgEchel;
    }
  }

  toImageSymbol(currentIndecator, ctx) {


    var textLength = ($('#legend-' + currentIndecator.id + ' .geostats-legend-title').text() && $('#legend-' + currentIndecator.id + ' .geostats-legend-title').text().length > 0) ?
      $('#legend-' + currentIndecator.id + ' .geostats-legend-title').text().length * 2 : 0;
    var allImgLegendCercle = new Image();
    var canvas2 = document.createElement('canvas');
    var canvasCercle = $('#legend-imag-' + currentIndecator.id)[0];
    var ctx2 = canvas2.getContext("2d");
    canvas2.id = "legend-imge";
    canvas2.width = canvasCercle.width + textLength + 10;
    canvas2.height = canvasCercle.height + 40;

    if (currentIndecator && currentIndecator.modeRepresentation != 'DEGRADE_COULEUR') {

      var text = $('#legend-' + currentIndecator.id + ' .geostats-legend-title').text();
      /***
       * @anasloufissi Split string .
       */
      if (text.length > 30) {
        // console.log(canvasCercle.height)
        var canvasCercleheight = canvasCercle.height - 20;
        ctx2.drawImage(canvasCercle, 10, 75, canvasCercle.width, canvasCercleheight);
        ctx2.fillStyle = "#000";
        ctx2.strokeStyle = "#000";
        ctx2.font = "bold 11pt Arial";
        var middle = Math.floor(text.length / 2);
        var before = text.lastIndexOf(' ', middle);
        var after = text.indexOf(' ', middle + 1);

        if (middle - before < after - middle) {
          middle = before;
        } else {
          middle = after;
        }
        var s1 = text.substr(0, middle);
        var s2 = text.substr(middle + 1);
        // console.log("The Lenght ",text.length)
        // console.log("The First Part : ",s1);
        // console.log("The second part : ",s2);
        ctx2.fillText(s1, 5, 50, 400);
        ctx2.fillText(s2, 5, 70, 400);
      } else {
        /***
         * @anasloufissi set text in the photo
         */
        ctx2.drawImage(canvasCercle, 10, 65, canvasCercle.width, canvasCercle.height);
        ctx2.fillStyle = "#000";
        ctx2.strokeStyle = "#000";
        ctx2.font = "bold 11pt Arial";
        ctx2.fillText(text, 5, 50, 550);
        // ctx2.fillText(s1, 5, 50, 300);
        // ctx2.fillText(s2, 5, 70, 300);

        /***
         * End
         */
      }


      /***
       * End Spliting
       */

      /*  if(text && text.length > 15){
           text
       } */
      // ctx2.fillText(text, 5, 50, 300);

      // ctx2.fillText(text, 5, 50, 300);
      allImgLegendCercle.src = canvas2.toDataURL('image/png')
      allImgLegendCercle.width = canvas2.width;
      allImgLegendCercle.height = canvas2.height;

      return allImgLegendCercle;

    }

  }


  async toImageDegradeColor(currentIndecator, ctx) {
    var html;
    var dataHtml;
    var imgLegend = new Image();
    if (currentIndecator && currentIndecator.modeRepresentation == 'DEGRADE_COULEUR' && $('.legendCss').length >= 1) {
      var legendDegrade = $('#legend-' + currentIndecator.id).clone();
      if ($('#legend-' + currentIndecator.id + ' .geostats-legend-title')) {


        legendDegrade.find('.geostats-legend-title').css({
          "margin": "3px 10px 10px 10px",
          "font-weight": "bold",
          "font-size": "15px",
          "font-family": "Arial"
        })
        var height = 25;
        legendDegrade.find('.geostats-legend-block').each(function (index) {
          var color = $(this).css('backgroundColor');
          $(this).css({
            "background-color": color
          })
          $(this).css({
            "margin": "0px 5px 0px 0px",
            "border": "1px solid #555555",
            "display": "inline-block",
            "float": "left",
            "height": "15px",
            "width": " 30px"
          })
          $(this).parent().css({
            "font-size": "15px",
            "display": "block",
            "margin": "3px 10px 5px 10px"
          });
          //, "font-weight": "bold"  "font-weight": "bold",
          height += 30
        });
      }
      var html = legendDegrade.html();

      dataHtml = "data:image/svg+xml," +
        "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='" + height + "'>" +
        "<foreignObject width='100%' height='100%'>" +
        "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px'>" +
        html +
        "</div>" +
        "</foreignObject>" +
        "</svg>";
      while (dataHtml == undefined || dataHtml == null)
          await new Promise(r => setTimeout(r, 100));
    }
    if (myExtObject.vectorLayerList[0].composentIdentiteLayerList.length > 0 && $('.legendCss').length == 1 && $('.legendCss')[0].id == "legend-group-indicateur") {
      var legendDegrade = $('#legend-group-indicateur').clone();
      console.log('in');
      legendDegrade.find('.geostats-legend-title').css({
        "margin": "3px 10px 10px 10px",
        "font-weight": "bold",
        "font-size": "15px",
        "font-family": "Arial"
      })
      var height = 25;
      legendDegrade.find('.geostats-legend-block').each(function (index) {
        var color = $(this).css('backgroundColor');
        $(this).css({
          "background-color": color
        })
        $(this).css({
          "margin": "0px 5px 0px 0px",
          "border": "1px solid #555555",
          "display": "inline-block",
          "float": "left",
          "height": "15px",
          "width": " 30px"
        })
        $(this).parent().css({
          "font-size": "15px",
          "display": "block",
          "margin": "3px 10px 5px 10px"
        });
        height += 30
      });
      var html = legendDegrade.html();

      html = html.replace(/"/g, "'");

          // SilentGhostXV
          html = html.replace(/#/g, "");
          html = html.replace(/B18904/g, "rgb(177,137,4)");
          html = html.replace(/21610B/g, "rgb(33,97,11)");
          html = html.replace(/610B4B/g, "rgb(97,11,75)");
          html = html.replace(/0404B4/g, "rgb(4,4,180)");
          html = html.replace(/6E6E6E/g, "rgb(110,110,110)");
          html = html.replace(/81F7F3/g, "rgb(129,247,243)");
          html = html.replace(/FF9655/g, "rgb(255,150,85)");
          html = html.replace(/FFF263/g, "rgb(255,242,99)");
          html = html.replace(/6AF9C4/g, "rgb(106,249,196)");
          html = html.replace(/003300/g, "rgb(0,51,0)");
          html = html.replace(/adc2eb/g, "rgb(173,194,235)");
          html = html.replace(/ffffcc/g, "rgb(255,255,204)");
          html = html.replace(/a3a3c2/g, "rgb(163,163,194)");
          html = html.replace(/B18904/g, "rgb(177,137,4)");
          html = html.replace(/21610B/g, "rgb(33,97,11)");
          html = html.replace(/610B4B/g, "rgb(97,11,75)");


          var dataHtml = "data:image/svg+xml," +
            "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>" +
            "<foreignObject width='100%' height='100%'>" +
            "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px;'>" +
            html +
            "</div>" +
            "</foreignObject>" +
            "</svg>";
          // imgoverlay.src = dataHtml;
      // html2canvas(document.getElementsByClassName('legendCss')[0]).then((canvas)=> {
      //   dataHtml = canvas.toDataURL( 'image/png', '1.0');
      //   console.log(dataHtml);
      // })
      while (dataHtml == undefined || dataHtml == null)
        await new Promise(r => setTimeout(r, 100));
    }
    height += 90
    var htmlcharts = legendDegrade.find("#tableid").html();

    var divtable = $("<div id='tableid'></div>");
    divtable.append(htmlcharts);

    legendDegrade.find("#tableid").replaceWith(divtable);
    /***
     * The End
     */

    console.log(dataHtml);

    imgLegend.src = dataHtml;

    imgLegend.onload = function () {
      ctx.drawImage(imgLegend, 0, 0);
    }


    return imgLegend;
  }

  async convertToOneImg(print, map, legends, imgEchel, titleOfCart, sourceMap, wms, imgWms, tabValeurposi) {
    console.log(tabValeurposi);
    if (tabValeurposi) {
      var tabval = tabValeurposi;
      console.log("table des valeurs :", tabval);

    }
    console.log("convert to one image");
    var canvas = document.createElement('canvas');
    canvas.id = "image-print";
    canvas.width = map.width + 300;
    canvas.height = map.height + 25;

    var c = canvas;
    var ctx = c.getContext("2d");

    // bg color img
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, map.width + 300, map.height + 25);

    //border color img
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(0, 0, map.width + 300, map.height + 25);

    //border color map
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(3, 3, map.width - 3, map.height - 50);

    //border color source map
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(3, map.height - 43, map.width - 3, 65);
    // console.log("wms :", wms)
    if (!wms) {
      // source map
      ctx.fillStyle = "#000";
      ctx.strokeStyle = "#000";
      ctx.font = "italic bold 9pt Arial";
      // ctx.fillText("Source : " + sourceMap, 6, map.height + 15);
      // Author: Ghost
      ctx.fillText("Réalisation: Observatoire Régionale des Dynamiques Territoriales/DAT", 6, map.height + 15);
    } else {
      ctx.fillStyle = "#000";
      ctx.strokeStyle = "#000";
      ctx.font = "italic bold 9pt Arial";
      ctx.fillText("Source : " + sourceMap, 6, map.height + 15);
    }

    //border color legend
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 0;
    ctx.strokeRect(map.width + 4, 3, 293, map.height + 18);

    //line of logo
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(map.width + 20, 136);
    ctx.lineTo(map.width + 275, 136);
    ctx.stroke();
    ctx.closePath();

    var logoImag = new Image();
    logoImag.src = this.logoImage.src;
    var derectionMapImag = new Image();
    derectionMapImag.src = this.imgDerection.src;
    var nord_sud = new Image();
    nord_sud.src = "./assets/images/nord_sud.png";

    var logo = new Image();
    logo.src = myExtObject.logoMinistreImage;
    console.log(legends);
    var sources = {
      imageObj1: map,
      imageObj2: imgEchel,
      imageObj3: nord_sud,
      imageObj4: logo,
      imageObj5: logo,
      imageObj6: imgWms,
      // Author: Ghost
      // imageObj7: "./assets/img/header-right.png",
      // imageObj8: "./assets/img/map-footer-right.png",
      /***
       * @anasloufissi
       */
      //imageObj7: imgBar
      /***
       * End
       */
    };
    let lgdsReady = 0;
    for (var i in legends) {
      var id = (i + 7);
      while(!legends[i].complete) {
        await new Promise(r => setTimeout(r, 100));
      }
      if(legends[i].complete) {
        sources["imageObj" + id] = legends[i];
        lgdsReady++;
        console.log(sources["imageObj" + id]);
      }
      else
      legends[i].onload = function () {
        sources["imageObj" + id] = legends[i];
        lgdsReady++;
      }
    }

    var imgs = this.createImagesAndPrint(c, ctx, sources, print, titleOfCart, map, legends, tabval);
    if (print) {
      this.createImagesAndPrintCopy(c, ctx, sources, print, titleOfCart, map, legends, tabval);
    }
    //this.createImagesAndPrintCopy(c, ctx, sources, print, titleOfCart, map, legends, tabval);
    // console.log(imgs);

    // canvas = document.getElementsByTagName('canvas')[0];

    // console.log(canvas.toDataURL());

    // canvas.toBlob(function (blob) {
    //   saveAs(blob, 'map.png');
    // })

    //return exportImag;

  }

  // createImagesAndPrint2(c, ctx, sources, print, titleOfCart, map, legend, tabval) {
  //   var tabvaleur = tabval;
  //   var _this = this;
  //   var wait = false;
  //   var imgs = this.loadImages(sources, function (images) {
  //     images.onload = function (){
  //       console.log('drawing');
  //     html2canvas(document.getElementsByTagName('canvas')[0]).then( canvas => {
  //       console.log('...............canvas : ', canvas);
  //       var imgData = canvas.toDataURL('image/png');
  //       imgData.width = canvas.width; // 210
  //       imgData.height = canvas.height;
  //       ctx.drawImage(images.imageObj1, 3, 3, map.width - 3, map.height - 6);

  //     })

  //     //if (print) this.imagesBase64.imageObj1 = { image: images.imageObj1, base64: _this.imageToBase64(images.imageObj1) }

  //     ctx.drawImage(images.imageObj2, 2, map.height - 22, 200, 200);
  //     //if (print) this.imagesBase64.imageObj2 = { image: images.imageObj2, base64: _this.imageToBase64(images.imageObj2) }

  //     ctx.drawImage(images.imageObj3, 40, map.height - 80, 50, 50);
  //     // if (print) this.imagesBase64.imageObj3 = { image: images.imageObj3, base64: _this.imageToBase64(images.imageObj3) }

  //     ctx.drawImage(images.imageObj4, map.width + 8, 8, 150, 70);
  //     // if (print) this.imagesBase64.imageObj4 = { image: images.imageObj4, base64: _this.imageToBase64(images.imageObj4) }

  //     ctx.drawImage(images.imageObj5, map.width + 164, 10, 130, 55);
  //     // if (print) this.imagesBase64.imageObj5 = { image: images.imageObj5, base64: _this.imageToBase64(images.imageObj5) }
  //     /*           var j=6;
  //     for (let i=0;i<=tabvaleur.length-1;i++){

  //        ctx.drawImage(images.imageObj6,tabvaleur[i].left+15,tabvaleur[i].top+60, 200, 200);



  //     } */

  //     for (let i = 0; i <= tabvaleur.length - 1; i++) {
  //       ctx.drawImage(tabvaleur[i].image, tabvaleur[i].left - 80, tabvaleur[i].top - 20, 250, 350);
  //     }

  //     var offsetTop = 250;
  //     for (var i in legend) {
  //       var id = (i + 6);
  //       ctx.drawImage(images['imageObj' + id], map.width + 15, offsetTop, legend[i].width, legend[i].height);
  //       //  if (print) this.imagesBase64['imageObj' + id] = { image: images['imageObj' + id], base64: _this.imageToBase64(images['imageObj' + id]) }
  //       offsetTop = offsetTop + legend[i].height;
  //     }
  //   //   if(!print)   {
  //   //     c.toBlob(function (blob) {
  //   //         this.delay(1000);
  //   //       saveAs(blob, (titleOfCart) ? titleOfCart : "Cart");

  //   //     });
  //   //   }
  //   //   else {
  //   //     var imgData = c.toDataURL("image/jpeg", 1.0);
  //   //     var pdf = new jsPDF();
  //   //     pdf.addImage(imgData, 'jpeg', 0, 0);
  //   //     pdf.save((titleOfCart) ? titleOfCart : "Carte");
  //   // }
  //   }

  //   });
  //   return imgs;

  // }
  async createImagesAndPrint(c, ctx, sources, print, titleOfCart, map, legend, tabval) {
    var tabvaleur = tabval;
    var drawn1 = false,
        drawn2 = false,
        drawn3 = false,
        drawn4 = false,
        drawn5 = false,
        drawn6 = false,
        drawn7 = false;

    var _this = this;
    var wait = false;
    /***
     * @anasloufissi
     * @description 5- anomalies au niveau de la source et fond de la carte :
     * La source intégrée dans la plateforme est ONDH.. alors dans le pieds
     * de page on remarque que la source est toujours fixe RGPH 2014 et le fonds est openstreemap alors qu’il est fond satellite).,
     */
    var fonds = this.returnValueMap();
    // console.log("Fonds" , fonds)
    var producteur = this.returnProducteur();
    // console.log("producteur" , producteur)
    var sourceIndicateur = this.returnSource()
    // console.log("sourceIndicateur",sourceIndicateur)
    /***
     * End
     */

      console.log('begin');
      if (sources.imageObj1.complete) {
        ctx.globalCompositeOperation='source-over';
        ctx.drawImage(sources.imageObj1, 3, 3, map.width - 3, map.height - 50);
        drawn1 = true;
      } else {
        sources.imageObj1.onload = function () {
          ctx.globalCompositeOperation='source-over';
          ctx.drawImage(sources.imageObj1, 3, 3, map.width - 3, map.height - 50);
          drawn1 = true;
        };
      }
      // ctx.drawImage(document.getElementsByTagName('canvas')[0], 3, 3, map.width - 3, map.height - 50);

      // html2canvas($('#map canvas')).then( canvas => {
      //   console.log('...............canvas : ', canvas);
      //   var imgData = canvas.toDataURL('image/png');
      //   ctx.drawImage(imgData, 3, 3, 210, 500);

      // })
      // console.log(legend[0].outerHTML);// legend
      // legend[0].onload = function () {
      //   ctx.drawImage(legend[0], map.width  + 30, 10, 200, 200);
      // };

      // ctx.globalCompositeOperation='source-over';
      if (sources.imageObj3.complete) {
        ctx.globalCompositeOperation='source-over';
        ctx.drawImage(sources.imageObj3, 40, 40, 50, 50);
        drawn3 = true;
      } else {
        sources.imageObj3.onload = function () {
          ctx.globalCompositeOperation='source-over';
          ctx.drawImage(sources.imageObj3, 40, 40, 50, 50);
          drawn3 = true;
        };
      }

      // Author: Ghost
      // ctx.globalCompositeOperation='source-over';
      // console.log(sources.imageObj4); // logo d'export
      if(myExtObject.logoMinistreImage){
        if (sources.imageObj4.complete) {
          ctx.globalCompositeOperation='source-over';
          ctx.drawImage(sources.imageObj4, map.width + 10, 8, 260, 100);
          drawn4 = true;
        } else {
          sources.imageObj4.onload = function () {
            ctx.globalCompositeOperation='source-over';
            ctx.drawImage(sources.imageObj4, map.width + 10, 8, 260, 100);
            drawn4 = true;
          };
        }
      }
      //ctx.drawImage(sources.imageObj5, map.width * 0.83, map.height - 40, map.width * 0.15, 60);
      // ctx.drawImage(images.imageObj7, 5 , map.height - 40 , map.width / 2 , 80);

      /* @description 5- anomalies au niveau de la source et fond de la carte :
       * La source intégrée dans la plateforme est ONDH.. alors dans le pieds
       * de page on remarque que la source est toujours fixe RGPH 2014 et le fonds est openstreemap alors qu’il est fond satellite).,
       */
      if (myExtObject.vectorLayerList && myExtObject.vectorLayerList[0].indecator && myExtObject.vectorLayerList[0].composentIdentiteLayerList[0]) {
        // console.log("Double Indicateur ")
        ctx.font = "8px Arial";
        var producteurInducateurOne = '';
        var sourceIndicateurOne = ' ';
        var producteurInducateurtow = '';
        var sourceInducateurtow = '';
        console.log(myExtObject.vectorLayerList[0]);
        if ((myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].indecator && myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].indecator.producteur.nom ) || (myExtObject.vectorLayerList[0].indecator && myExtObject.vectorLayerList[0].indecator.producteur.nom)) {
          producteurInducateurOne = myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].indecator? myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].indecator.producteur.nom : (myExtObject.vectorLayerList[0].indecator ? myExtObject.vectorLayerList[0].indecator.producteur.nom : null);
          ctx.strokeText("Production : " + producteurInducateurOne, 10, map.height - 30);
        } else {
          ctx.strokeText("Production : " + producteurInducateurOne, 10, map.height - 30);
        }
        if ((myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].indecator && myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].indecator.source ) || (myExtObject.vectorLayerList[0].indecator && myExtObject.vectorLayerList[0].indecator.source)) {
          sourceIndicateurOne = myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].indecator? myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].indecator.producteur.source : (myExtObject.vectorLayerList[0].indecator ? myExtObject.vectorLayerList[0].indecator.source : null);
          ctx.strokeText("Source       : " + sourceIndicateurOne, 10, map.height - 17);
        } else {
          ctx.strokeText("Source       : " + sourceIndicateurOne, 10, map.height - 17);
        }
        ctx.strokeText(fonds, 10, map.height - 3);
        // if (myExtObject.vectorLayerList[0].indecator.producteur.nom) {
        //   producteurInducateurtow = myExtObject.vectorLayerList[0].indecator.producteur.nom;
        //   ctx.strokeText("Production : " + producteurInducateurtow, 250, map.height - 30);
        // } else {
        //   ctx.strokeText("Production : " + producteurInducateurtow, 250, map.height - 30);
        // }
        // if (myExtObject.vectorLayerList[0].indecator.source) {
        //   sourceInducateurtow = myExtObject.vectorLayerList[0].indecator.source;
        //   ctx.strokeText("Source       : " + sourceIndicateur, 250, map.height - 17);
        // } else {
        //   ctx.strokeText("Source       : " + sourceIndicateur, 250, map.height - 17);
        // }
        ctx.strokeText(fonds, 250, map.height - 3);
      } else {
        ctx.strokeText("Production : " + producteur, 10, map.height - 30);
        ctx.strokeText("Source       : " + sourceIndicateur, 10, map.height - 17);
        ctx.strokeText(fonds, 10, map.height - 3);
      }

      /***
       * End ;
       */

      if (tabvaleur) {
        for (let i = 0; i <= tabvaleur.length - 1; i++) {

          if (tabvaleur[i].image.complete) {
            console.log(  tabvaleur[i].left, tabvaleur[i].top + 10 )
            ctx.globalCompositeOperation='source-over';
            ctx.drawImage(tabvaleur[i].image, tabvaleur[i].left, parseInt(tabvaleur[i].top) + 50, 300, 350);
            drawn5 = true;
          } else {
            tabvaleur[i].image.onload = function () {
              ctx.globalCompositeOperation='source-over';
              console.log(  tabvaleur[i].left, tabvaleur[i].top + 10 )
              ctx.drawImage(tabvaleur[i].image, tabvaleur[i].left, parseInt(tabvaleur[i].top) + 50, 300, 350);
              drawn5 = true;
            };
          }

        }
      }
      var offsetTop = 140;
      // console.log(legend.html);
      // console.log(legend[0].outerHTML);
      // legend :

      console.log(legend);
      for (var i in legend) {
        drawn7 = false;
        var id = (i + 7);
        // var id = int(i)+1;
        // console.log(legend[i].outerWidth() , legend[i].outerHeight());
        if (sources["imageObj" + id].complete) {
          ctx.globalCompositeOperation='source-over';
          console.log(sources["imageObj" + id]);
          ctx.drawImage(sources["imageObj" + id],  map.width + 10, offsetTop, sources["imageObj" + id].width, sources["imageObj" + id].height);
          drawn7 = true;
        } else {
            sources["imageObj" + id].onload = function () {
              ctx.globalCompositeOperation='source-over';
              ctx.drawImage(sources["imageObj" + id],  map.width + 10, offsetTop, sources["imageObj" + id].width, sources["imageObj" + id].height)
              drawn7 = true;
            };
        }
        offsetTop = (offsetTop - 30) + sources["imageObj" + id].height;
        // console.log("legend:               ", wLegend, hLegend, offsetTop);
      }

      // legend.onload = function() {
      //   ctx.drawImage(legend[0].outerHTML, map.width + 10, offsetTop, legend[0].width, legend[0].height);
      //   offsetTop = offsetTop + legend[0].height;
      // }


      if (myExtObject.vectorLayerWMSList && myExtObject.vectorLayerWMSList.length > 0) {
        drawn6 = false;
        // var id = int(i)+1;
        // console.log(id);
        if (sources.imageObj6.complete) {
          ctx.drawImage(sources.imageObj6, map.width + 10, offsetTop, sources.imageObj6.width, sources.imageObj6.height);
          drawn6 = true;
        } else {
          sources.imageObj6.onload = function () {
            ctx.globalCompositeOperation='source-over';
            drawn6 = true;
            ctx.drawImage(sources.imageObj6, map.width + 10, offsetTop, sources.imageObj6.width, sources.imageObj6.height);
          };
        }

        offsetTop = offsetTop + sources.imageObj6.height;
      }

          while(drawn1 == false || drawn3 == false || (myExtObject.logoMinistreImage != null && drawn4 == false)  || (tabvaleur!= null && tabvaleur.length> 0 && drawn5 == false) || drawn7 == false ) {
            console.log(drawn1, drawn2, drawn3, drawn4, ( drawn5), ( myExtObject.vectorLayerWMSList && myExtObject.vectorLayerWMSList.length > 0 && drawn6 == false), drawn7);
            await new Promise(r => setTimeout(r, 100));
          }
          if(!print)   {
            c.toBlob(function (blob) {
              saveAs(blob, (titleOfCart) ? titleOfCart : "Cart");
            });
          }
          else {
            c.toBlob(function (blob) {
              var url = URL.createObjectURL(blob);
              var printWindow = window.open(url, '', 'width='+c.width*1.2+',height='+c.height);
              printWindow.print()
              // var imgData = c.toDataURL("image/jpeg", 1.0);
              // var pdf = new jsPDF('p','px');
              // console.log(c.width);
              // console.log(c.height);
              });

            // const imgProps= pdf.getImageProperties(imgData);
            // const pdfWidth = pdf.internal.pageSize.getWidth();
            // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            // pdf.addImage(imgData, 'jpeg', 0, 0, c.width, c.height,'SLOW');
            // pdf.save((titleOfCart) ? titleOfCart : "Carte");
            }
            myExtObject.ref_Component.removeBusy();



    //return imgs;

  }

  delay(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

  async createImagesAndPrintCopy(c, ctx, sources, print, titleOfCart, map, legend, tabval) {
    var tabvaleur = tabval;
    var base64data = null;
    console.log(images.imageObj1);
    var imgs = this.loadImages(sources,async function (images) {
      sources.imageObj1.onload = function() {
        ctx.drawImage(images.imageObj1, 3, 3, map.width - 3, map.height - 50);
      }


      //ctx.drawImage(images.imageObj2, (map.width / 2) + 10, map.height - 20, 200, 200);
      ctx.drawImage(images.imageObj3, 40, 40, 50, 50);

      // Author: Ghost
      ctx.drawImage(images.imageObj4, map.width + 8, 8, 270, 120);
      ctx.drawImage(images.imageObj5, map.width * 0.83, map.height - 40, map.width * 0.15, 60);
      // ctx.drawImage(images.imageObj7, 5 , map.height - 40 , map.width / 2 , 60);
      if (tabvaleur) {
        for (let i = 0; i <= tabvaleur.length - 1; i++) {
          ctx.drawImage(tabvaleur[i].image, tabvaleur[i].left, tabvaleur[i].top, 250, 350);
        }
      }
      var offsetTop = 140;
      for (var i in legend) {
        var id = (i + 7);

        ctx.drawImage(images['imageObj' + id], map.width + 10, offsetTop, legend[i].width, legend[i].height);
        offsetTop = (offsetTop - 30) + legend[i].height;
      }
      if (myExtObject.vectorLayerWMSList && myExtObject.vectorLayerWMSList.length > 0) {
        ctx.drawImage(images.imageObj6, map.width + 10, offsetTop, images.imageObj6.width, images.imageObj6.height);
        offsetTop = offsetTop + images.imageObj6.height;
      }
      c.toBlob(function (blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          base64data = reader.result;
          myExtObject.ref_Component.exportIndicateurPdf({
            base64: base64data,
            code: "CARTE",
            libelle: "",
            img: null
          });
        }
      });
    });
  }


  // createMapWithHisto(map, tabval, sources, titleOfCart, print) {
  //
  //   var canvasHisto = document.createElement('canvas');
  //   canvasHisto.id = "image-print";
  //   canvasHisto.width = map.width - 3;
  //   canvasHisto.height = map.height - 50;
  //
  //   var c = canvasHisto;
  //   var ctxHisto = c.getContext("2d");
  //
  //   var tabvaleur = tabval;
  //   var base64data = null;
  //   var imgs = this.loadImages(sources, function(images) {
  //     ctxHisto.drawImage(images.imageObj1, 0, 0, map.width - 3, map.height - 50);
  //     if (tabvaleur) {
  //       for (let i = 0; i <= tabvaleur.length - 1; i++) {
  //         ctxHisto.drawImage(tabvaleur[i].image, tabvaleur[i].left - 80, tabvaleur[i].top - 10, 250, 350);
  //       };
  //     }
  //     if (!print) {
  //       c.toBlob(function(blob) {
  //         var reader = new FileReader();
  //         reader.readAsDataURL(blob);
  //         reader.onloadend = function() {
  //           base64data = reader.result;
  //           console.log(base64data);
  //         }
  //       });
  //     }
  //       // c.toBlob(function(blob) {
  //       //   saveAs(blob, (titleOfCart) ? titleOfCart : "Cart");
  //       // });
  //
  //   });
  //
  //   return base64data;
  // }

  loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for (var src in sources) {
      numImages++;
    }

    for (var src in sources) {

      // images[src] = {};
      images[src] = new Image();
      images[src].src = sources[src];
      images[src].onload = function () {
        if (++loadedImages >= numImages) {
          callback(images);
        }
      };
    }

    return images;
  }

  /***
   * @anasloufissi return the source of the indicator and the producor
   * in the simple indicateur and histrogramme .
   ** @description 5- anomalies au niveau de la source et fond de la carte :
   * La source intégrée dans la plateforme est ONDH.. alors dans le pieds
   * de page on remarque que la source est toujours fixe RGPH 2014 et le fonds est openstreemap alors qu’il est fond satellite).,
   */

  printValueOfTheMap(valeuMapp) {
    // console.log("Default Value  ",this.valueMapDefault )
    if (valeuMapp) {
      this.valueMapDefault = valeuMapp;
    }
    // console.log("Changed Value ",this.valueMapDefault)
  }

  returnValueMap() {
    return this.valueMapDefault
  }



  returnProducteur() {
    var producteur = '';
    // console.log("Value of the indicateur ",myExtObject.vectorLayerList)
    if (myExtObject.vectorLayerList && myExtObject.vectorLayerList[0].indecator && myExtObject.vectorLayerList[0].indecator.producteur) {
      // console.log("Nom De Producaeur ",myExtObject.vectorLayerList[0].indecator.producteur.nom)
      producteur = myExtObject.vectorLayerList[0].indecator.producteur.nom;
    }
    if (myExtObject.vectorLayerList && myExtObject.vectorLayerList[0].composentIdentiteLayerList[0] && myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].producteur) {
      // console.log("value indicateur histograme" , myExtObject.vectorLayerListcomposentIdentiteLayerList);
      producteur = myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].producteur.nom;
    }
    return producteur;
  }

  returnSource() {
    var source = '';
    // console.log("Value of the indicateur ")
    if (myExtObject.vectorLayerList && myExtObject.vectorLayerList[0].indecator && myExtObject.vectorLayerList[0].indecator.source) {
      // console.log("Nom De Source ",myExtObject.vectorLayerList[0].indecator.source)
      source = myExtObject.vectorLayerList[0].indecator.source;
    }
    if (myExtObject.vectorLayerList && myExtObject.vectorLayerList[0].composentIdentiteLayerList[0] && myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].source) {
      // console.log("Nom De Source Histograme",myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].source)
      source = myExtObject.vectorLayerList[0].composentIdentiteLayerList[0].source;
    }
    return source;
  }

  /***
   * End Functions
   */

}




var PrintCartSingleton = (function () {
  var instance;

  function createInstance() {
    var object = new PrintCart();
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
