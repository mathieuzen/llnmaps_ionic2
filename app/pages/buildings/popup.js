import {
    Injectable
}
from 'angular2/core'

@Injectable()
export class Popup {
    getContent(id, name, address) {
        return '<div><p>'+id+'</p><img style="width:200px;" src="img/buildings/'+id+'.jpg"><p style="word-wrap: break-word;">'+name+'</p><p>'+address+'</p><button id="btnGo" class="button button-block button-positive">Go</button></div>'
    }
}