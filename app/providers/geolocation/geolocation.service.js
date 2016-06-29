import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class Geolocation {

  getUserLocation() {
    return new Promise(function(resolve, reject){
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords);
      });
    });
  }
  
}

