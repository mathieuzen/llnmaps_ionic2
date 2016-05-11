import {
    Page, Modal, NavController, ViewController
}
from 'ionic-angular';
import {
    BuildingsService
}
from '../buildings/buildings.service';

@
Page({
    templateUrl: 'build/pages/search/search.html',
    providers: [BuildingsService]
})
export class SearchModal {
    static get parameters() {
        return [[ViewController], [BuildingsService]];
    }
    constructor(viewCtrl, buildings) {
        this.viewCtrl = viewCtrl;
        this.buildings = buildings;
        this.searchQuery = '';
        this.initializeItems();
        this.segment = "halls";
    }
    initializeItems() {
        this.items = this.buildings.getHalls();
    }
    changeItems(event) {
        switch (event.value) {
        case "halls":
            this.items = this.buildings.getHalls();
            break;
        case "shops":
            this.items = this.buildings.getShops();
            break;
        case "entertainment":
            this.items = this.buildings.getEntertainment();
            break;
        case "transport":
            this.items = this.buildings.getTransport();
            break;
        }
    }
    close() {
        this.viewCtrl.dismiss();
    }

    getItems(searchbar) {
        // Reset items back to all of the items
        this.segment = "";
        this.items = this.buildings.getAll();
        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.items = this.items.filter((v) => {
            if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.id.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.address.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }
}