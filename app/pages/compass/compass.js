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
    templateUrl: 'build/pages/compass/compass.html'
})
export class CompassModal {
    static get parameters() {
        return [[ViewController], [NavParams], [Bearing]];
    }
    constructor(viewCtrl, params, bearing) {
        this.viewCtrl = viewCtrl;
        this.bearing = bearing;
        this.destination = params.data.destination;
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
}