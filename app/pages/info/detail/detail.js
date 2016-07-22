import {Page, NavController, NavParams} from 'ionic-angular';
import { Component } from '@angular/core';

import {SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';


@Component({
  templateUrl: 'build/pages/info/detail/detail.html',
  providers: [[DomSanitizationService]]
})
export class DetailPage {
  static get parameters() {
    return [[NavController], [NavParams], [DomSanitizationService]];
  }

  constructor(nav, params, sanitizer) {
      this.nav = nav;
      this.name = params.data.name;
      console.log(sanitizer);
      this.url = sanitizer.bypassSecurityTrustResourceUrl(params.data.url);
  }

}
