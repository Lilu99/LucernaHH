import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { stringify } from '@angular/core/src/util';
import { Observable } from 'rxjs/Observable';


/*
  Generated class for the PrecioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrecioProvider {

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello PrecioProvider Provider');
  }


  getPrecios(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/precios/all');
  }

  getClave(clave, tipoPrecio): Observable<any>{
    return this.http
    .post('https://rateapiugl.herokuapp.com/api/precios/consulta', {
      clave: clave,
      tipoPrecio: tipoPrecio
    });
  }


}
