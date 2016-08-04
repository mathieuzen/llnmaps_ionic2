import {
    Pipe
}
from '@angular/core';

@
Pipe({
    name: 'DistancePipe'
})
export class DistancePipe {

    transform(value) {
        let distance = value;
        if (distance >= 1000) {
            return ( distance / 1000).toFixed(2) + ' km';
        } else {
            return distance.toFixed(0) + ' m';
        }
    }

}