import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { stringify } from '@angular/core/src/util';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PromosProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PromosProvider Provider');
  }

  getPromos(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/promos/all');
  }

}
