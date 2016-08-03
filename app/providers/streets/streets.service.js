import {
    Injectable
}
from '@angular/core';

import {
    STREETS
}
from './streets';

@
Injectable()
export class StreetsService {
    getStreets() {
        return STREETS;
    }

    getIcon() {
        return "walk";
    }
    
    getColor() {
        return "black";
    }
}