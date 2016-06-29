import {
    Page, Modal, NavController, ViewController, MenuController, NavParams, DynamicComponentLoader
}
from 'ionic-angular';
import { Component } from '@angular/core';
import {
    SearchModal
}
from '../search/search';
import {
    BuildingsService
}
from '../../providers/buildings/buildings.service';
import {
    Geolocation
}
from '../../providers/geolocation/geolocation.service';
import {
    Routing
}
from '../../providers/routing/routing.service';
import {
    Popup
}
from '../../providers/buildings/popup';

@
    Component({
        templateUrl: 'build/pages/maps/maps.html',
        providers: [[BuildingsService], [Popup], [Geolocation], [Routing]]
    })
export class MapsPage {
    static get parameters() {
        return [[NavController], [MenuController], [BuildingsService], [NavParams], [Popup], [Geolocation], [Routing]];
    }
    constructor(nav, menu, buildings, params, popup, geolocation, routing) {
        this.nav = nav;
        this.menu = menu;
        this.buildings = buildings;
        this.params = params;
        this.popup = popup;
        this.markers = {};
        this.geolocation = geolocation;
        this.routing = routing;
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
    }

    ngOnInit() {

        var routing = this.routing;
        var user = this.user;

        var map = new L.Map('map', {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true
        }).setView(this.station.getLatLng(), 14);


        map.on('popupopen', function (e) {
            var px = map.project(e.popup._latlng);
            px.y -= e.popup._container.clientHeight / 1.5
            map.panTo(map.unproject(px), {
                animate: true
            });
            routing.getTimeBetween(user.getLatLng(), e.popup.getLatLng()).then((time) => {
                var min = Math.floor(time / 60);
                var sec = Math.floor(time % 60);
                e.popup._contentNode.children[0].children[4].children[0].innerHTML = " " + min + " min " + sec + " sec";
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

        this.geolocation.getUserLocation().then((position) => {
            this.plotUser([position.latitude, position.longitude], map);
            user = this.user;
        });

        this.plotBuildings(map);

    }


    showModal() {
        let modal = Modal.create(SearchModal);
        this.nav.present(modal)
        modal.onDismiss(id => {
            this.findMarker(id);
        });
    }

}