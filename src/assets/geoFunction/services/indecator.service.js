class IndecatorSevice {

    constructor() {
        this.colorClass = ColorClassSingleton.getInstance();
        this.legend = LegendSingleton.getInstance();
        this.symbolModePresentation = SymbolModeSingleton.getInstance();
        this.colorDegrade = ColorDegradeModeSingleton.getInstance();
        this.uniqueIndecatorDegradeSevice = UniqueIndecatorDegradeSeviceSingloton.getInstance();
        this.exploreCartSevice = ExploreCartSeviceSingloton.getInstance();
    }
    getClassificationByNb(nbre_class, listValue, type) {
        return this.legend.getInterval(nbre_class, listValue, type);
    }
    levelOfLayer(id) {
            if (myExtObject.vectorLayerList.length > 0) {
                var index = myExtObject.vectorLayerList.findIndex(element => element.id === id);
                if (index > -1) {
                    return myExtObject.vectorLayerList[index].level;
                }
            } else {
                return 3;
            }
        }
        //suprimer une indecator
    removeIndectorFromMap(id) {
            var index = myExtObject.vectorLayerList.findIndex(element => {
                if (element.id === id) return element.id === id;
                else if (element.composentIdentiteLayerList && element.composentIdentiteLayerList.findIndex(item => item.id == id) > -1) {
                    return true;
                }
            });
            console.log("id :", id, " index :", index, "list ", myExtObject.vectorLayerList)
            if (index >= 0) {
                // console.log("find", myExtObject.vectorLayerList[index])
                myExtObject.map.removeLayer(myExtObject.vectorLayerList[index].vectorLayer);
                if (myExtObject.vectorLayerList[index] && myExtObject.vectorLayerList[index].composentIdentiteLayerList) {
                    for (let item of myExtObject.vectorLayerList[index].composentIdentiteLayerList) {
                        this.legend.removeLegend(item)
                    }
                }
                //cas symbol
                if (myExtObject.vectorLayerList[index].vectorLayer && myExtObject.vectorLayerList[index].vectorLayer.get("layerPrent")) {
                    myExtObject.map.removeLayer(myExtObject.vectorLayerList[index].vectorLayer.get("layerPrent"));
                }
                this.legend.removeLegend(myExtObject.vectorLayerList[index]);
                myExtObject.vectorLayerList.splice(index, 1);
            }
        }
        // show and hide chaque indector
    visibleSurCartIndector(id, visible) {
            var index = myExtObject.vectorLayerList.findIndex(element => element.id === id);
            if (index >= 0) {
                myExtObject.vectorLayerList[index].vectorLayer.setVisible(visible);
                if (visible) {
                    this.legend.addLegend(myExtObject.vectorLayerList[index]);
                } else {
                    this.legend.removeLegend(myExtObject.vectorLayerList[index]);
                }
                if (this.currentIndecator && this.currentIndecator.id) {
                    if (this.currentIndecator.id == id) {
                        this.removeAllInteration();
                        if (myExtObject.vectorLayerList[index].level == 1) {
                            if (myExtObject.vectorLayerList[index].selectPointerMove2) myExtObject.map.addInteraction(myExtObject.vectorLayerList[index].selectPointerMove2);
                            if (myExtObject.vectorLayerList[index].selectFeature2) myExtObject.map.addInteraction(myExtObject.vectorLayerList[index].selectFeature2);
                        } else {
                            if (myExtObject.vectorLayerList[index].selectPointerMove1) myExtObject.map.addInteraction(myExtObject.vectorLayerList[index].selectPointerMove1);
                            if (myExtObject.vectorLayerList[index].selectFeature) myExtObject.map.addInteraction(myExtObject.vectorLayerList[index].selectFeature);
                        }
                    }
                }


            }
        }
        // show and hide all indector
    visibleSurCartIndectorALL(visible, excludeId) {
        for (var i = 0; i < myExtObject.vectorLayerList.length; i++) {
            if (excludeId && excludeId == myExtObject.vectorLayerList[i].id) { continue; }
            if ($("#visible-indecator-" + myExtObject.vectorLayerList[i].id).hasClass('fa fa-eye bg-green-light') && !visible) {
                this.visibleSurCartIndector(myExtObject.vectorLayerList[i].id, false);
                $("#visible-indecator-" + myExtObject.vectorLayerList[i].id).removeClass("fa fa-eye bg-green-light").addClass("fa fa-eye-slash bg-green-dark ");
            } else if ($("#visible-indecator-" + myExtObject.vectorLayerList[i].id).hasClass('fa fa-eye-slash bg-green-dark') && visible) {
                this.visibleSurCartIndector(myExtObject.vectorLayerList[i].id, true);
                $("#visible-indecator-" + myExtObject.vectorLayerList[i].id).removeClass("fa fa-eye-slash bg-green-dark").addClass("fa fa-eye bg-green-light");
            }
        }
    }
    changeCurrentIndecator(item) {
        myExtObject.currentIndecator = item;
        var identiteVectorLayer = myExtObject.findIdentiteVectorLayer(item.id);
        if (identiteVectorLayer.vectorLayer) {
            myExtObject.map.removeLayer(identiteVectorLayer.vectorLayer);
            myExtObject.map.addLayer(identiteVectorLayer.vectorLayer);
            myExtObject.exploreCartSevice.pointerMoveInMap(identiteVectorLayer);
            var visible = identiteVectorLayer.vectorLayer.getVisible();
            var serie = ( myExtObject.currentIndecator.echelle.indexOf('Provinciale') !=-1) ? 'serie2' :( myExtObject.currentIndecator.echelle.indexOf('Communale')!=-1 )? "serie4": ""

            if (visible) {

                this.legend.addLegend(identiteVectorLayer,serie);
            } else {
                this.legend.removeLegend(identiteVectorLayer,serie);
            }
            this.exploreCartSevice.removeAllInteration();
            if (identiteVectorLayer.level == 2 && visible && serie== 'serie2') {
              if (identiteVectorLayer.selectPointerMove2) myExtObject.map.addInteraction(identiteVectorLayer.selectPointerMove2);
              if (identiteVectorLayer.selectFeature2) myExtObject.map.addInteraction(identiteVectorLayer.selectFeature2);
          } else if (identiteVectorLayer.level == 1 && visible) {
                if (identiteVectorLayer.selectPointerMove2) myExtObject.map.addInteraction(identiteVectorLayer.selectPointerMove2);
                if (identiteVectorLayer.selectFeature2) myExtObject.map.addInteraction(identiteVectorLayer.selectFeature2);
            } else if (visible) {
                if (identiteVectorLayer.selectPointerMove1) myExtObject.map.addInteraction(identiteVectorLayer.selectPointerMove1);
                if (identiteVectorLayer.selectFeature) myExtObject.map.addInteraction(identiteVectorLayer.selectFeature);
            }
        }
    }

    levelOfIndecatorInMap(id) {
        if (myExtObject.vectorLayerList.length > 0) {
            var index = myExtObject.vectorLayerList.findIndex(element => element.id === id);
            if (index > -1) {
                return myExtObject.vectorLayerList[index].level;
            }
        } else {
            return 3;
        }
    }

    findIdentiteVectorLayer(id) {
        if (myExtObject.vectorLayerList && myExtObject.vectorLayerList.length > 0) {
            return myExtObject.vectorLayerList.find(item => { return item.id == id });
        } else {
            return null;
        }
    }
}

var IndecatorSeviceSingloton = (function() {

    var instance;

    function createInstance() {
        var object = new IndecatorSevice();
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
