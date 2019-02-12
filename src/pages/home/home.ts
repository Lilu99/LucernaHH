import { Observable } from 'rxjs/Observable';
import { Component, ɵConsole } from '@angular/core';
import { IonicPage, NavController,ModalController,AlertController, NavParams,ToastController,  ViewController} from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import{Storage} from '@ionic/storage'
import {PrintProvider} from '../../providers/print/print';
import {PrinterListModalPage} from '../printer-list-modal/printer-list-modal';
import {NotaVentaProvider} from '../../providers/nota-venta/nota-venta'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IfObservable } from 'rxjs/observable/IfObservable';
//ultima modificacion 12/feb/2019 12:45 pm

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
 
//  clientes = [];
  clientesSQL: any;//objeto para guardar los resultados de la consulta de clientes
  rutaNum;


  selectedPrinter:any=[];
  db:SQLiteObject;

  notaCaptu:string;
  notaVtaSQL: any = [];
  notaVtaDetaSQL: any = [];

  tipoVentaCliente:String; //datos del total de la venta
  reconocimientoVta:number;
  subtotalVta:Number;
  IVAVta:Number;
  IEPSVta:Number;
  totalFinal:Number;
  KLAcumVta:Number;
  clienteNota:number;
  estatusNota:string;
  notaFolio:string;
  rutaNota:Number;


  tipoImpresion:string;
  tipoOperacion:string;
  updateEstatus:string; //para update

  //Variables para movimiento de inventarios
  claveCancel:number;
  updateSaldoInve:string; //para update

  errorImpresion:string;

  SaldoActual:number[]; //Saldo antes de agregar canceladas
  SaldoFinal:number[];  //Saldo despues de agregar canceladas

  //variables para movimiento de reconocimiento(arreglo)
  reconocimientoAntes:number;  //valor antes de cancelacion
  reconocimientoDespues:number; //valor despues de agregar monto cancelado
  updateReconocimiento:string;
  ReconocimientoCancel:number;

  constructor(public navCtrl: NavController,private modalCtrl:ModalController,
    private printProvider:PrintProvider,  private view: ViewController,
    private alertCtrl:AlertController,
    public navParams: NavParams,  private toastCtrl: ToastController,
    public Storage:Storage, private sqlite: SQLite, private notaVenta: NotaVentaProvider)  {

     this.rutaNum= navParams.get('email');
  }

  ionViewDidLoad() 
  { 
    this.buscarImpresora(); //Buscar impresora conectada por Bluetooth desde que se abre la pagina para que este lista al imprimir
  }


  buscarImpresora()
  {
    this.errorImpresion='N';

    this.printProvider.searchBt().then(datalist=>{
      
      //1.Abre el modal de impresion
      let abc=this.modalCtrl.create(PrinterListModalPage,{data:datalist});
      
      //2. Llama a la impresora conectada default (solo debe haber una impresora vinculada porque tomara siempre la primera)
      abc.onDidDismiss(dataR=>{
        this.selectedPrinter=dataR;
      });
      this.errorImpresion='N'; //GUARDA LA N SI NO HAY ERROR
      //0. Present Modal
      abc.present();

    },err=>{
      console.log("ERROR DE CONEXION REVISE SU IMPRESORA",err);
      let mno=this.alertCtrl.create({
        title:"La nota no pudo ser impresa pero en caso de haber cancelado, la cancelación se realizó correctamente., ("+err+")",
        buttons:['Aceptar']
      });
      this.errorImpresion='S';
      mno.present();
    })

  }


  showPromptReimprimir(){   //ventana emergente para reimprimir nota
    const prompt = this.alertCtrl.create({
         
      title:'REIMPRESIONES',
      message:"Capture la nota que desea reimprimir:",
      inputs: [
        {
          name:'notaR',
          placeholder:'#',
          type:'number',
       },
      ],
      buttons:[
        {
          text: 'Cerrar',
          handler: dataR =>{
          console.log('Reimpre cancelado');
          }
      },
      {
        
        text:'Reimprimir',
        handler: dataR=>{
        this.notaCaptu=dataR.notaR;
        this.tipoOperacion='R';

          this.buscarNota();  
        }       
      }
      ]
    });
    prompt.present();
  }


  showPromptCancelar(){   //ventana emergente para reimprimir nota
    const prompt = this.alertCtrl.create({
         
      title:'CANCELACIONES',
      message:"Capture la nota que desea cancelar:",
      inputs: [
        {
          name:'notaC',
          placeholder:'#',
          type:'number',
       },
      ],
      buttons:[
        {
          text: 'Cerrar',
          handler: dataR =>{
          console.log('Reimpre cancelado');
          }
      },
      {
        
        text:'Cancelar Nota',
        handler: dataC=>{
          this.notaCaptu=dataC.notaC;
          this.tipoOperacion='C';
         
          this.buscarNota();      
        }       
      }
      ]
    });
    prompt.present();
  }


  
  buscarNota()
  {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      console.log(this.notaCaptu);

      this.notaVtaSQL = [];
      db.executeSql('SELECT NV_NOTA, NV_CLIENTE, NV_FECHA, NV_RUTA, NV_TIPO_VENTA, NV_SUBTOTAL, NV_IVA, NV_IEPS, NV_RECONOCIMIENTO, NV_TOTAL,NV_ESTATUS_NOTA, NV_KILOLITROS_VENDIDOS  FROM tb_hh_nota_venta WHERE NV_NOTA=?', [this.notaCaptu])
      .then(res => {

        //Variables del concentrado de la nota de venta.
            this.notaFolio=res.rows.item(0).NV_NOTA;
            this.clienteNota=res.rows.item(0).NV_CLIENTE;
            this.rutaNota=res.rows.item(0).NV_RUTA;
            this.tipoVentaCliente=res.rows.item(0).NV_TIPO_VENTA;
            this.subtotalVta=res.rows.item(0).NV_SUBTOTAL;
            this.IVAVta=res.rows.item(0).NV_IVA;
            this.IEPSVta=res.rows.item(0).NV_IEPS;
            this.reconocimientoVta=res.rows.item(0).NV_RECONOCIMIENTO;
            this.totalFinal=res.rows.item(0).NV_TOTAL;
            this.KLAcumVta=res.rows.item(0).NV_KILOLITROS_VENDIDOS;
            this.estatusNota=res.rows.item(0).NV_ESTATUS_NOTA;
  
       return console.log(this.clienteNota);
      }).then(res=>{
      
        if(this.estatusNota=='CANCELADA' && this.tipoOperacion=='C')
        {
          let toast = this.toastCtrl.create({ //muestra un mensaje tipo toast
            message:'La nota ingresada ya fue cancelada anteriormente.',
            duration: 4000,
            position:'top' 

          });
          toast.present();
        }
        else
        { this.buscarCliente();}

     })
   })
  }

  buscarCliente() //busca los datos del cliente de la nota para mandarlos a la funcion de reimpresion
  {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
 
   
      this.clientesSQL = [];
      console.log(this.clienteNota);
      db.executeSql('SELECT CL_CLIENTE, CL_NOMNEGOCIO, CL_PUNTOVENTA, CL_RFC, CL_DIRNEGOCIO, CL_COLNEGOCIO, CL_CPCLIE, CL_CORPORACION , CL_CIUDADNEGOCIO FROM clientes WHERE CL_CLIENTE=?', [this.clienteNota])
      .then(res => {
    
          //ClienteSQL debe ser un objeto (no lleva push) ya que si se maneja como arreglo no lo puede leer la funcion de impresion
          this.clientesSQL={CL_CLIENTE:res.rows.item(0).CL_CLIENTE,CL_NOMNEGOCIO:res.rows.item(0).CL_NOMNEGOCIO,CL_CIUDADNEGOCIO:res.rows.item(0).CL_CIUDADNEGOCIO, CL_CPCLIE:res.rows.item(0).CL_CPCLIE,
            CL_PUNTOVENTA:res.rows.item(0).CL_PUNTOVENTA,CL_RFC:res.rows.item(0).CL_RFC,CL_DIRNEGOCIO:res.rows.item(0).CL_DIRNEGOCIO,
            CL_COLNEGOCIO:res.rows.item(0).CL_COLNEGOCIO, CL_CORPORACION:res.rows.item(0).CL_CORPORACION
            
        }
        return console.log(this.clientesSQL); 
          }).then(res=>{
          this.buscarDetalleNota();     
        })
      })
   }


  buscarDetalleNota() //guarda en un arreglo los productos que contiene la nota 
  {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      this.notaVtaDetaSQL = [];
      db.executeSql('SELECT DN_FECHA, DN_NOTA, DN_CLAVE, DN_DESCRIPCION, DN_CANTIDAD_PIEZAS, DN_PRECIO, DN_IVA, DN_IEPS, DN_IMPORTE  FROM tb_hh_nota_detalle WHERE DN_NOTA=?', [this.notaCaptu])
      .then(res => {
        for(var a=0; a<res.rows.length; a++) {
          this.notaVtaDetaSQL.push({fecha:res.rows.item(a).DN_FECHA, nota:res.rows.item(a).DN_NOTA, clave:res.rows.item(a).DN_CLAVE, nombre:res.rows.item(a).DN_DESCRIPCION,
           cantidad:res.rows.item(a).DN_CANTIDAD_PIEZAS, precio:res.rows.item(a).DN_PRECIO, iva:res.rows.item(a).DN_IVA,
            ieps:res.rows.item(a).DN_IEPS, importe:res.rows.item(a).DN_IMPORTE,
             })
         }
        
        console.log (this.notaVtaDetaSQL);
          }).then(res=>{

          if(this.tipoOperacion=='R') //si la operacion solo es reimprimir
            {this.ReimprimirNota();   }
            
          if(this.tipoOperacion=='C')  //si la opercion es cancelar llama a la funcion que busca y regresa al inventario
            { this.buscarInventario();}
            
      })
    })
  }
        
 
  ReimprimirNota()
  {
 if(this.errorImpresion!='S')  //si la impresora no esta en error
   {
    if(this.tipoOperacion=='R')  //so la operacion es reimprimir
     { 
      if(this.estatusNota=='ACTIVA')   //si la reimpresion es de una nota activa
       { this.tipoImpresion='[REIMPRESION-A]'; } 

      if(this.estatusNota=='CANCELADA') //si la reimpresion es de una nota cancelada
       { this.tipoImpresion='[REIMPRESION-C]'; }
     }

   if(this.tipoOperacion=='C')  //si la operacion es de cancelar la nota
   { 
      this.tipoImpresion='[CANCELACION]'; 
      this.reconocimientoVta=this.ReconocimientoCancel;
   } 

    var id=this.selectedPrinter.id;  //si no se encuentra ninguna impresora vinculada
    if(id==null||id==""||id==undefined)
    {
      //No hay alguna impresora seleccionada: la direccion sera nula, vacia o indefinida
       let toast = this.toastCtrl.create({ //muestra un mensaje tipo toast
        message:'El proceso se realizó correctamente, pero No se encontró la impresora vinculada o el Bluetooth esta apagado. Revise el equipo y reimprima su nota mas tarde.',
        duration: 6000,
        position:'top' 

      });
      toast.present();
    }
    else
    {             
                                                          // id es la direccion de la impresora conectada
      let foo=this.printProvider.ProveedorimpresionNotaVta(id,this.clientesSQL, this.notaVtaDetaSQL,this.tipoVentaCliente, this.reconocimientoVta, this.subtotalVta,this.IVAVta, this.totalFinal,this.KLAcumVta, this.IEPSVta,   this.rutaNota, this.tipoImpresion, this.notaFolio);  

    //reimprimir nota 2  veces o seleccione No
    let alert = this.alertCtrl.create({
      title: 'Desea otra impresión de la venta?',
      buttons: [
          {
              text: 'SI',
              handler: () => {
                  alert.dismiss(true);
                  let foo=this.printProvider.ProveedorimpresionNotaVta(id,this.clientesSQL, this.notaVtaDetaSQL,this.tipoVentaCliente, this.reconocimientoVta, this.subtotalVta,this.IVAVta, this.totalFinal,this.KLAcumVta, this.IEPSVta,   this.rutaNota, this.tipoImpresion, this.notaFolio);   
                  return false;
              }
          }, {
              text: 'No',
              handler: () => {
                  alert.dismiss(false);
                  return false;
              }
          }
      ]
   });

   alert.present(); 
    }
  }
}
  buscarInventario() //busca las claves en el inventario para conocer su existencia actual y guardarla en un arreglo
   {     
    this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {

   //this.SaldoActual = []; 
      for(var e =0; e<this.notaVtaDetaSQL.length; e++)
       {
         this.SaldoActual = []; 
        this.claveCancel=this.notaVtaDetaSQL[e]['clave'];
        db.executeSql('SELECT IN_CANTIDAD FROM tb_hh_inventario WHERE IN_CLAVE=?', [this.claveCancel])

       .then(res => {      
      
         this.SaldoActual.push(res.rows.item(0).IN_CANTIDAD) 
         console.log(this.SaldoActual.length, 'longitud saldo actual');
         console.log(this.SaldoActual, 'cantidad en inventario');
         this.sumarInventario();

          }).catch(e => console.log(e));      
       } 
     }).then(res =>{
     })
  

     if(this.reconocimientoVta>0)   //si hay reconocimiento aplicado en la nota (debe regresarse tambien)
     { this.consultarReconocimientoClie();}

     if(this.reconocimientoVta=0)
     { this.CambiarEstatusCancelacion();}
   
  }

  sumarInventario()  //suma las piezas canceladas al inventario actual
   {
    this.SaldoFinal =[]
    for(var p=0; p<this.SaldoActual.length; p++){
      console.log("entra a for de suma cancel")
      this.SaldoFinal.push(this.SaldoActual[p] + this.notaVtaDetaSQL[p]['cantidad'])
      console.log(this.SaldoActual[p], '+', this.notaVtaDetaSQL[p]['cantidad'], " cantidades nuevas ", this.SaldoFinal)
    }

     this.sqlite.create({
       name: 'ionicdb.db',
       location: 'default'
     }).then((db: SQLiteObject) => {
      console.log("update de saldo de ",this.SaldoFinal)

      console.log(this.SaldoFinal)
      for(var i=0; i<this.SaldoFinal.length; i++)
        {
        this.updateSaldoInve = `UPDATE tb_hh_inventario SET IN_CANTIDAD = ? WHERE IN_CLAVE = ?`
        db.executeSql(this.updateSaldoInve, [this.SaldoFinal[i],this.notaVtaDetaSQL[i]['clave']])
        .catch(e => console.log(e));
          console.log('proceso termino update inventario');      
        }        
      })
    
   }

    consultarReconocimientoClie() //Busca el monto pendiente del arreglo y le suma el monto encontrado en la nota cancelada
    { 
      this.ReconocimientoCancel=this.reconocimientoVta;

      this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
      }).then((db: SQLiteObject) => {
       
      db.executeSql('SELECT AR_SALDO_PENDIENTE FROM tb_hh_arreglos WHERE AR_CLIENTE=?', [this.clienteNota])

     .then(res => {      
    
     return  this.reconocimientoAntes=res.rows.item(0).AR_SALDO_PENDIENTE;  //utilizar return para que entre al codigo del then       
      
        }).then(res =>{     //el then debe estar justo debajo del return     

          this.reconocimientoDespues=this.reconocimientoAntes+this.ReconocimientoCancel;
          console.log(this.reconocimientoAntes,'+',this.ReconocimientoCancel,'=',this.reconocimientoDespues ,' reconocimiento final');

         this.updateReconocimiento = 'UPDATE tb_hh_arreglos SET AR_SALDO_PENDIENTE = ? WHERE AR_CLIENTE=?'
         db.executeSql(this.updateReconocimiento, [this.reconocimientoDespues,this.clienteNota])
       
         .catch(e => console.log(e));
          console.log('se actualizo el arreglo cliente ',this.clienteNota, 'por ',this.reconocimientoDespues);

          
    }).catch(e => console.log(e));      
       
         })
         this.CambiarEstatusCancelacion() //Manda llamar la funcion de cambio de estatus a Cancelada y la impresion de la nota
  }

   CambiarEstatusCancelacion()
   {  //Actualiza el estatus de la nota cuando es cancelada 
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
      }).then((db: SQLiteObject) => {

       this.updateEstatus = `UPDATE tb_hh_nota_venta SET NV_ESTATUS_NOTA='CANCELADA' WHERE NV_NOTA=?`

       db.executeSql(this.updateEstatus, [this.notaCaptu])
       .catch(e => console.log(e));
         console.log('update de cancel',this.notaCaptu)  
        }).then(res=>{

              this.ReimprimirNota();
        })
    
  }

  carritoVentas(event, cliente){
    this.navCtrl.push("CarritoVtPage",{
      cliente: cliente
    });   
  }
}
