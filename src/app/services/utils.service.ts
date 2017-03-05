import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  GetRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
