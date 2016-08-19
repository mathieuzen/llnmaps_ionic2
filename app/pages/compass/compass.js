import {
    Page, Modal, NavController, ViewController, NavParams
}
from 'ionic-angular';
import {
    Component
}
from '@angular/core';
import {
    Bearing
}
from '../../providers/bearing/bearing.service';
import {
    DistancePipe
}
from '../../pipes/distance';

@
Component({
    templateUrl: 'build/pages/compass/compass.html',
    pipes: [DistancePipe]
})
export class CompassModal {
    static get parameters() {
        return [[ViewController], [NavParams], [Bearing]];
    }
    constructor(viewCtrl, params, bearing) {
        this.viewCtrl = viewCtrl;
        this.bearing = bearing;
        this.destination = params.data.destination;
        this.building = {};
        if (params.data.building.id != undefined) {
            this.building.id = params.data.building.id;
            this.building.name = params.data.building.name;
            this.building.address = params.data.building.address;
            this.building.type = params.data.building.type;
            if (this.building.name.length > 30) {
                this.building.name = this.building.id;
            }
        } else {
            this.building.name = params.data.building.options.building.name;
            this.building.type = "street";

        }
        this.bearing.setDestination(this.destination);
        this.bearing.valueWatch.subscribe(value => {
                this.compassRotation = value - this.bearing.rotation;
        });
        this.bearing.getBearing();
        this.bearing.computeDistance(this.bearing.user.getLatLng(), this.destination);
        this.distance = this.bearing.distance;

    }
    close() {
        this.viewCtrl.dismiss();
    }


    ngAfterViewInit() {
        if (this.rotation === null)
            this.setLineCompassOrientation(0);
        this.bearing.rotationWatch.subscribe(rotation => {
            this.setLineCompassOrientation(rotation);
        });
        this.bearing.distanceWatch.subscribe(distance => {
            this.distance = distance;
        });

        var compassCard = document.getElementById("compass-card");
        var circleCompass = document.getElementById("circleCompass");
        var arrowCompass = document.getElementById("arrowCompass");

        if (compassCard.offsetHeight < compassCard.offsetWidth) {
            circleCompass.style.maxWidth = 0.6 * compassCard.offsetHeight + "px";
            arrowCompass.style.maxWidth = 0.3 * compassCard.offsetHeight + "px";
        }
    }

    setLineCompassOrientation(heading) {
        var lineCompass = document.getElementById("north");
        if (lineCompass !== null) {
            lineCompass.style.backgroundPositionX = (-heading / 360 + 0.5) * lineCompass.offsetWidth + "px";
        }
    }



}