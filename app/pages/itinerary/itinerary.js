import {
    Page, Modal, NavController, ViewController, NavParams
}
from 'ionic-angular';
import { Component } from '@angular/core';
@
Component({
    templateUrl: 'build/pages/itinerary/itinerary.html'
})
export class ItineraryModal {
    static get parameters() {
        return [[ViewController], [NavParams]];
    }
    constructor(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.instructions = params.get('instructions');
        this.itineraryContainer = this.instructions;
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
