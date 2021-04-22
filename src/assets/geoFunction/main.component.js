'use strict';
var myExtObject = {
    connectedUser: null,
    ref_Component: null,
    map: null,
    overlay: null,
    initLayer: null,
    async init(arg, noPrint, wmcEnable) {
        //component interaction in angular
        this.ref_Component = arg;
    },
	initMap() {

	},

    calculZoomInitial() {
        var initialZoom;
        var windowWidth = $(window).width();
        if (windowWidth < 601) {
            initialZoom = 4.5;
        } else if (windowWidth < 993) {
            initialZoom = 5;
        } else if (windowWidth < 1537) {
            initialZoom = 5.4
        } else if (windowWidth < 2700) {
            initialZoom = 6
        } else {
            initialZoom = this.zoomValeur;
        }
        return initialZoom;
    },



} /*  */
