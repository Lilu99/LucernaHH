import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { stringify } from '@angular/core/src/util';


@Injectable()
export class PrecioClienteProvider {

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello PrecioClienteProvider Provider');
  }


  
  getPrecioClientes(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/precioCliente/all', {
     
    });
    
    
  }




}
