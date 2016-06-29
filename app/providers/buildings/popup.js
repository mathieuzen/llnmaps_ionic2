import {
    Injectable
}
from 'angular2/core'

import { Routing } from '../routing/routing.service'

@Injectable()
export class Popup {
    static get parameters() {
        return [[Routing]]
    }
    constructor(routing){
        this.routing = routing;
    }
    getContent(id, name, address) {
        return '<div><p class="popup-title">' + id + '</p><img style="width:200px;     max-height: 150px;" src="img/buildings/' + id + '.jpg"><p style="max-width: 200px; word-wrap: break-word;">' + name + '</p><p>' + address + '</p><p>Time:<span id="time">Test</span></p><button id="btnGo" class="button button-block button-positive">Go</button></div>'
    }
}