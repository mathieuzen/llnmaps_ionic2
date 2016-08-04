import {
    Page, NavController, NavParams
}
from 'ionic-angular';
import {
    Component
}
from '@angular/core';
import {
    Settings
}
from '../../providers/settings/settings.service';

import {
   TranslateService
}
from 'ng2-translate/ng2-translate';

@
Component({
    templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsPage {
    static get parameters() {
        return [[Settings], [TranslateService]];
    }

    constructor(settings, translate) {
        this.settingsService = settings;
        this.settings = this.settingsService.settings;
        this.settings.language = translate.currentLang;
        
        //observe changes in settings
        this.settingsService.settingsChange.subscribe((settings) => {
            this.settings = settings;
            translate.use(settings.language);
        });
    }

}