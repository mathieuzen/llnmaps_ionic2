import {
    Injectable
}
from '@angular/core';
import 'rxjs/Rx';
import {
    Observable
}
from 'rxjs/Observable';


@
Injectable()
export class Settings {
    constructor() {
        var userLang = navigator.language.split('-')[0];    
        this.defaultSettings = {
            language: userLang
        };
        this.settings = this.defaultSettings;
        this.settingsChange = new Observable(
            observer => this.settingsObserver = observer
        );
    }

    setLanguage(lang) {
        this.settings.language = lang;
        this.settingsObserver.next(this.settings);
    }

    setDefaultSettings() {
        this.settings = this.defaultSettings;
    }
}