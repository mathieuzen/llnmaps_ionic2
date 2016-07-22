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

@
Component({
    templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsPage {
    static get parameters() {
        return [[Settings]];
    }

    constructor(settings) {
        this.settingsService = settings;
        this.settings = this.settingsService.settings;
        
        //observe changes in settings
        this.settingsService.settingsChange.subscribe((settings) => {
            this.settings = settings;
        });
    }

}