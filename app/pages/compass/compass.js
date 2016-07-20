import {
    Page, Modal, NavController, ViewController, NavParams
}
from 'ionic-angular';
import { Component } from '@angular/core';
@
Component({
    templateUrl: 'build/pages/compass/compass.html'
})
export class CompassModal {
    static get parameters() {
        return [[ViewController], [NavParams]];
    }
    constructor(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
