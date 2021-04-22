import { Injectable } from "@angular/core";
declare let $: any

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

    private user: any;
    public app: any;
    public server: any;
    public oauth: any;
    public layout: any;
    public geo :any;
    public geocatalog :any;
    urlGeoserverIframe:any;

    constructor() {

        // User Settings
        // -----------------------------------
        this.user = {
            name: 'John',
            job: 'ng-developer',
            picture: 'assets/img/user/02.jpg'
        };


        // geo server
        // -----------------------------------
        this.geo = {
            dataBase: 'cercam',
            RegLayer: 'region',
            RegPrvLayer: 'province_region',
            PrvLayer: 'province',
            PrvCerLayer: 'cercle_province',
            CerLayer: 'cercle',
            CerCmnLayer: 'commune_cercle',
            CmnLayer: 'commune',
            url: 'http://localhost:8484/geoserver/cercam/ows',
            urlWms: 'http://localhost:8484/geoserver/cercam/wms'
        };

        // geo network
        // -----------------------------------
        this.geocatalog = {
           url:'http://localhost:8484/geonetwork',
        };
        this.urlGeoserverIframe = {
            url:'http://localhost:8484/geoserver/web/',
        };

        // Server Settings
        // -----------------------------------
        this.server = {
           url: 'http://localhost:3000',
           currentUserUrl: '/utilisateur/getCurrentUserByDomain/' + this.app.domain + '/',
        };

        this.oauth = {
             url: 'http://localhost:3000',
             loginUrl: '/auth/authenticate'
            };

        // Layout Settings
        // -----------------------------------
        this.layout = {
            isFixed: true,
            isCollapsed: false,
            isBoxed: false,
            isRTL: false,
            horizontal: false,
            isFloat: false,
            asideHover: false,
            theme: null,
            asideScrollbar: false,
            isCollapsedText: false,
            useFullLayout: false,
            hiddenFooter: false,
            offsidebarOpen: false,
            asideToggled: false,
            viewAnimation: 'ng-fadeInUp'
        };

    }

    getAppSetting(name) {
        return name ? this.app[name] : this.app;
    }

    getUserSetting(name) {
        return name ? this.user[name] : this.user;
    }

    getLayoutSetting(name) {
        return name ? this.layout[name] : this.layout;
    }

    setAppSetting(name, value) {
        if (typeof this.app[name] !== 'undefined') {
            this.app[name] = value;
        }
    }

    setUserSetting(name, value) {
        if (typeof this.user[name] !== 'undefined') {
            this.user[name] = value;
        }
    }

    setLayoutSetting(name, value) {
        if (typeof this.layout[name] !== 'undefined') {
            return this.layout[name] = value;
        }
    }

    toggleLayoutSetting(name) {
        return this.setLayoutSetting(name, !this.getLayoutSetting(name));
    }

}
