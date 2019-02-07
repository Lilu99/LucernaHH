import { PrecioProvider } from './../../providers/precio/precio';
import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ModalOptions, Modal, ToastController, Toast } from 'ionic-angular';
import { isRightSide } from 'ionic-angular/umd/util/util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

//nota en SQLite al 06-feb-2019 18:21pm

@IonicPage()
@Component({
  selector: 'page-carrito-vt',
  templateUrl: 'carrito-vt.html',
})
export class CarritoVtPage {


  clavesVenta: Array<any> = [];  
  cliente: any;
  productos: Array<any> = []; 
  precios = [];
  NotaVta: Array<any> = []; 

  tipRuta
 
  consulta2: any;
  consulta3: any;
  
  public today : number 	= Date.now();
  
  // variables de datos de cliente
  numCliente:Number 
  nombreCliente:String
  tipoVentaCliente:String
  reconocimientoCte:number
  revolventeCliente:String

  //VARIABLES PARA CALCULO DE TOTALES
  subtotalVta:number
  IVAVta:number
  IEPSVta:number
  totalSumaVta:number
  totalFinal:number
  KLAcumVta:number
  reconocimientoSobrante:number
  reconocimientoVta:number

//variables para Claves
 numCveAdd:Number
 nombreCveAdd:String
 precioCveAdd:Number
 pzCveAdd:Number
 IVACveAdd:Number
 IEPSCveAdd:Number
 importeCveAdd:Number
 imagenCveAdd:string

 CveEnLista:string  //esta variable se utiliza como bandera para indicar cuando la clave ya fue previamente agregada en la misma lista de venta.
 CveDuplicada:string

