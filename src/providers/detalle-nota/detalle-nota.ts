import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from '@angular/core/src/util';


/*
  Generated class for the DetalleNotaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DetalleNotaProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DetalleNotaProvider Provider');
  }


createDetalleNota(DN_FECHA, DN_NOTA, DN_CLAVE, DN_DESCRIPCION, DN_CANTIDAD_PIEZAS, DN_PRECIO, DN_IVA,
  DN_IEPS, DN_IMPORTE): Observable<any>{
 return this.http
 .post('https://rateapiugl.herokuapp.com/api/detalleNota/create',{
  DN_FECHA,
  DN_NOTA,
  DN_CLAVE,
  DN_DESCRIPCION,
  DN_CANTIDAD_PIEZAS,
  DN_PRECIO,
  DN_IVA,
  DN_IEPS,
  DN_IMPORTE
 });
}


getDetalleNota(): Observable<any>{
 return this.http
 .get('https://rateapiugl.herokuapp.com/api/detalleNota/all');
}

}
