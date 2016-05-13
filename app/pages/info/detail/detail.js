import {Page, NavController, NavParams} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/info/detail/detail.html'
})
export class DetailPage {
  static get parameters() {
    return [[NavController], [NavParams]];
  }

  constructor(nav, params) {
      this.nav = nav;
      this.name = params.data.name;
      this.url = params.data.url;
  }

}
