import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { stringify } from '@angular/core/src/util';
import { Observable } from 'rxjs/Observable';


/*
  Generated class for the ArregloProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ArregloProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ArregloProvider Provider');
  }

  getArreglo(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/arreglos/all');
  }

}
