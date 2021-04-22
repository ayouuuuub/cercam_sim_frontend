class WMSSevice {

    constructor() {
        this.tree = null;
    }

    initWMS() {
        /* //déclaration de la layertree				
         */
        this.initLayerTree();
        document.addEventListener('DOMContentLoaded', this.initLayerTree);
    }
    initLayerTree() {
        document.removeEventListener('DOMContentLoaded', this.initLayerTree);

        this.tree = LayerTreeInstance.createInstance({
                map: myExtObject.map,
                target: 'layertree',
                messages: 'messageBar'
            })
            .createRegistry(myExtObject.map.getLayers().item(0), true, 'La carte de base')
            .createRegistry(myExtObject.map.getLayers().item(1), true, 'Cart maroc')
            .createRegistry(myExtObject.map.getLayers().item(2), true, 'Labe map');


        document.getElementById('addwms_form').addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.tree.addWmsLayer(this);
            // console.log("do it")
            this.parentNode.style.display = 'none';
        });
        document.getElementById('wmsurl').addEventListener('change', () => {
            this.tree.removeContent(this.form.layer)
                .removeContent(this.form.format);
        });

    }
    addChocheWms(event) {
        console.log(event.nodeSelected)
        let layerSeleced = event.nodeSelected;
        if (layerSeleced && layerSeleced.checked && !layerSeleced.children) {
            this.drowLayer(layerSeleced)
        } else if (layerSeleced && layerSeleced.checked && layerSeleced.children) {
            for (var item of layerSeleced.children) {
                let findLayer = this.findLayerWms(item);
                if (!findLayer) {
                    this.drowLayer(item)
                } else {
                    this.cleanLayerMap(item);
                    this.drowLayer(item);
                }
            }
        }

    }
    drowLayer(layerSeleced) {
        var params = {
            url: layerSeleced.objectType,
            params: {
                layers: layerSeleced.name,
                QUERY_LAYERS: layerSeleced.name,
                format: "image/png"
            },
            crossOrigin: 'anonymous'
        };
        var layer;
        /*  /*    if (form.tiled) { */
        /*    layer = new ol.layer.Tile({
               source: new ol.source.TileWMS(params),
               name: layerSeleced.name
           }); */
        /*  }  */
      console.log(layerSeleced.name);

        var layer = new ol.layer.Image({
            source: new ol.source.ImageWMS(params),
            // name: layerSeleced.title,
            name: layerSeleced.name,
            crossOrigin: 'anonymous'
        });
        /*  var urlvector = myExtObject.ref_Component.settings.geo.url +
             '?service=WFS&version=1.0.0' +
             '&request=GetFeature&typeName=' + layerSeleced.name + '&outputFormat=application/json';

         var vector = new ol.source.Vector({
             format: new ol.format.GeoJSON(),
             url: () => {
                 return urlvector;
             },
             strategy: ol.loadingstrategy.bbox,

         });
         layer = new ol.layer.Vector({
             source: vector,
             style: function(feature) {

                 var retStyle = new ol.style.Style({
                     fill: new ol.style.Fill({
                         color: '#e1cc05ba'
                     }),
                     stroke: new ol.style.Stroke({
                         color: '#000',
                         width: 1
                     })

                 });
                 return retStyle;
             }
         }); */
        myExtObject.map.addLayer(layer);

        myExtObject.map.on('singleclick', function(evt) {
          document.getElementById('nodelist').innerHTML = "Loading... please wait...";
          var view = myExtObject.map.getView();
          var viewResolution = view.getResolution();
          var source = layer.getSource();
          var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
          console.log("URL: " + url);
          if (url) {
            document.getElementById('nodelist').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
          }
        });
        myExtObject.vectorLayerWMSList.push({ node: layerSeleced, layer: layer })
    }
    cleanLayerMap(layerSeleced) {
        let findLayer = this.findLayerWms(layerSeleced);
        if (findLayer) {
            myExtObject.map.removeLayer(findLayer.layer);
            var index = myExtObject.vectorLayerWMSList.findIndex(subItem => subItem.node.name == layerSeleced.name);
            if (index > -1) {
                myExtObject.vectorLayerWMSList.splice(index, 1);
            }
        }
    }
    findLayerWms(node) {
        if (myExtObject.vectorLayerWMSList.length > 0) {
            let arrayLayer = myExtObject.vectorLayerWMSList.filter(item => {
                return item.node.name == node.name
            })
            return (arrayLayer.length > 0) ? arrayLayer[0] : null;
        }
        return null;
    }
    removeChocheWms(event) {
        let layerSeleced = event.nodeSelected;
        if (layerSeleced && !layerSeleced.checked && !layerSeleced.children) {
            this.cleanLayerMap(layerSeleced);
        } else if (layerSeleced && !layerSeleced.checked && layerSeleced.children) {
            for (var item of layerSeleced.children) {
                let findLayer = this.findLayerWms(item);
                if (findLayer) {
                    this.cleanLayerMap(item)
                }
            }
        }
    }
    sendChangeOpacityWMS(event) {
        let findLayer = this.findLayerWms(event.nodeSelected.data);
        // console.log(findLayer, event)
        if (findLayer) {
            findLayer.layer.setOpacity(event.value);
        }
    }
}

var WMSSeviceSingloton = (function() {

    var instance;

    function createInstance() {
        var object = new WMSSevice();
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
