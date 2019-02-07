import { ClienteProvider } from './../../providers/cliente/cliente';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-create-cliente',
  templateUrl: 'create-cliente.html',
})
export class CreateClientePage {
  num_cliente: string;
  nombre_negocio: string;
  razon_social: string;
  direccion: string;
  colonia_negocio: string;
  ciudad_negocio: string;
  corporacion: string;
  ruta: string;
  lunes: string;
  martes: string;
  miercoles: string;
  juevez: string;
  viernes: string;
  sabado: string;
  domingo: string;
  estatus: string;
  userId: any;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private cliente: ClienteProvider,
     private alertCtrl: AlertController,
     private toastCtrl: ToastController
     ) {
  }

  ionViewDidLoad() {
   
  }
  ionViewDidEnter(){
    this.cliente.getUserData().subscribe(res => {
      if(res.user !== null){
        this.userId = res.user._id;
      }
    });
  }

  register(){
    this.cliente.createCliente(
      this.num_cliente,
      this.nombre_negocio,
      this.razon_social,
      this.direccion,
      this.colonia_negocio,
      this.ciudad_negocio,
      this.corporacion,
      this.ruta,
      this.lunes,
      this.martes,
      this.miercoles,
      this.juevez,
      this.viernes,
      this.sabado,
      this.domingo,
      this.estatus,
      this.userId)
    .subscribe(res => {
      console.log(res);

      if(res.message){
        let toast = this.toastCtrl.create({
          message: res.message,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }


      if(res.error){
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: res.error,
          buttons: ['OK']
        });
        alert.present();
      }

    });

    this.num_cliente = '';
    this.nombre_negocio = '';
    this.razon_social = '';
    this.direccion = '';
    this.colonia_negocio = '';
    this.ciudad_negocio = '';
    this.corporacion = '';
    this.ruta = '';
    this.lunes = '';
    this.martes = '';
    this.miercoles = '';
    this.juevez = '';
    this.viernes = '';
    this.sabado = '';
    this.domingo = '';
    this.estatus = '';


  }

}
