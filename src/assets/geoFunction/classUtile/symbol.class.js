class SQUARE {
    constructor(item) {
        this.from = new ol.style.RegularShape({
            fill: (item.bgColor != "" && item.bgColor != null) ? new ol.style.Fill({ color: item.bgColor }) : null,
            points: 4,
            angle: Math.PI / 4,
            stroke: (item.contorColor != "" && item.contorColor != null) ? new ol.style.Stroke({
                color: item.contorColor,
                width: (item.width) ? item.width : 2
            }) : null,
            rotation: item.rotation,
            radius: item.raduis
        });
    }
    getForm() {
        return this.from;
    }
}

class TRIANGLE {
    constructor(item) {
        this.from = new ol.style.RegularShape({
            fill: (item.bgColor != "" && item.bgColor != null) ? new ol.style.Fill({ color: item.bgColor }) : null,
            points: 3,
            angle: 0,
            stroke: (item.contorColor != "" && item.contorColor != null) ? new ol.style.Stroke({
                color: item.contorColor,
                width: (item.width) ? item.width : 2
            }) : null,
            rotation: item.rotation,
            radius: item.raduis
        });
    }
    getForm() {
        return this.from;
    }

}
class STAR {
    constructor(item) {
        this.from = new ol.style.RegularShape({
            fill: (item.bgColor != "" && item.bgColor != null) ? new ol.style.Fill({ color: item.bgColor }) : null,
            points: 5,
            angle: 0,
            stroke: (item.contorColor != "" && item.contorColor != null) ? new ol.style.Stroke({
                color: item.contorColor,
                width: (item.width) ? item.width : 2
            }) : null,
            rotation: item.rotation,
            radius: item.raduis,
            radius2: item.raduis / 2
        });
    }
    getForm() {
        return this.from;
    }

}
class CROSS {
    constructor(item) {
        this.from = new ol.style.RegularShape({
            fill: (item.bgColor != "" && item.bgColor != null) ? new ol.style.Fill({ color: item.bgColor }) : null,
            points: 4,
            angle: 0,
            stroke: (item.contorColor != "" && item.contorColor != null) ? new ol.style.Stroke({
                color: item.contorColor,
                width: (item.width) ? item.width : 2
            }) : null,
            rotation: item.rotation,
            radius: item.raduis,
            radius2: 0
        });
    }
    getForm() {
        return this.from;
    }
}
class X {
    constructor(item) {
        this.from = new ol.style.RegularShape({
            fill: (item.bgColor != "" && item.bgColor != null) ? new ol.style.Fill({ color: item.bgColor }) : null,
            points: 4,
            angle: Math.PI / 4,
            stroke: (item.contorColor != "" && item.contorColor != null) ? new ol.style.Stroke({
                color: item.contorColor,
                width: (item.width) ? item.width : 2
            }) : null,
            rotation: item.rotation,
            radius: item.raduis,
            radius2: 0
        });
    }
    getForm() {
        return this.from;
    }
}
class CERCLE {
    constructor(item) {

        this.from = new ol.style.Circle({
            fill: (item.bgColor != "" && item.bgColor != null) ? new ol.style.Fill({ color: item.bgColor }) : null,
            stroke: (item.contorColor != "" && item.contorColor != null) ? new ol.style.Stroke({
                color: item.contorColor,
                width: (item.width) ? item.width : 2
            }) : null,
            radius: item.raduis,
        });
    }
    getForm() {
        return this.from;
    }
}


class SymbolFactory {

    constructor() {
        this.symbol = null;
    }

    createSymbol(SymbolForma) {
        // // console.log(SymbolForma)
        if (SymbolForma.type === "SQUARE") {
            this.symbol = new SQUARE(SymbolForma);
        } else if (SymbolForma.type === "TRIANGLE") {
            this.symbol = new TRIANGLE(SymbolForma);
        } else if (SymbolForma.type === "STAR") {
            this.symbol = new STAR(SymbolForma);
        } else if (SymbolForma.type === "CROSS") {
            this.symbol = new CROSS(SymbolForma);
        } else if (SymbolForma.type === "X") {
            this.symbol = new X(SymbolForma);
        } else {
            this.symbol = new CERCLE(SymbolForma);
        }
        return this.symbol;
    }
}

var SymbolFactorySingleton = (function() {
    var instance;

    function createInstance() {
        var object = new SymbolFactory();
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