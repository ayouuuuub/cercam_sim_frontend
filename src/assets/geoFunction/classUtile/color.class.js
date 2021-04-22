class ColorClass {

    constructor() {

    }


    getColorByChroma(couleur) {
        var clr;
        if (couleur === "BLEU") {
            clr = chroma.brewer.Blues;
        } else if (couleur === "ROUGE") {
            clr = chroma.brewer.Reds;
        } else if (couleur === "ORANGE") {
            clr = chroma.brewer.Oranges;
        } else if (couleur === "JAUNE") {
            clr = chroma.brewer.YlOrBr;
        } else if (couleur === "VERT") {
            clr = chroma.brewer.Greens;
        } else if (couleur === "VIOLET") {
            clr = chroma.brewer.Purples;
        } else {
            clr = chroma.brewer.Greys;

        }
        return clr
    }
    getColorByHexa(strColor) {
        var clr = "#000";
        if (strColor === "BLEU") {
            clr = "#4286f4";
        } else if (strColor === "ROUGE") {
            clr = "#f45241";
        } else if (strColor === "ORANGE") {
            clr = "#f4b241";
        } else if (strColor === "JAUNE") {
            clr = "#f4e541";
        } else if (strColor === "VERT") {
            clr = "#46f441";
        } else if (strColor === "VIOLET") {
            clr = "#9a41f4";
        } else {
            clr = "#6d6d6d";
        }
        return clr;
    }
}

var ColorClassSingleton = (function() {
    var instance;

    function createInstance() {
        var object = new ColorClass();
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