import {
    Injectable
}
from '@angular/core';
import {
    DeviceOrientation
}
from 'ionic-native';
import 'rxjs/add/operator/map';
import {
    Subject
}
from 'rxjs/Subject';


@
Injectable()
export class Bearing {

    constructor() {
        this.position = null;
        this.map = null;
        this.user = null;
        this.rotation = null;
        this.noCompass = true;
        this.options = {
            frequency: 1000
        };
        this.watch = null;
        this.destination = null;
        this.value = 0;
        this.valueWatch = new Subject();
    }

    setWatch(map, user) {
        this.map = map;
        this.user = user;
        if (window.cordova) {
            this.watch = DeviceOrientation.watchHeading(this.options).subscribe((heading) => {
                this.cssRotation(heading);
                if (this.destination != null)
                    this.getBearing();
            });
        }
    }

    correctRotation(heading) {
        var aR;
        this.rotation = this.rotation || 0;
        aR = this.rotation % 360;
        if (aR < 0) {
            aR += 360;
        }
        if (aR < 180 && (heading > (aR + 180))) {
            this.rotation -= 360;
        }
        if (aR >= 180 && (heading <= (aR - 180))) {
            this.rotation += 360;
        }
        this.rotation += (heading - aR);
    }

    toDegrees(angle) {
        return angle * (180 / Math.PI);
    }

    getBearing() {
        var pos1 = this.user.getLatLng();
        var pos2 = this.destination;
        this.value = this.getBearing(pos1, pos2);
        this.valueWatch.next(this.value);
    }

    getBearing(pos1, pos2) {
        var dLong = pos2.lng - pos1.lng;
        var dPhi = Math.log(Math.tan(pos2.lat / 2 + Math.PI / 4) / Math.tan(pos1.lat / 2 + Math.PI / 4));
        if (Math.abs(dLong) > Math.PI) dLong = dLong > 0 ? -(2 * Math.PI - dLong) : (2 * Math.PI + dLong);
        return (this.toDegrees(Math.atan2(dLong, dPhi)) + 360) % 360;
    }

    setDestination(destination) {
        this.destination = destination;
    }

    computeRotation(oldPos, newPos) {
        if (this.rotation === 0 || this.rotation === null && this.noCompass) {
            this.noCompass = true;
            this.rotation = this.getBearing(oldPos, newPos);
            console.log(oldPos + " - " + newPos);
            this.cssRotation(this.rotation);
        }
    }

    cssRotation(heading) {
        var pattern = /rotate\(\d+deg\)/g;
        this.correctRotation(heading.magneticHeading);
        if (this.user._icon.style.transform.indexOf("rotate") == -1) {
            this.user._icon.style.transform += " rotate(" + Math.round(this.rotation) + "deg)";
        } else {
            this.user._icon.style.transform = this.user._icon.style.transform.replace(pattern, "rotate(" + Math.round(this.rotation) + "deg)");
        }
    }
}