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
        this.rotation = 0;
        this.noCompass = true;
        this.options = {
            frequency: 1000
        };
        this.watch = null;
        this.destination = null;
        this.value = 0;
        this.distance = 0;
        this.valueWatch = new Subject();
        this.rotationWatch = new Subject();
        this.distanceWatch = new Subject();
    }

    setWatch(map, user) {
        this.map = map;
        this.user = user;
        var bearing = this;

        if (window.cordova) {
            this.watch = DeviceOrientation.watchHeading(this.options).subscribe((heading) => {
                this.cssRotation(heading.magneticHeading);
                this.rotation = heading.magneticHeading;
                this.noCompass = false;
                this.rotationWatch.next(this.rotation);
                if (this.destination != null)
                    this.getBearing();
            });
        }
    }

    correctRotation(heading) {
        if (heading !== 0) {
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
    }

    toDegrees(angle) {
        return angle * (180 / Math.PI);
    }
    toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    getBearing(pos1, pos2) {
        if (typeof pos1 == "undefined" && typeof pos2 == "undefined") {
            var pos1 = this.user.getLatLng();
            var pos2 = this.destination;
            this.value = this.getBearing(pos1, pos2);
            this.valueWatch.next(this.value);
        } else {
            var dLong = pos2.lng - pos1.lng;
            var dPhi = Math.log(Math.tan(pos2.lat / 2 + Math.PI / 4) / Math.tan(pos1.lat / 2 + Math.PI / 4));
            if (Math.abs(dLong) > Math.PI) dLong = dLong > 0 ? -(2 * Math.PI - dLong) : (2 * Math.PI + dLong);
            return (this.toDegrees(Math.atan2(dLong, dPhi)) + 360) % 360;
        }
    }

    setDestination(destination) {
        this.destination = destination;
    }

    computeRotation(oldPos, newPos) {
        if (this.rotation === 0 || this.rotation === null) {
            this.noCompass = true;
        }
        if (this.noCompass) {
            this.rotation = this.getBearing(oldPos, newPos);
            this.rotationWatch.next(this.rotation);
            if (this.destination) {
                this.getBearing();
            }
            this.cssRotation(this.rotation);
        }
    }

    cssRotation(heading) {
        var pattern = /rotate\(\d+deg\)/g;
        this.correctRotation(heading);
        if (this.rotation != null) {
            if (this.user._icon.style.transform.indexOf("rotate") == -1) {
                this.user._icon.style.transform += " rotate(" + Math.round(this.rotation) + "deg)";
            } else {
                this.user._icon.style.transform = this.user._icon.style.transform.replace(pattern, "rotate(" + Math.round(this.rotation) + "deg)");
            }
        }
    }

    computeDistance(pos1, pos2) {
        const RADIUS = 6371000;

        var phi1 = this.toRadians(pos1.lat);
        var phi2 = this.toRadians(pos2.lat);
        var dphi = this.toRadians((pos2.lat - pos1.lat));
        var dlon = this.toRadians((pos2.lng - pos1.lng));

        var a = Math.sin(dphi / 2) * Math.sin(dphi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

        var b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        this.distance = RADIUS * b;
        this.distanceWatch.next(this.distance);
    }
}
