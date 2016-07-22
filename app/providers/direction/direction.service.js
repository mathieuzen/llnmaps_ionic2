import {
    Injectable
}
from '@angular/core';
import 'rxjs/add/operator/map';


@
Injectable()
export class Direction {

    constructor() {
        this.position = null;
        this.watchId = navigator.geolocation.watchPosition((position) => {
            this.position = position;
            console.log(position.coords);
        }, null, {enableHighAccuracy: true});
    }

    getUserLocation() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position.coords);
            }, null, {enableHighAccuracy: true});
        });
    }
}