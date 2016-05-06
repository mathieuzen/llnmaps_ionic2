import {
    Page
}
from 'ionic-angular';

@
Page({
    templateUrl: 'build/pages/maps/maps.html'
})
export class MapsPage {
    
    constructor() {
        //default location to center on if no user plotted 
        this.station = L.marker([50.669591, 4.615706]);
    }

    ngOnInit() {
        
        var map = new L.Map('map', {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true,
            markerZoomAnimation: true
        }).setView(this.station.getLatLng(), 14);
        
        var layer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '<span>&copy; <a href="http://osm.org/copyright">OpenStreetMap</a></span>',
            maxZoom: 18,
            minZoom: 13,
            unloadInvisibleTiles: false
        }).addTo(map);
        
        setTimeout(function(){        
        map.invalidateSize();
        });
        
    }

}