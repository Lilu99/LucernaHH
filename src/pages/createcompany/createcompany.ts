import { NotaVentaProvider } from './../../providers/nota-venta/nota-venta';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-createcompany',
  templateUrl: 'createcompany.html',
})
export class CreatecompanyPage {
  NV_NOTA: String;
  NV_CLIENTE: Number;
  NV_RAZON_SOCIAL: String;
  NV_NOMBRE_CLIENTE: String;
  NV_FECHA: number 	= Date.now();
  NV_RUTA: Number;
  NV_TIPO_VENTA: String;
  NV_SUBTOTAL: Number;
  NV_IVA: Number;
  NV_IEPS: Number;
  NV_RECONOCIMIENTO: Number;
  NV_TOTAL:Number;
  NV_CORPO_CLIENTE: Number;
  NV_ESTATUS_NOTA: String;
  NV_KILOLITROS_VENDIDOS: Number;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private notaVenta: NotaVentaProvider,
     private alertCtrl: AlertController,
     private toastCtrl: ToastController
     ) {
  }

  ionViewDidLoad() {
   
  }

  ionViewDidEnter(){

  }

  register(){
    this.notaVenta.createDetalleNota(
      this.NV_NOTA,
      this.NV_CLIENTE,
      this.NV_RAZON_SOCIAL,
      this.NV_NOMBRE_CLIENTE,
      this.NV_FECHA,
      this.NV_RUTA,
      this.NV_TIPO_VENTA,
      this.NV_SUBTOTAL,
      this.NV_IVA,
      this.NV_IEPS,
      this.NV_RECONOCIMIENTO,
      this.NV_TOTAL,
      this.NV_CORPO_CLIENTE,
      this.NV_ESTATUS_NOTA,
      this.NV_KILOLITROS_VENDIDOS)
    .subscribe(res => {

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

      this.NV_NOTA = '';
      this.NV_CLIENTE = 0;
      this.NV_RAZON_SOCIAL = '';
      this.NV_NOMBRE_CLIENTE  = '';
      this.NV_RUTA = 0;
      this.NV_TIPO_VENTA  = '';
      this.NV_SUBTOTAL =0;
      this.NV_IVA = 0;
      this.NV_IEPS = 0;
      this.NV_RECONOCIMIENTO = 0;
      this.NV_TOTAL = 0;
      this.NV_CORPO_CLIENTE = 0;
      this.NV_ESTATUS_NOTA = '';
      this.NV_KILOLITROS_VENDIDOS = 0;


  }

}
