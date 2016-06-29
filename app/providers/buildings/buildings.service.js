import {
    Injectable
}
from '@angular/core';

import {
    HALLS
}
from './halls';
import {
    SHOPS
}
from './shops';
import {
    ENTERTAINMENT
}
from './entertainment';
import {
    TRANSPORT
}
from './transport';

@
Injectable()
export class BuildingsService {
    getHalls() {
        return HALLS;
    }
    getShops() {
        return SHOPS;
    }
    getEntertainment() {
        return ENTERTAINMENT;
    }
    getTransport() {
        return TRANSPORT;
    }
    getAll() {
        return [].concat(HALLS, SHOPS, ENTERTAINMENT, TRANSPORT);
    }
    getIcon(building) {
        switch (building.type) {
        case "hall":
            return "university";
            break;
        case "shop":
            return "shopping-bag";
            break;
        case "entertainment":
            return "gamepad";
            break;
        case "transport":
            return "train";
            break;
        }
    }
    getColor(building) {
        switch (building.type) {
        case "hall":
            return "blue";
            break;
        case "shop":
            return "pink";
            break;
        case "entertainment":
            return "red";
            break;
        case "transport":
            return "orange";
            break;
        }
    }
}