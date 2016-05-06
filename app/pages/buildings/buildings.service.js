import { Injectable } from 'angular2/core';

import { HALLS } from './halls';

@Injectable()
export class BuildingsService {
  getHalls() {
    return HALLS;
  }
}