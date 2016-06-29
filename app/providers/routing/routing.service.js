import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class Routing {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
    this.server = "router.project-osrm.org";
    this.http = http;
  }

  getTimeBetween(A, B) {
    return new Promise(resolve => {
      this.http.get('http://' + this.server + '/viaroute?loc=' + A.lat + ',' + A.lng + '&loc=' + B.lat + ',' + B.lng)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data.route_summary.total_time);
        });
    });
  }

}

