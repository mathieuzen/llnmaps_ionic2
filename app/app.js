import {
    App,
    ionicBootstrap,
    Platform,
    Nav,
    MenuController
}
from 'ionic-angular';
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
    Geolocation,
    Splashscreen,
    StatusBar
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
    TRANSLATE_PROVIDERS,
    TranslateService,
    TranslatePipe,
    TranslateLoader,
    TranslateStaticLoader
}
from 'ng2-translate/ng2-translate';
import {
    Component,
    OnInit,
    ViewChild,
    PLATFORM_PIPES,
    enableProdMode
}
from '@angular/core';
import {
    DiagnosticService
}
from './providers/diagnostic/diagnostic.service';

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
        return [
            [App],
            [Platform],
            [TranslateService],
            [DiagnosticService],
            [MenuController]
        ];
    }

    constructor(app, platform, translate, diagnostic, menu) {
        this.app = app;
        this.platform = platform;
        this.diagnostic = diagnostic;
        this.menu = menu;
        this.initializeApp();
        this.modes = [{
            title: 'maps',
            icon: 'map',
            component: MapsPage
        }, {
            title: 'settings',
            icon: 'settings',
            component: SettingsPage
        }, ];

        this.aboutPages = [{
                title: 'help',
                icon: 'help-circle',
                component: HelpPage
            }, {
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
        userLang = /(fr|en)/gi.test(userLang) ? userLang : 'en';
        translate.setDefaultLang('en');
        translate.use(userLang);
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleLightContent();
            setTimeout(() => {
                Splashscreen.hide();
            }, 2000);
            if (window.plugins !== undefined) {
                window.plugins.insomnia.keepAwake();
            }
        });
    }

    openPage(page) {

        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        // if (!(page.title === "maps" && this.nav.getActive().instance instanceof MapsPage)){
        //     this.nav.setRoot(page.component);
        // }
        if (page.title === "maps") {
            if (!(this.nav.getActive().instance instanceof MapsPage))
                this.nav.popToRoot({
                    "duration": 300
                });
        } else
            this.nav.push(page.component, {}, {
                "animate": false
            });
    }

    menuClosed() {
      this.menu.swipeEnable(false);
    }

    menuOpened() {
      this.menu.swipeEnable(true);
    }
}

ionicBootstrap(MyApp, [
    [Routing],
    [Geolocation],
    [Bearing],
    [Settings],
    [HTTP_PROVIDERS],
    [TRANSLATE_PROVIDERS],
    [{
        provide: PLATFORM_PIPES,
        useValue: TranslatePipe,
        multi: true
    }],
    [DiagnosticService]
], {});
