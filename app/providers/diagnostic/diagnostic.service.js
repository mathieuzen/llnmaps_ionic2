import {
    Injectable
}
from '@angular/core';
import {
    Diagnostic
}
from 'ionic-native';
import {
    Alert
} from 'ionic-angular';
import {
    TRANSLATE_PROVIDERS,
    TranslateService,
    TranslatePipe,
    TranslateLoader,
    TranslateStaticLoader
}
from 'ng2-translate/ng2-translate';

@
Injectable()
export class DiagnosticService {
    static get parameters() {
        return [
            [TranslateService]
        ];
    }
    constructor(translate) {
        this.translate = translate;
    }

    requestGPS() {
        let diagnostic = this;

        return new Promise(function(resolve) {
            if (window.cordova) {
                window.cordova.plugins.diagnostic.isGpsLocationAvailable(function(available) {
                        if (available) {
                            console.log(available);
                            resolve(null);
                        } else {
                            console.log("no gps");
                            resolve(diagnostic.promptGPS());
                        }
                    },
                    function(error) {
                        console.error(error);
                        resolve(null);
                    });
            } else {
                resolve(null);
            }
        });
    }
    promptGPS() {
        let confirm = Alert.create({
            title: this.translate.get("promptGPSTitle").value,
            message: this.translate.get("promptGPSMsg").value,
            buttons: [{
                text: this.translate.get("no").value
            }, {
                text: this.translate.get("yes").value,
                handler: () => {
                    window.cordova.plugins.diagnostic.switchToLocationSettings();
                }
            }]
        });
        return confirm;
    }
}
