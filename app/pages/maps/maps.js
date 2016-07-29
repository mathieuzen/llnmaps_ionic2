import {
    Page, Modal, NavController, ViewController, MenuController, NavParams, DynamicComponentLoader, Alert
}
from 'ionic-angular';
import {
    Component
}
from '@angular/core';
import {
    SearchModal
}
from '../search/search';
import {
    ItineraryModal
}
from '../itinerary/itinerary';
import {
    CompassModal
}
from '../compass/compass';
import {
    BuildingsService
}
from '../../providers/buildings/buildings.service';
import {
    Geolocation, DeviceOrientation, Splashscreen
}
from 'ionic-native';
import {
    Bearing
}
from '../../providers/bearing/bearing.service';
import {
    Routing
}
from '../../providers/routing/routing.service';
import {
    Settings
}
from '../../providers/settings/settings.service';
import {
    Popup
}
from '../../providers/buildings/popup';

@
Component({
    templateUrl: 'build/pages/maps/maps.html',
    providers: [[BuildingsService], [Popup], [Routing]]
})
export class MapsPage {
    static get parameters() {
        return [[NavController], [MenuController], [BuildingsService], [NavParams], [Popup], [Routing], [Bearing], [Settings]];
    }
    constructor(nav, menu, buildings, params, popup, routing, bearing, settings) {
        this.nav = nav;
        this.menu = menu;
        this.buildings = buildings;
        this.params = params;
        this.popup = popup;
        this.markers = {};
        this.routing = routing;
        this.bearing = bearing;
        this.bounds = {
            northWest: [50.687210, 4.580998],
            southEast: [50.637300, 4.650758]
        }
        this.settings = {};
        this.settingsService = settings;
        this.map = null;
        this.user = null;
        this.navigation = false;
        this.destination = null;
        this.footerAnimation = "slideOut"
            //default location to center on if no user plotted
        this.station = L.marker([50.669591, 4.615706]);
        this.preventNavigation = true;

        //observe changes in settings
        this.settingsService.settingsChange.subscribe((settings) => {
            this.settings = settings;
        });

        this.plotUser = function (position, map) {
            var userIcon = L.divIcon({
                html: '<img src="img/arrow.png"/>',
                className: "user-icon",
                opacity: 0
            });
            this.user = new L.Marker(position).setIcon(userIcon).addTo(map);
            this.bearing.setWatch(this.map, this.user);
        }

        this.setUserPosition = function (position) {
            this.user.setLatLng(position);
        }

        this.cluster = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                return L.AwesomeMarkers.icon({
                    markerColor: 'darkblue',
                    html: cluster.getChildCount()
                })
            },
            disableClusteringAtZoom: 17,
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 40
        });

        this.plotBuildings = function (map) {
            map.addLayer(this.cluster);
            for (let building of this.buildings.getAll()) {
                var buildingMarker = new L.Marker(building.pos, {
                    icon: L.AwesomeMarkers.icon({
                        prefix: 'fa',
                        icon: this.buildings.getIcon(building),
                        markerColor: this.buildings.getColor(building),
                        iconSize: [36, 45],
                        iconAnchor: [18, 45],
                        extraClasses: 'marker-icon'
                    }),
                    id: building.id
                });

                buildingMarker.bindPopup(new L.popup({
                    minWidth: 200
                }).setContent(popup.getContent(building.id, building.name, building.address)));
                this.cluster.addLayer(buildingMarker);
                this.markers[building.id] = buildingMarker;
            }
        }

        this.findMarker = function (id) {
            var activeMarker = this.markers[id];
            this.cluster.zoomToShowLayer(activeMarker, function () {
                activeMarker.openPopup();
            });
        }

        this.isNavigationDisabled = function () {
            return this.preventNavigation;
        }

    }

    ngOnInit() {

        var mapsPage = this;

        var routing = this.routing;
        var user = this.user;

        var map = new L.Map('map', {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true
        }).setView(this.station.getLatLng(), 14);


        map.on('popupopen', function (e) {

            var A = mapsPage.user.getLatLng();
            var B = e.popup._latlng;

            var px = map.project(B);
            px.y -= e.popup._container.clientHeight / 1
            map.panTo(map.unproject(px), {
                animate: true
            });
            routing.getTimeBetween(A, B).then((time) => {
                var min = Math.floor(time / 60);
                var sec = Math.floor(time % 60);
                e.popup._contentNode.children[0].children[4].children[0].innerHTML = " " + min + " min " + sec + " sec";
            });

            let goButton = document.getElementById('btnGo');
            if (mapsPage.preventNavigation) {
                goButton.setAttribute("disabled", true);
            } else {
                goButton.setAttribute("enabled", true);
            }
            goButton.onclick = ((e) => {
                mapsPage.destination = B;
                routing.getRouteBetween(A, B, map, mapsPage.navigation);
                mapsPage.navigation = true;
                mapsPage.footerAnimation = "slideIn";
                map.closePopup();
            });

        });
        
        var layer = new L.tileLayer('img/tiles/{z}/{x}/{y}.jpg', {
            maxZoom: 18,
            minZoom: 13,
            unloadInvisibleTiles: false
        }).addTo(map);

        setTimeout(function () {
            map.invalidateSize();
        });

        this.menu.swipeEnable(false);

        this.startGeolocation(true);

        this.map = map;
        this.plotBuildings(map);

    }


    showSearch() {
        let modal = Modal.create(SearchModal);
        this.nav.present(modal)
        modal.onDismiss(id => {
            this.findMarker(id);
        });
    }

    showItinerary() {
        var instructions = this.routing.getItinerary();
        let modal = Modal.create(ItineraryModal, {
            instructions: instructions
        });
        this.nav.present(modal)
    }

    showCompass() {
        let modal = Modal.create(CompassModal, {
            destination: this.destination
        });
        this.nav.present(modal)
    }

    cancelNavigation() {
        this.map.removeControl(this.routing.getControl());
        this.navigation = false;
        this.map.setView(this.station.getLatLng(), 14);
        this.footerAnimation = "slideOut"
    }

    isInLLN(position) {
        return position.latitude > this.bounds.southEast[0] && position.latitude < this.bounds.northWest[0] && position.longitude > this.bounds.northWest[1] && position.longitude < this.bounds.southEast[1];
    }

    alertNotInLLN() {
        let alert = Alert.create({
            title: 'Not in LLN',
            subTitle: 'Your position is outside Louvain-la-Neuve. You may still be able to explore the map but routing is disabled.',
            buttons: ['OK']
        });
        setTimeout(() => {
            this.nav.present(alert);
        }, 2000);
    }

    alertNoGPS() {

        let alert = Alert.create({
            title: 'No GPS enabled',
            subTitle: 'We cannot find your position. Please enable GPS on your phone.',
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.startGeolocation(false);
                }
            }]
        });
        setTimeout(() => {
            this.nav.present(alert);
        }, 2000);
    }

    startGeolocation(alert) {
        let watchPosition = Geolocation.watchPosition({
            maximumAge: Infinity,
            timeout: 15000,
            enableHighAccuracy: true
        });
        watchPosition.subscribe((position) => {
            if (this.user == null) {
                this.plotUser([position.coords.latitude, position.coords.longitude], this.map);
                if (this.isInLLN(position.coords)) {
                    this.preventNavigation = false;
                } else {
                    this.preventNavigation = true;
                    this.alertNotInLLN();
                }
            } else {
                var userPosition = [position.coords.latitude, position.coords.longitude];
                var newPosition = L.latLng(userPosition);
                var oldPosition = this.user.getLatLng();
                if (this.user.getLatLng().lat !== position.coords.latitude || this.user.getLatLng().lng !== position.coords.longitude) {
                    this.user.setLatLng(userPosition);
                    this.bearing.computeRotation(oldPosition, newPosition);
                    if (this.navigation) {
                        this.routing.disableFitSelectedRoutes();
                        this.routing.getControl().setWaypoints([this.user.getLatLng(), this.destination]);
                    }
                }
            }
        });
    }

}