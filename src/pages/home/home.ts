import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController, AlertController } from 'ionic-angular';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ClienteProvider } from './../../providers/cliente/cliente';
import { ProductoProvider } from './../../providers/producto/producto';
import { PrecioProvider } from './../../providers/precio/precio';
import { PrecioClienteProvider } from './../../providers/precio-cliente/precio-cliente'

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  clientes = [];
  clientesSQL: any = [];
  rutaNum
 
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     //public sqlite: SQLite,
     private cliente: ClienteProvider,
     public loadingCtrl: LoadingController) {

     this.rutaNum= navParams.get('email');
 
      
  }
/*
  getData() {
    
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS clientes(CL_CLIENTE INTEGER PRIMARY KEY,CL_NOMNEGOCIO TEXT, CL_PUNTOVENTA TEXT, CL_RFC TEXT, CL_DIRNEGOCIO TEXT, CL_COLNEGOCIO TEXT, CL_CPCLIE INT, CL_CUIDADNEGOCIO TEXT, CL_CORPORACION INT, CL_RUTA INT, CL_LUNES TEXT, CL_MARTES TEXT, CL_MIERCOLES TEXT, CL_JUEVES TEXT, CL_VIERNES TEXT, CL_SABADO TEXT, CL_DOMINGO TEXT, CL_BAJA TEXT, CL_SUCURSAL INT, CL_EMPRESA INT  )', [])      
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('SELECT CL_CLIENTE, CL_NOMNEGOCIO, CL_PUNTOVENTA, CL_RFC, CL_DIRNEGOCIO, CL_COLNEGOCIO  FROM clientes', [])
      .then(res => {
        this.clientesSQL = [];
        for(var i=0; i<res.rows.length; i++) {
          this.clientesSQL.push({CL_CLIENTE:res.rows.item(i).CL_CLIENTE,CL_NOMNEGOCIO:res.rows.item(i).CL_NOMNEGOCIO,razon_social:res.rows.item(i).CL_NOMNEGOCIO,
            CL_PUNTOVENTA:res.rows.item(i).CL_PUNTOVENTA,CL_RFC:res.rows.item(i).CL_RFC,CL_DIRNEGOCIO:res.rows.item(i).CL_DIRNEGOCIO,
            CL_COLNEGOCIO:res.rows.item(i).CL_COLNEGOCIO,
            })
        }
      })
      .catch(e => console.log(e));
  });

 
}
*/


  ionViewDidLoad() {
   // this.getAllClientes();
  // this.getData();
  }
/*
  getAllClientes(){
    this.cliente.getClientes()
    .subscribe(res =>{
      console.log(res);
      this.clientes = res.result;
      this.getData();
    });
  }
*/

  carritoVentas(event, cliente){
    this.navCtrl.push("CarritoVtPage",{
      cliente: cliente
    });
    
  }
   

}
