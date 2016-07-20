import {
    Page, Modal, NavController, ViewController
}
from 'ionic-angular';
import { Component } from '@angular/core';
@
Component({
    templateUrl: 'build/pages/itinerary/itinerary.html'
})
export class ItineraryModal {
    static get parameters() {
        return [[ViewController]];
    }
    constructor(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    close() {
        this.viewCtrl.dismiss();
    }
    select(id) {
        this.viewCtrl.dismiss(id);
    }
}