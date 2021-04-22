class LabelViewMap {

    constructor() {

    }
    labelInMapMaroc(vectorLayer) {
        vectorLayer.setStyle((feature) => {
            var retStyle = new ol.style.Style({

                fill: new ol.style.Stroke({
                  color: 'transparent'
                }),
                stroke: new ol.style.Stroke({
                  color: 'transparent'
                }),
      /*           text: new ol.style.Text({
                    text: "Maroc",
                    font: "20px  sans-serif",
                    textAlign: "center",
                    rotateWithView: false,
                    //rotation: 100,
                    offsetY: -60,
                    offsetX: 60,
                    fill: new ol.style.Fill({
                        color: "#000"
                    })
                }) */
            });

            return retStyle;
        });
    }

    labelInMap(urlVector, isModeCircle) {
        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: () => {
                return urlVector;
            },
            strategy: ol.loadingstrategy.bbox
        });

        var vectorLayer = new ol.layer.Vector({ source: vectorSource, name: "Label map", class: "labelMap" });

        vectorLayer.setStyle((feature) => {
            var retStyle = new ol.style.Style({
                fill: new ol.style.Stroke({
                    color: 'transparent'
                }),
                text: new ol.style.Text({
                    text: (myExtObject.map.getView().getZoom()>4) ? feature.get("libelle") : "",
                    font: myExtObject.map.getView().getZoom()*1.6+"px  sans-serif",
                    textAlign: isModeCircle ? "end" : "center",
                    fill: new ol.style.Fill({
                        color: "#000"
                    })
                })
            });
            //feature.setStyle(e);
            return retStyle;

        });

        return vectorLayer;
    }

}

var LabelViewMapSingloton = (function() {
    var instance;

    function createInstance() {
        var object = new LabelViewMap();
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
