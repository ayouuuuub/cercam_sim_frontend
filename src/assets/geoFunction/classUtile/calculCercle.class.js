class CalculCercle {

    constructor() {}

    radiusCalculation(val, coeff) {
        return Math.pow((val / Math.PI), 0.5) * coeff;
    }

    radiusCalculation2(val, listValeurs) {
        var arraySurface = [];
        // // console.log(listValeurs)
        for (var item of listValeurs) {
            arraySurface.push(item.valeur);
        }

        var maxV = Math.max(...arraySurface);
        return (val * 25 / maxV);
    }

    radiusCalculationPerClass(val, interval) {
        if (interval) {
            var n = interval.length;
            //console.log("  myExtObject.zoomValeur in redius :",  myExtObject.zoomValeur);
            let x = 0;
            if (myExtObject.zoomValeur >= 5.9) {
                x = 30;
            } else if (myExtObject.zoomValeur >= 5.5) {
                x = 22;
            } else if (myExtObject.zoomValeur >= 5) {
                x = 16;
            } else if (myExtObject.zoomValeur >= 4) {
                x = 10;
            } else {
                x = 6;
            }
            var pos;
            var max = Math.max(...interval);

            for (i = 1; i < n; i++) {
              if(max  == interval[i]) pos =i;

              if (val <= interval[i]) return i / (n - 1) * x;
                //return (i + 1) / n * 30;
            }


             if( interval[pos] <= val)   return  pos / (n - 1) * x

        }

    }

    coeffCalculation(sumSurface, listValeur) {
        //// console.log("sumSurface : ", (sumSurface), " count :", listValeur.length)
        return (sumSurface / listValeur.length) / Math.sqrt(this.minSurface(listValeur));
    }

    minSurface(listValeur) {
        var arraySurface = [];
        for (var item of listValeur) {
            arraySurface.push(item.valeur);
        }

        return Math.min(...arraySurface);
    }

    sumSurface(valeurList) {
        var som = 0;
        for (var item of valeurList) {
            som += item.surface;
        }
        return som;
    }
}

var CalculCercleSingleton = (function() {
    var instance;

    function createInstance() {
        var object = new CalculCercle();
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
