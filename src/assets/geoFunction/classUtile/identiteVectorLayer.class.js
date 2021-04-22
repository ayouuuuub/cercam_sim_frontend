var IdentiteLayer = (function() {

    function objectIdentite() {
        return {
            id: null,
            symbolMode: null,
            vectorLayer: null,
            indecator: null,
            //attrib de la region selectione
            val_tab: [],
            //table global of value of indector in reg used for cercl
            val_tab_global: [],
            nom: [],
            ids: [],
            interval: [],
            serie: null,
            vectorLayerRegion: null,
            //explore cart
            selectPointerMove1: null,
            selectPointerSelectFeature: null,
            selectFeature: null,
            //attrib de la prov selectione
            val_tab2: [],
            nom2: [],
            ids2: [],
            interval2: null,
            serie2: null,
            vectorLayerProvence: null,
            //explore cart
            selectPointerMove2: null,
            selectFeature2: null,
            //attrib de la prefecture d'arrondissement
            val_tab3: [],
            nom3: [],
            ids3: [],
            interval3: null,
            serie3: null,
            vectorLayerCerPrefArr: null,
            //attrib de la commune
            val_tab4: [],
            nom4: [],
            ids4: [],
            interval4: null,
            serie4: null,
            vectorLayerCmn: null,
            //attrib du douar/centre urbain
            val_tab5: [],
            nom5: [],
            ids5: [],
            interval5: null,
            serie5: null,
            vectorLayerDcu: null,
            //attrib de l'unite
            val_tab10: [],
            nom10: [],
            ids10: [],
            interval10: null,
            serie10: null,
            vectorLayerUnt: null,
            level: null,
            //color de la cart
            couleurs: null,
            ranges: [],
            //color for symbol
            colorBase: null,
            colorGraphList: [],
            composentIdentiteLayerList: []
        }
    }
    return {
        getInstance: function() {
            return Object.assign({}, objectIdentite());
        }
    };
})();
