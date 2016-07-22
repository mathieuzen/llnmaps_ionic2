import {
    Injectable
}
from '@angular/core';
import {
    TRANSLATE_PROVIDERS, TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader
}
from 'ng2-translate/ng2-translate';
import {
    Http
}
from '@angular/http';
import 'rxjs/add/operator/map';


@
Injectable()
export class Routing {
    static get parameters() {
        return [[Http],[TranslateService]]
    }

    constructor(http, translate) {
        this.server = "router.project-osrm.org";
        this.http = http;
        this.router = L.Routing.osrm();
        this.control = null;
        this.itinerary = null;
        this.translate = translate;
    }

    getTimeBetween(A, B) {
        return new Promise(resolve => {
            this.http.get('http://' + this.server + '/viaroute?loc=' + A.lat + ',' + A.lng + '&loc=' + B.lat + ',' + B.lng)
                .map(res => res.json())
                .subscribe(data => {
                    this.data = data;
                    resolve(this.data.route_summary.total_time);
                });
        });
    }

    getRouteBetween(A, B, map, navigation) {
        if (this.control !== null && navigation)
            map.removeControl(this.control);
        let waypoints = [L.latLng(A.lat, A.lng), L.latLng(B.lat, B.lng)];
        this.control = L.Routing.control({
            waypoints: waypoints,
            router: this.router,
            createMarker: function () {
                return null;
            },
            lineOptions: {
                addWaypoints: false
            },
            fitSelectedRoutes: 'true',
            formatter: new L.Routing.Formatter({
                language: this.translate.currentLang
            })
        });
        this.control.addTo(map);
        this.control.hide();
    }

    getItinerary() {
        return this.control._container.outerHTML;
    }
    getControl() {
        return this.control;
    }

    getPlan() {
        return this.control.getPlan();
    }

    disableFitSelectedRoutes() {
        this.control.options.fitSelectedRoutes = false;
    }

}