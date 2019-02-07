import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from '@angular/core/src/util';
/*
  Generated class for the NotaVentaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotaVentaProvider {

  constructor(public http: HttpClient) {
    console.log('Hello NotaVentaProvider Provider');
  }

  
createDetalleNota(NV_NOTA, NV_CLIENTE, NV_RAZON_SOCIAL, NV_NOMBRE_CLIENTE , NV_FECHA, NV_RUTA, NV_TIPO_VENTA,
  NV_SUBTOTAL, NV_IVA,NV_IEPS, NV_RECONOCIMIENTO, NV_TOTAL, NV_CORPO_CLIENTE, NV_ESTATUS_NOTA, NV_KILOLITROS_VENDIDOS): Observable<any>{
 return this.http
 .post('https://rateapiugl.herokuapp.com/api/notaVenta/create',{
  NV_NOTA,
  NV_CLIENTE,
  NV_RAZON_SOCIAL,
  NV_NOMBRE_CLIENTE,
  NV_FECHA,
  NV_RUTA,
  NV_TIPO_VENTA,
  NV_SUBTOTAL,
  NV_IVA,
  NV_IEPS,
  NV_RECONOCIMIENTO,
  NV_TOTAL,
  NV_CORPO_CLIENTE,
  NV_ESTATUS_NOTA,
  NV_KILOLITROS_VENDIDOS
 });
}

}