 //version final
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private modal: ModalController,
    private toastCtrl: ToastController,
    private precioCtrl: PrecioProvider,
    private sqlite: SQLite

    ) {
        
       this.productos;

       this.cliente = navParams.get('cliente');
 
       this.numCliente=49;
       this.nombreCliente=' ';
       this.tipoVentaCliente='CONTADO';
       this.reconocimientoCte=0.00;
       this.revolventeCliente="236.96";
 
       this.subtotalVta=0.00;
       this.IVAVta=0.00;
       this.IEPSVta=0.00;
       this.KLAcumVta=0.00;
       this.totalSumaVta=0.00;
       this.totalFinal=0.00;
       this.reconocimientoSobrante=0.00;
      
  }

  ionViewDidLoad() {
    //this.getAllClientes();
    this.getTipoPrecio()

  }

    ionViewWillEnter()
    {
        this.getReconocimientoClie();

    } 


    //FUNCION PARA AGREGAR PRODUCTO
    addClave(){

      let prompt = this.alertCtrl.create({
          title: 'Producto:',
          inputs: [{
              name: 'ClaveAdd'  //variable que trae el valor agregado
          }],
          buttons: [
              {
                  text: 'Cancelar'
              },
              {
                  text: 'Agregar',
                  handler: data => {
                      this.clavesVenta.push(data);
                  }
              }
          ]
      });

      prompt.present();
  }



  //FUNCION PARA BORRAR PRODUCTO
  deleteClave(cve){
    
    let index = this.productos.indexOf(cve);

    if(index > -1){
        this.productos.splice(index, 1);
    }

    
    /*let toast = this.toastCtrl.create({ //muestra un mensaje
        message: index+'  ' +cve,
        duration: 3000
      });
      toast.present();*/


      //inicializar en cero antes de recalcular
        this.subtotalVta=0;
        this.IVAVta=0;
        this.IEPSVta=0;
        this.totalSumaVta=0;
        this.KLAcumVta=0;

      for(var i = 0, len = this.productos.length; i < len; i++){
        
        //recalcula los valores finales de la venta despues de borrar un elemento. 
        this.subtotalVta= this.subtotalVta +(this.productos[i].importe - (this.productos[i].iva + this.productos[i].ieps))
        this.IVAVta= this.IVAVta + this.productos[i].iva;
        this.IEPSVta = this.IEPSVta + this.productos[i].ieps;
        this.totalSumaVta= this.totalSumaVta + (this.productos[i].importe );

             //Recalculo para kilolitros
             this.KLAcumVta=this.KLAcumVta+this.productos[i].equivalencia;
        }
        this.totalFinal= this.totalSumaVta-this.reconocimientoCte;
        
        if(this.totalFinal<0) //si el valor es negativo: hay sobrante de reconocimiento
        { 
            this.reconocimientoSobrante=this.totalFinal* (-1);  //multiplica el valor por -1 para guardar el valor del sobrante
            this.totalFinal=0.00;  //el  total  a pagar sera 0 mientras haya sobrante 
            this.reconocimientoVta=this.totalSumaVta; //el reconocimiento en los importes va a ser igual al total de la venta
             
        }

        if(this.totalFinal>0 || this.reconocimientoCte==(this.subtotalVta+this.IVAVta+this.IEPSVta)) //si el total a pagar es positivo  o si el reconocimiento cubre exactamente el total de la venta
        { 
            this.reconocimientoSobrante=0.00; //el reconocimiento  sobrante sera cero
            this.reconocimientoVta=this.reconocimientoCte; //el reconocimiento en los importes va a ser igual al reconocimiento total del cliente
            
        }
}

  

  listaProductos(){
      this.navCtrl.push("ProductosPage",{
          cliente: this.cliente
      });
  }

  openModal(){ //manda abrir el fragmento de productos
      const myModalOptions: ModalOptions ={
          enableBackdropDismiss: false   // ocultar el fragmento
          
      };

      const myModal: Modal = this.modal.create('ModalPage',{cliente: this.cliente, tipoRuta:this.tipRuta, reconoClie:this.reconocimientoCte}, myModalOptions);

      
      myModal.present();  //abre el modal

      myModal.onDidDismiss(producto =>{

     
        if(this.productos.length === 0){   //si es el primer producto que se agrega a la venta entra a esta opcion (el arreglo estaba vacio)
           
          
            for(var i = 0, len = producto.length; i < len; i++){
                this.productos[i] = producto[i];

                //calcula los valores finales de la venta
                this.subtotalVta= producto[i].importe - (producto[i].iva + producto[i].ieps)
                this.IVAVta= producto[i].iva;
                this.IEPSVta = producto[i].ieps;
                this.totalSumaVta=  producto[i].importe;
               
                //calculo para kilolitros
               this.KLAcumVta=producto[i].equivalencia;

            }
             //calculo del total a pagar 
            this.totalFinal= this.totalSumaVta-this.reconocimientoCte;

            //calculos para el reconocimiento
            if(this.totalFinal<0)
             { 
              this.reconocimientoSobrante=this.totalFinal* (-1);
              this.totalFinal=0.00;

              this.reconocimientoVta=this.totalSumaVta; //el reconocimiento en los importes va a ser igual al total de la venta
             
             }

             if(this.totalFinal>0 || this.reconocimientoCte==(this.subtotalVta+this.IVAVta+this.IEPSVta))
             { 
                 this.reconocimientoSobrante=0.00;
                 this.reconocimientoVta=this.reconocimientoCte; //el reconocimiento en los importes va a ser igual al reconocimiento total del cliente
             }

             


    } else {    //si ya hay mas productos en el carrito entra a esta opcion
      
      //valida que no se agreguen productos repetidos; esto aplica solo cuando ya existe algo con que comparar en la lista de venta.
      this.CveEnLista='0'; //reinicializa la variable en 0
      this.CveDuplicada=producto[0].nombre; //debe ser [0] porque solo trae un renglon del modal
      for(var r = 0, len2 = this.productos.length; r < len2; r++)  // se recorre el arreglo productos[] que es el que contiene la lista de venta del carrito
    {

      if(this.productos[r].clave==producto[0].clave)  //se compara el producto en el carrito con el producto que viene a insertarse desde el modal.
      {  
         this.presentToast(this.CveDuplicada);   //si la clave coincide es porque ya existia en el carrito asi que manda llamar la funcion que muestra un mensaje toast sobre la duplicidad.
         this.CveEnLista='1';  //se activa la bandera de existencia de la clave en lista de carrito.
         r=len2; //se iguala r a la longitud del arreglo productos para que al encontrar coincidencia deje de comparar el resto de la lista. (ya no entre al for)
      }

      else
      {  //si no hay coincidencia la bandera nunca cambiara de valor, por lo tanto la clave no se encuentra todavia en el carrito
         this.CveEnLista='0';
      }



    }

    //si la clave aun no esta en el carrito se inicia el proceso de insercion de la clave en la lista de venta.
       if(this.CveEnLista=='0')
       {       
           var j=this.productos.length;

           for(var i = 0, len = producto.length; i < len; i++){
            this.productos[j] = producto[i];

            //recalcula los valores finales de la venta por cada producto que se va agregando. (se suma lo anterior + lo nuevo)
              this.subtotalVta= this.subtotalVta +(producto[i].importe - (producto[i].iva + producto[i].ieps))
              this.IVAVta= this.IVAVta + producto[i].iva;
              this.IEPSVta = this.IEPSVta + producto[i].ieps;
              this.totalSumaVta= this.totalSumaVta + (producto[i].importe );

              //calculo para kilolitros
              this.KLAcumVta=this.KLAcumVta+ producto[i].equivalencia;

            j++;
            }

              //calculo del total a pagar 
            this.totalFinal= this.totalSumaVta-this.reconocimientoCte;

             //calculos para el reconocimiento
            if(this.totalFinal<0)
             { 
              this.reconocimientoSobrante=this.totalFinal* (-1);
              this.totalFinal=0.00;
              this.reconocimientoVta=this.totalSumaVta; //el reconocimiento en los importes va a ser igual al total de la venta
             
             }

             if(this.totalFinal>0 || this.reconocimientoCte==(this.subtotalVta+this.IVAVta+this.IEPSVta))
             { 
                 this.reconocimientoSobrante=0.00;
                 this.reconocimientoVta=this.reconocimientoCte; //el reconocimiento en los importes va a ser igual al reconocimiento total del cliente
   
             }
        }
      }
        console.log(this.productos.reverse()); //ver la  info del arreglo (el ultimo producto agregado siempre aparece al inicio de la lista)      
    });
   
    
  }

