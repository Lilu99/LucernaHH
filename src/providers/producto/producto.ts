import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { stringify } from '@angular/core/src/util';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductoProvider {

  constructor(public http: HttpClient, private storage: Storage) {

  }

  createProducto(PD_CLAVE, PD_NOMBRE, PD_UM, PD_GRUPO, PD_CANTXCAJA, PD_BAJA, PD_SUCURSAL, PD_EMPRESA): Observable<any>{
    return this.http
    .post('https://rateapiugl.herokuapp.com/api/productos/create',{
      PD_CLAVE,
      PD_NOMBRE,
      PD_UM,
      PD_GRUPO,
      PD_CANTXCAJA,
      PD_BAJA,
      PD_SUCURSAL,
      PD_EMPRESA
    });
  }

  getProductos(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/productos/all');
  }



}
