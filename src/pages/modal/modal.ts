import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { NumberFormatStyle } from '@angular/common';


/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  cliente

  productos: any;
  productosSQL: any=[];

  consulta: any;
  consulta2: any;

  searchQuery: string = '';
  items: any;
  myitem= [];
  promoClave: any;
  inruta: any;

  rutamail

promoSQL: any;

  tipoPrecioRuta: Number
  //tipRuta

  carrito: Array<any> = [];  //arreglo de objetos
 // objeto: Array<any> = []; //no usar esto creaun arreglo 
 objeto:any; //esto es solo un objeto 

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
      private view: ViewController,
       private producto:ProductoProvider,
       public alertCtrl:AlertController,
       private toastCtrl: ToastController,
       private Storage: Storage,
       private sqlite: SQLite) {

   // this.producto.getProductos().subscribe(res =>{
     // this.productos = res.result;}) 
     this.getData();

 

  }

  showPrompt(producto){   //ventana emergente para agregar cantidad de piezas
    if(producto.PD_NOMBRE.toString() == "PROMOCION PAQUETES"){
      this.getPromos(producto.PD_CLAVE);
      
    }
    
    const prompt = this.alertCtrl.create({
         

      title:'Cantidad',
      message:"Agrege cantidad a vender",
      inputs: [
        {
          name:'cantidad',
          placeholder:'#',
          type:'tel'    //activa el teclado numerico con punto decimal; si se usa solo number no aparece la opcion para poner el punto.
        },
      ],
      buttons:[
        {
          text: 'Cancelar',
          handler: data =>{
            console.log('cancelado');
          }
      },
      {
        
        text:'Guardar',
        handler: data=>{
     
          if(Number(data.cantidad)){
           if(data.cantidad > producto.EXISTENCIA){
            this.inventarioIn();
            this.closeModal();
           }else{

              this.objeto = {    //si usamos [{ ...}], [{ ... }]  crea un arreglo de arreglos
              clave: producto.PD_CLAVE,
              nombre: producto.PD_NOMBRE,
              precio:producto.PRECIO_FINAL,
              cantidad: data.cantidad,
              iva:producto.IVA_FINAL*producto.PRECIO_FINAL * data.cantidad,
              ieps:producto.IEPS_FINAL*producto.PRECIO_FINAL * data.cantidad,
              importe: (data.cantidad*producto.PRECIO_FINAL) + (producto.IEPS_FINAL*producto.PRECIO_FINAL*data.cantidad) + producto.IVA_FINAL*producto.PRECIO_FINAL*data.cantidad,
              equivalencia:producto.UM_CANTIDAD * data.cantidad
            }
          

            }

	  // }

           this.carrito.push(this.objeto);  //agrega la seleccion especifica de producto. 
           console.log (this.carrito);
           this.closeModal();
          }else{
            this.presentToast();
          }


        }
        
      }
      ]
    });
    prompt.present();
  }

  initializeItems() {
    this.items = this.productosSQL;
  }

  getItems(ev: any){
    // Reset items back to all of the items

    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.PD_NOMBRE.toUpperCase().indexOf(val.toUpperCase()) > -1);
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
    this.obtenerRuta();
    //this.getTipoPrecio()
    this.cliente = this.navParams.get('cliente');
    this.tipoPrecioRuta = this.navParams.get('tipoRuta')
  }

  closeModal(){
    /*
    let data = {
     'carrito': this.carrito
    };
    */
    this.view.dismiss(this.carrito); //se envia el arreglo del carrito
   // console.log(producto);

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Error: Captura no valida',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  inventarioIn() {
    let toast = this.toastCtrl.create({
      message: 'Error: Insuficiente Inventario',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }



  presentCosto() {
    let toast = this.toastCtrl.create({
      message: this.tipoPrecioRuta.toString(),
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  ionViewWillEnter(){
    
  }


  obtenerRuta(){
    this.Storage.get('useremail').then((val) =>{
      this.rutamail = parseInt(val);
      this.inruta = this.rutamail;
    })
  }

 getPromos(clave){
 //return new Promise(function(resolve, reject)
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    
    this.consulta = `select PM_CLAVE_PROMO, PM_CLAVE_PRODUCTO, PM_CANTIDAD, PM_PRECIOXUNIDAD_PROMO FROM tb_hh_promos WHERE PM_CLAVE_PROMO = ? AND PM_ESTATUS = "VIGENTE" `


    //db.executeSql(this.consulta, [this.rutamail, this.cliente.CL_CLIENTE, this.tipoPrecioRuta])
    console.log(clave);
    db.executeSql(this.consulta, [clave])
    .then(res => {
      this.promoSQL = [];
      for(var i=0; i<res.rows.length; i++) {
        this.promoSQL.push({PM_CLAVE_PRODUCTO:res.rows.item(i).PM_CLAVE_PRODUCTO, PM_CLAVE_PROMO:res.rows.item(i).PM_CLAVE_PROMO,
        PM_CANTIDAD:res.rows.item(i).PM_CANTIDAD,PM_PRECIOXUNIDAD_PROMO:res.rows.item(i).PM_PRECIOXUNIDAD_PROMO})
      }
     console.log(this.promoSQL)
    })
    .catch(e => console.log(e));
});
 // })
  
}

  



  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      this.consulta = `select * from(
        SELECT PD_CLAVE, PD_NOMBRE, PD_UM, PD_GRUPO, CASE WHEN PRC_PRECIO_ESPECIAL IS NOT NULL THEN PRC_PRECIO_ESPECIAL ELSE PR_PRECIO END AS PRECIO_FINAL, CASE WHEN  PRC_IVA IS NOT NULL THEN PRC_IVA ELSE PR_IVA END IVA_FINAL, CASE WHEN PRC_IEPS IS NOT NULL THEN PRC_IEPS ELSE PR_IEPS END AS IEPS_FINAL, PR_SUCURSAL, PR_EMPRESA,UM_CANTIDAD, IN_CANTIDAD AS EXISTENCIA/**/
                  FROM (SELECT Cve.PD_CLAVE, Cve.PD_NOMBRE, Cve.PD_UM, Cve.PD_GRUPO, Cve.PRC_PRECIO_ESPECIAL, Cve.PRC_IVA, Cve.PRC_IEPS, Cve.PR_PRECIO, Cve.PR_IVA, Cve.PR_IEPS, Cve.PR_SUCURSAL, Cve.PR_EMPRESA, Cve.UM_CANTIDAD, Inv.IN_CANTIDAD
              
          FROM( SELECT A.PD_CLAVE, A.PD_NOMBRE, A.PD_UM, A.PD_GRUPO,A.PRC_PRECIO_ESPECIAL, A.PRC_IVA, A.PRC_IEPS, B.PR_PRECIO, B.PR_IVA, B.PR_IEPS, B.PR_SUCURSAL, B.PR_EMPRESA, A.UM_CANTIDAD /**/
                               FROM (SELECT Y.PD_CLAVE, Y.PD_NOMBRE, Y.PD_UM, Y.PD_GRUPO, X.PRC_CLAVE, X.PRC_PRECIO_ESPECIAL, X.PRC_IVA, X.PRC_IEPS, Y.UM_CANTIDAD /**/
                                    FROM (SELECT PD_CLAVE, PD_NOMBRE, PD_UM, PD_GRUPO, UM_CANTIDAD/**/ FROM tb_hh_productos  WHERE (PD_BAJA <> 'B')) AS Y
                                                    LEFT JOIN
                                           (SELECT  PRC_CLAVE, PRC_PRECIO_ESPECIAL, PRC_IVA, PRC_IEPS FROM tb_hh_precio_cliente WHERE  (PRC_RUTA_CLIE = ?) AND (PRC_CLIENTE = ?)) AS X 
                                                           ON Y.PD_CLAVE = X.PRC_CLAVE) AS A
                                                     LEFT JOIN
                                           (SELECT PR_CLAVE, PR_PRECIO, PR_IVA, PR_IEPS, PR_SUCURSAL, PR_EMPRESA FROM  tb_hh_precios WHERE (PR_TIPO_PRECIO = ?)) AS B
                                                           ON A.PD_CLAVE = B.PR_CLAVE) AS Cve
                               INNER JOIN
                          (SELECT IN_CLAVE, IN_CANTIDAD FROM tb_hh_inventario) AS Inv   
                                          ON Cve.PD_CLAVE=Inv.IN_CLAVE ) AS P) F where PRECIO_FINAL is not null AND EXISTENCIA is not null ORDER BY PD_CLAVE DESC`


      //db.executeSql(this.consulta, [this.rutamail, this.cliente.CL_CLIENTE, this.tipoPrecioRuta])
      db.executeSql(this.consulta, [this.rutamail, this.cliente.CL_CLIENTE, this.tipoPrecioRuta])
      .then(res => {
        this.productosSQL = [];
        for(var i=0; i<res.rows.length; i++) {
          this.productosSQL.push({PD_CLAVE:res.rows.item(i).PD_CLAVE,PD_NOMBRE:res.rows.item(i).PD_NOMBRE, 
            PD_UM:res.rows.item(i).PD_UM,
            PD_GRUPO:res.rows.item(i).PD_GRUPO, 
            PRECIO_FINAL:res.rows.item(i).PRECIO_FINAL, 
            IVA_FINAL:res.rows.item(i).IVA_FINAL,
            IEPS_FINAL:res.rows.item(i).IEPS_FINAL,
            PR_SUCURSAL:res.rows.item(i).PR_SUCURSAL,
            PR_EMPRESA:res.rows.item(i).PR_EMPRESA,
            UM_CANTIDAD:res.rows.item(i).UM_CANTIDAD,
            EXISTENCIA:res.rows.item(i).EXISTENCIA
          })
        }
      })
      .catch(e => console.log(e));
  });
 
}


 /*
 async dobyPromos(clave){
   this.promoClave = clave;
   console.log ("clave de promo:");
   console.log (this.promoClave);
  var promos = await this.getPromos(this.promoClave)
   this.guardardobyPromo(promos);
   console.log ("si hacer querry");
           // this.promoSQL;
    console.log (this.promoSQL);
}
guardardobyPromo(promodobs){
  for(var i; promodobs.length; i++){
    this.objeto = {    //si usamos [{ ...}], [{ ... }]  crea un arreglo de arreglos
             clave: promodobs.PM_CLAVE_PRODUCTO,
             //nombre: this.promoSQL.,
             precio: promodobs.PM_PRECIOXUNIDAD_PROMO,
             cantidad: promodobs.PM_CANTIDAD,
            //iva:producto.IVA_FINAL*producto.PRECIO_FINAL, 
            iva:0,
            // ieps:producto.IEPS_FINAL*producto.PRECIO_FINAL,
            ieps: 0,
             importe: 0
           }
  }
  return this.objeto;
  
}
*/

}