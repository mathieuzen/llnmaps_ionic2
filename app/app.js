import {
    App, ionicBootstrap, Platform, Nav
}
from 'ionic-angular';
import {
    StatusBar
}
from 'ionic-native';
import {
    MapsPage
}
from './pages/maps/maps';
import {
    HelpPage
}
from './pages/help/help';
import {
    InfoPage
}
from './pages/info/info';
import {
    SettingsPage
}
from './pages/settings/settings';
import {
    Routing
}
from './providers/routing/routing.service'
import {
    Bearing
}
from './providers/bearing/bearing.service';
import {
    Geolocation, Splashscreen
}
from 'ionic-native';
import {
    Settings
}
from './providers/settings/settings.service'

import {
    HTTP_PROVIDERS
}
from '@angular/http';
import {
    TRANSLATE_PROVIDERS, TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader
}
from 'ng2-translate/ng2-translate';
import {
    Component, OnInit, ViewChild, PLATFORM_PIPES, enableProdMode
}
from '@angular/core';


enableProdMode();

@
Component({
    templateUrl: 'build/app.html',
    queries: {
        nav: new ViewChild('content')
    },
    pipes: [TranslatePipe]
})
class MyApp {
    static get parameters() {
        return [[App], [Platform], [TranslateService]];
    }

    constructor(app, platform, translate) {        this.app = app;
        this.platform = platform;
        this.initializeApp();

        this.modes = [
            {
                title: 'maps',
                icon: 'map',
                component: MapsPage
            },
            {
                title: 'settings',
                icon: 'settings',
                component: SettingsPage
            },
    ];

        this.aboutPages = [
            {
                title: 'help',
                icon: 'help-circle',
                component: HelpPage
            },
            {
                title: 'info',
                icon: 'information-circle',
                component: InfoPage
            },
//            {
//                title: 'rate',
//                icon: 'star'
//            }
    ];

        this.rootPage = MapsPage;

        var userLang = navigator.language.split('-')[0];
        translate.setDefaultLang('en');
        translate.use(userLang);

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            setTimeout(() => {
                Splashscreen.hide();
            }, 2000);
            if(window.plugins !== undefined){
            window.plugins.insomnia.keepAwake();
            }
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (!(page.title === "maps" && this.nav.getActive().instance instanceof MapsPage))
            this.nav.setRoot(page.component);
    }
}

ionicBootstrap(MyApp, [[Routing], [Geolocation], [Bearing], [Settings], [HTTP_PROVIDERS], [TRANSLATE_PROVIDERS], [{
    provide: PLATFORM_PIPES,
    useValue: TranslatePipe,
    multi: true
}]], {});