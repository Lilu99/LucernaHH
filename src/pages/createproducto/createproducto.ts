import { ProductoProvider } from './../../providers/producto/producto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-createproducto',
  templateUrl: 'createproducto.html',
})
export class CreateproductoPage {

    PD_CLAVE: number;
    PD_NOMBRE: string;
    PD_UM: string;
    PD_GRUPO: number;
    PD_CANTXCAJA:  number;
    PD_BAJA: string;
    PD_SUCURSAL:  number;
    PD_EMPRESA: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private producto:ProductoProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
    ) {
  }

  ionViewDidLoad() {
   
  }

  register(){
    this.producto.createProducto(
      this.PD_CLAVE,
      this.PD_NOMBRE,
      this.PD_UM,
      this.PD_GRUPO,
      this.PD_CANTXCAJA,
      this.PD_BAJA,
      this.PD_SUCURSAL,
      this.PD_EMPRESA)
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


  }

}
