import {
    Page, NavController, NavParams
}
from 'ionic-angular';
import {
    DetailPage
}
from './detail/detail';



@
Page({
    templateUrl: 'build/pages/info/info.html'
})
export class InfoPage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav) {
        this.nav = nav;
    }

    launch(name, url) {
        this.nav.push(DetailPage, {
            name: name,
            url: url
        });
    }

}