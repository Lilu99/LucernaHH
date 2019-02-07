import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { stringify } from '@angular/core/src/util';
import { Storage } from '@ionic/storage';

@Injectable()
export class ClienteProvider {
  email: any;


  constructor(public http: HttpClient, private storage: Storage) {
   
  }

  getUserData(): Observable<any>{
    this.getEmail();

    return this.http.get(`https://rateapiugl.herokuapp.com/api/home/${this.email}`);
  }



  getEmail(){
    this.storage.get('useremail').then(value => {
      this.email = value;
    });
  }

  createCliente(num_cliente, nombre_negocio, razon_social, direccion, colonia_negocio, ciudad_negocio, corporacion, ruta, lunes, martes, miercoles, juevez, viernes, sabado, domingo, estatus, userId?): Observable<any>{
    return this.http
    .post('https://rateapiugl.herokuapp.com/api/cliente/create',{
      num_cliente, 
      nombre_negocio, 
      razon_social, 
      direccion, 
      colonia_negocio, 
      ciudad_negocio, 
      corporacion, 
      ruta, 
      lunes, 
      martes, 
      miercoles, 
      juevez, 
      viernes, 
      sabado, 
      domingo, 
      estatus,
      userId
    });
  }




  getClientes(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/clientes/all');
  }


}
