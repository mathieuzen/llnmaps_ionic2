import {
    Page, Modal, NavController, ViewController
}
from 'ionic-angular';

@
Page({
    templateUrl: 'build/pages/search/search.html'
})
export class SearchModal {
      static get parameters() {
    return [[ViewController]];
  }
    constructor(viewCtrl) {
        this.viewCtrl = viewCtrl;
        this.searchQuery = '';
        this.initializeItems();
    }

    initializeItems() {
        this.items = [
      'Amsterdam',
      'Bogota'
    ];
    }
    close() {
        this.viewCtrl.dismiss();
    }

    getItems(searchbar) {
        // Reset items back to all of the items
        this.initializeItems();

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.items = this.items.filter((v) => {
            if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }
}