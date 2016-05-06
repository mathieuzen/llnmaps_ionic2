import {Page, Modal, NavController, ViewController, MenuController} from 'ionic-angular';
import {SearchModal} from '../search/search';
import {BuildingsService} from '../buildings/buildings.service';


@
Page({
    templateUrl: 'build/pages/maps/maps.html',
    providers: [BuildingsService]
})
export class MapsPage {
    static get parameters() {
        return [[NavController], [MenuController],[BuildingsService]];
    }
    constructor(nav, menu, buildings) {
        this.nav = nav;
        this.menu = menu;
        this.buildings = buildings;
        //default location to center on if no user plotted 
        this.station = L.marker([50.669591, 4.615706]);

        this.plotUser = function (position, map) {
            var userIcon = L.divIcon({
                html: '<img src="img/arrow.png"/>',
                className: "user-icon",
                opacity: 0
            });
            this.user = new L.Marker(position).setIcon(userIcon).addTo(map);
        }
    }

    ngOnInit() {

        var map = new L.Map('map', {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true,
            markerZoomAnimation: true
        }).setView(this.station.getLatLng(), 14);

        var layer = new L.tileLayer('img/tiles/{z}/{x}/{y}.jpg', {
            maxZoom: 18,
            minZoom: 13,
            unloadInvisibleTiles: false
        }).addTo(map);

        setTimeout(function () {
            map.invalidateSize();
        });

        this.menu.swipeEnable(false);

        this.plotUser([50.669591, 4.615706], map);
        
        console.log(this.buildings.getHalls());

    }

    showModal() {
        let modal = Modal.create(SearchModal);
        this.nav.present(modal)
    }

}