import {
    Page, Modal, NavController, ViewController
}
from 'ionic-angular';
import {
    BuildingsService
}
from '../../providers/buildings/buildings.service';
import {
    StreetsService
}
from '../../providers/streets/streets.service';
import {
    Component
}
from '@angular/core';@
Component({
    templateUrl: 'build/pages/search/search.html',
    providers: [[BuildingsService], [StreetsService]]
})
export class SearchModal {
    static get parameters() {
        return [[ViewController], [BuildingsService], [StreetsService]];
    }
    constructor(viewCtrl, buildings, streets) {
        this.viewCtrl = viewCtrl;
        this.buildings = buildings;
        this.streets = streets;
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

    getItems(ev) {
        // Reset items back to all of the items
        this.segment = "";
        this.itemsBuildings = this.buildings.getAll();
        this.itemsStreets = this.streets.getStreets();
        // set q to the value of the searchbar
        var q = ev.target.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.itemsBuildings = this.itemsBuildings.filter((v) => {
            if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.id.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.address.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        });

        this.itemsStreets = this.itemsStreets.filter((v) => {
            return (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1);
        });

        this.items = this.itemsBuildings.concat(this.itemsStreets).slice(0, 40);
    }

    select(item) {
            this.viewCtrl.dismiss(item);
    }

}