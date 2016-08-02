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

@
Component({
    templateUrl: 'build/pages/compass/compass.html',
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
        this.building.id = params.data.building.id;
        this.building.name = params.data.building.name;
        this.building.address = params.data.building.address;
        this.building.type = params.data.building.type;
        if (this.building.name.length > 30) {
            this.building.name = this.building.id;
        }
        this.bearing.setDestination(this.destination);
        this.bearing.valueWatch.subscribe(value => {
            if (this.bearing.rotation < value) {
                this.compassRotation = value - this.bearing.rotation;
            } else {
                this.compassRotation = this.bearing.rotation - value;
            };
        });
        this.bearing.getBearing();
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
        lineCompass.style.backgroundPositionX = (heading / 360 + 0.5) * lineCompass.offsetWidth + "px";
    }


}