//funcion que manda el mensaje toast para indicar que la clave que se desea agregar ya se encuentra en la lista de venta del carrito. (recibe como parametro la clave que se duplica)
  presentToast(CveDuplicada) {
    let toast = this.toastCtrl.create({
      message: this.CveDuplicada+' Ya habia sido agregado a la lista de venta, si desea corregir debe eliminar la captura anterior.',
      duration: 8500,  //tiempo que permanece el mensaje en pantalla en milisegundos
      position: 'top'  //posicion de aparicion del mensaje en pantalla
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  //funcion para obtener el tipo de precio  segun la ruta
  getTipoPrecio(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      this.consulta2 = 'SELECT RT_TIPOPRECIO FROM tb_hh_rutas' 

      db.executeSql(this.consulta2, [])
      .then(res => {
        this.tipRuta;
        if(res.rows.length>0) {
          this.tipRuta =parseInt(res.rows.item(0).RT_TIPOPRECIO);
          //this.tipRuta = parseInt(this.tipoPrecioRuta.RT_TIPOPRECIO)
         }
         //this.tipoPrecioRuta(parseInt(res))
      })
      .catch(e => console.log(e));
  });
  

  }

//funcion para buscar y mostrar el valor del reconocimiento (arreglo)
  getReconocimientoClie(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      this.consulta3 = 'SELECT AR_SALDO_PENDIENTE FROM tb_hh_arreglos where AR_CLIENTE= ?' 

      db.executeSql(this.consulta3, [this.cliente.CL_CLIENTE])
      .then(res => {
        this.reconocimientoCte;
        if(res.rows.length>0) {
          this.reconocimientoCte =parseFloat(res.rows.item(0).AR_SALDO_PENDIENTE );          
         }

         else
         { this.reconocimientoCte=0.00;}  //si no encuentra un valor del arreglo para el cliente envia el valor en cero.

      console.log(this.reconocimientoCte);
      })

      .catch(e => console.log(e));
  });

  }

  goTicket(){

    //Envia los datos para la pagina del ticket
    this.navCtrl.push("TicketPage",{
      cliente: this.cliente,  //envia arreglo de datos del cliente
      productos:this.productos,  //envia arreglos de datos del producto
      tipoVentaCliente: this.tipoVentaCliente, //datos del total de la venta
      reconocimientoVta: this.reconocimientoVta,
      subtotalVta: this.subtotalVta,
      IVAVta: this.IVAVta,
      IEPSVta: this.IEPSVta,
      totalFinal: this.totalFinal,
      KLAcumVta: this.KLAcumVta,
      producto: this.productos,
      reconocimientoSobrante:this.reconocimientoSobrante
    });
  }

}//FIN1