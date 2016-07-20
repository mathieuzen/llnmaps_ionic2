import {App, ionicBootstrap, Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {MapsPage} from './pages/maps/maps';
import {HelpPage} from './pages/help/help';
import {InfoPage} from './pages/info/info';
import {SettingsPage} from './pages/settings/settings';
import {Routing} from './providers/routing/routing.service'
import {Geolocation} from './providers/geolocation/geolocation.service'



import {Component, OnInit, ViewChild} from '@angular/core';



@Component({
  templateUrl: 'build/app.html',
    queries: {
    nav: new ViewChild('content')
  }
})
class MyApp {
  static get parameters() {
    return [[App], [Platform]];
  }

  constructor(app, platform) {
    this.app = app;
    this.platform = platform;
    this.initializeApp();

    this.modes = [
      { title: 'Maps', icon:'map', component: MapsPage },
      { title: 'Settings', icon:'settings', component: SettingsPage },
    ];

    this.aboutPages = [
      { title: 'Help', icon:'help-circle', component: HelpPage },
      { title: 'Info', icon:'information-circle',component: InfoPage },
      { title: 'Rate', icon:'star'}
    ];

    this.rootPage = MapsPage;

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
    }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(!(page.title === "Maps" && this.nav.getActive().instance instanceof MapsPage))
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp, [[Routing], [Geolocation]], {});
