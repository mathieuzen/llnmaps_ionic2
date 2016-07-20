import {
    Injectable
}
from '@angular/core';
import {
    Http
}
from '@angular/http';
import 'rxjs/add/operator/map';


@
Injectable()
export class Routing {
    static get parameters() {
        return [[Http]]
    }

    constructor(http) {
        this.server = "router.project-osrm.org";
        this.http = http;
        this.router = L.Routing.osrm();
        this.control = null;
        this.itinerary = null;
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
      console.log(navigation);
        if(this.control !== null  && navigation){
            map.removeControl(this.control);
        }
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
            fitSelectedRoutes: true,
            formatter: new L.Routing.Formatter({language: 'fr'})
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
}
