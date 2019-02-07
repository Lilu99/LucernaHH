import { PromosProvider } from './../../providers/promos/promos';
import { CargaInicialProvider } from './../../providers/carga-inicial/carga-inicial';
import { ArregloProvider } from './../../providers/arreglo/arreglo';
import { RevolventesProvider } from './../../providers/revolventes/revolventes';
import { TbHhUsuariosProvider } from './../../providers/tb-hh-usuarios/tb-hh-usuarios';
import { RutaProvider } from './../../providers/ruta/ruta';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ClienteProvider } from './../../providers/cliente/cliente';
import { ProductoProvider } from './../../providers/producto/producto';
import { PrecioProvider } from './../../providers/precio/precio';
import { PrecioClienteProvider } from './../../providers/precio-cliente/precio-cliente';
import { Storage } from '@ionic/storage';
import { Subscriber } from 'rxjs/Subscriber';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { daysInMonth } from 'ionic-angular/umd/util/datetime-util';
//****faltas proveedores de nota y estructura de la nota */



@IonicPage()
@Component({
  selector: 'page-descarga-listas',
  templateUrl: 'descarga-listas.html',
})
export class DescargaListasPage {

  //variables

  loading: any;
  rutamail
  

  clientes = [];
  clientesSQL: any = [];

  productos: any;
  productosSQL: any = [];

  precios = [];
  preciosSQL: any = [];

  precioCliente = [];
  precioClienteSQL: any=[];

  ruta = [];
  rutaSQL: any=[];

  tb_hh_usuarios = [];

  tb_hh_revolventes = [];

  arreglos = [];

  cargasIniciales = [];

  promos = [];

  fechaActual=new Date();
  folioIni='';
  dia = this.fechaActual.getDate();
  mes = this.fechaActual.getMonth()+1;
  anio = this.fechaActual.getFullYear();
  diaStr=this.dia.toString();
  mesStr=this.mes.toString();
  anioStr=this.anio.toString();

  rutaStr='';



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
    private cliente: ClienteProvider,
    private producto:ProductoProvider,
    private precioClientes: PrecioClienteProvider,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private Storage: Storage,
    private precioCtrl: PrecioProvider,
    private rutaProvider:RutaProvider,
    private TbUsuarios: TbHhUsuariosProvider,
    private revolventes: RevolventesProvider,
    private arreglosJSON: ArregloProvider,
    private cargaInicial: CargaInicialProvider,
    private promosiones: PromosProvider) {

      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescargaListasPage');
  }

  ionViewDidEnter(){
   this.getJSON();
  }

  ionViewWillEnter(){
    this.obtenerRuta();
  }

  showLoading(){
    
    this.loading = this.loadingCtrl.create({
      content: 'Bajando Datos..',
      duration: 36000
    });

    this.loading.present();
  }

  obtenerRuta(){
    this.Storage.get('useremail').then((val) =>{
      this.rutamail = parseInt(val);
      console.log(this.rutamail)

      
    this.rutaStr=this.rutamail.toString(); //la manda a una variable string para formar el folio de la ruta
    })
  }

  async doSQL(){
    try{
  await this.getData();
  //await this.showLoading();
  await this.navCtrl.setRoot("HomePage", {email: this.rutamail});

    }catch(error){
      if(error){
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['Ok']
        });
        alert.present();
      }
    }
  }

  async getJSON(){
    try{
    const cliePromise = this.cliente.getClientes().subscribe(res =>{
      console.log(res);
      this.clientes = res.result;});

    const prodPromise = this.producto.getProductos().subscribe(res =>{
      console.log(res);
      this.productos = res.result;});

     const precioPromise =  this.precioCtrl.getPrecios().subscribe(res =>{
      console.log(res);
      this.precios = res.result;});

     const precliePromise = this.precioClientes.getPrecioClientes().subscribe(res =>{
      console.log(res);
      this.precioCliente = res.result;});

      const rutaPromise =   this.rutaProvider.getRutas().subscribe(res =>{
        console.log(res);
        this.ruta = res.result;});

      const vendedoresPromise = this.TbUsuarios.getUsuarios().subscribe(res =>{
        console.log(res);
        this.tb_hh_usuarios = res.result;});

      const revolver = this.revolventes.getRevolventes().subscribe(res =>{
        console.log(res);
        this.tb_hh_revolventes = res.result;});
     
      const arregloPromise = this.arreglosJSON.getArreglo().subscribe(res =>{
        console.log(res);
        this.arreglos = res.result;});

      const cargaPromise = this.cargaInicial.getCargaInicial().subscribe(res =>{
          console.log(res);
          this.cargasIniciales = res.result;});

      const PromoPromise = this.promosiones.getPromos().subscribe(res =>{
            console.log(res);
            this.promos = res.result;});
      

      await Promise.all([cliePromise,prodPromise,precioPromise,precliePromise,rutaPromise,
        vendedoresPromise,revolver,arregloPromise,cargaPromise,PromoPromise]);
     }catch(error){

      if(error){
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['Ok']
        });
        alert.present();
      }
  }
}


  getData() {
   // this.showLoading();
  
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS clientes(CL_CLIENTE INTEGER PRIMARY KEY,CL_NOMNEGOCIO TEXT, CL_PUNTOVENTA TEXT, CL_RFC TEXT, CL_DIRNEGOCIO TEXT, CL_COLNEGOCIO TEXT, CL_CPCLIE INT, CL_CIUDADNEGOCIO TEXT, CL_CORPORACION INT, CL_RUTA INT, CL_LUNES TEXT, CL_MARTES TEXT, CL_MIERCOLES TEXT, CL_JUEVES TEXT, CL_VIERNES TEXT, CL_SABADO TEXT, CL_DOMINGO TEXT, CL_BAJA TEXT, CL_SUCURSAL INT, CL_EMPRESA INT  )', [])      
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_productos(PD_CLAVE INT, PD_NOMBRE TEXT, PD_UM TEXT, PD_GRUPO INT, PD_CANTXCAJA INT, PD_BAJA TEXT, PD_SUCURSAL INT, PD_EMPRESA INT, UM_CANTIDAD REAL)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_precios(PR_TIPO_PRECIO INT, PR_CLAVE INT, PR_PRECIO REAL, PR_IVA REAL, PR_IEPS REAL, PR_SUCURSAL INT, PR_EMPRESA INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_precio_cliente(PRC_RUTA_CLIE INT, PRC_CLIENTE INT, PRC_CLAVE INT, PRC_NOM_CLAVE TEXT, PRC_GRUPO INT, PRC_PRECIO_ESPECIAL REAL, PRC_IVA REAL, PRC_IEPS REAL, PRC_CORPO INT, PRC_SUCURSAL INT, PRC_EMPRESA INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_rutas(RT_RUTA INT, RT_NOMBRE TEXT, RT_TIPOPRECIO INT, RT_IDENTIFICADOR_EQUIPO INT, RT_SUCURSAL INT, RT_EMPRESA INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_usuarios(EM_NUMERO INT, EM_NOMBRE TEXT, EM_SUCURSAL INT, EM_EMPRESA INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_revolventes(RV_CLIENTE INT, RV_NOM_CLIENTE TEXT, RV_RUTA INT, RV_FECHA_NOTA DATE,RV_NOTA_REVOLVENTE TEXT,RV_TOTAL_NOTA REAL, RV_IVA_NOTA REAL, RV_IEPS_NOTA REAL, RV_SUCURSAL INT, RV_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_arreglos(AR_CLIENTE INT, AR_NOM_CLIENTE TEXT, AR_RUTA INT, AR_SALDO_PENDIENTE REAL,AR_COMPLETO TEXT,AR_SUCURSAL INT, AR_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_carga_iniciales(DM_RUTA INT, DM_CLAVE INT, DM_GRUPO INT, DM_CANTIDAD INT,DM_TIPO_MOV INT,DM_USUARIO_REGISTRO INT, DM_SUCURSAL INT, DM_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_promos(PM_CLAVE_PROMO INT, PM_CLAVE_PRODUCTO INT, PM_CANTIDAD INT, PM_PRECIOXUNIDAD_PROMO REAL,PM_APLICAR_RUTAS TEXT,PM_ESTATUS TEXT, PM_SUCURSAL INT,PM_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_inventario(IN_RUTA INT, IN_CLAVE INT, IN_GRUPO INT, IN_CANTIDAD INT,IN_TIPO_MOV INT,IN_USUARIO_REGISTRO INT, IN_SUCURSAL INT, IN_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_folio(FL_ULTIMO_FOLIO TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_nota_venta(NV_NOTA TEXT, NV_CLIENTE INT, NV_RAZON_SOCIAL TEXT, NV_NOMBRE_CLIENTE TEXT, NV_FECHA DATE, NV_RUTA INT, NV_TIPO_VENTA TEXT, NV_SUBTOTAL REAL, NV_IVA REAL, NV_IEPS REAL, NV_RECONOCIMIENTO REAL, NV_TOTAL REAL, NV_CORPO_CLIENTE INT, NV_ESTATUS_NOTA TEXT, NV_KILOLITROS_VENDIDOS REAL )', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_nota_detalle(DN_FECHA DATE, DN_NOTA TEXT, DN_CLAVE INT, DN_DESCRIPCION TEXT, DN_CANTIDAD_PIEZAS REAL, DN_PRECIO REAL, DN_IVA REAL, DN_IEPS REAL, DN_IMPORTE REAL)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));






/*****************************insertar JSON  en SQLITE********************************** */

      for(var i = 0; i<this.clientes.length; i++){


        if(this.clientes[i].CL_RUTA == this.rutamail){

        var CL_CLIENTE = this.clientes[i].CL_CLIENTE;
        var CL_NOMNEGOCIO = this.clientes[i].CL_NOMNEGOCIO;
        var CL_PUNTOVENTA = this.clientes[i].CL_PUNTOVENTA;
        var CL_RFC = this.clientes[i].CL_RFC;
        var CL_DIRNEGOCIO = this.clientes[i].CL_DIRNEGOCIO;
        var CL_COLNEGOCIO = this.clientes[i].CL_COLNEGOCIO;
        var CL_CPCLIE = this.clientes[i].CL_CPCLIE;
        var CL_CIUDADNEGOCIO = this.clientes[i].CL_CIUDADNEGOCIO;
        var CL_CORPORACION = this.clientes[i].CL_CORPORACION;
        var CL_RUTA = this.clientes[i].CL_RUTA;
        var CL_LUNES = this.clientes[i].CL_LUNES;
        var CL_MARTES = this.clientes[i].CL_MARTES;
        var CL_MIERCOLES = this.clientes[i].CL_MIERCOLES;
        var CL_JUEVES = this.clientes[i].CL_JUEVES;
        var CL_VIERNES = this.clientes[i].CL_VIERNES;
        var CL_SABADO = this.clientes[i].CL_SABADO;
        var CL_DOMINGO = this.clientes[i].CL_DOMINGO;
        var CL_BAJA = this.clientes[i].CL_BAJA;
        var CL_SUCURSAL = this.clientes[i].CL_SUCURSAL;
        var CL_EMPRESA = this.clientes[i].CL_EMPRESA;

        var query1 = "INSERT INTO clientes  (CL_CLIENTE,CL_NOMNEGOCIO,CL_PUNTOVENTA,CL_RFC,CL_DIRNEGOCIO,CL_COLNEGOCIO,CL_CPCLIE,CL_CIUDADNEGOCIO,CL_CORPORACION,CL_RUTA,CL_LUNES,CL_MARTES,CL_MIERCOLES,CL_JUEVES,CL_VIERNES,CL_SABADO,CL_DOMINGO,CL_BAJA,CL_SUCURSAL, CL_EMPRESA ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        db.executeSql(query1, [CL_CLIENTE,CL_NOMNEGOCIO,CL_PUNTOVENTA,CL_RFC,CL_DIRNEGOCIO,CL_COLNEGOCIO,
          CL_CPCLIE,CL_CIUDADNEGOCIO,CL_CORPORACION, CL_RUTA, CL_LUNES, CL_MARTES, CL_MIERCOLES, CL_JUEVES, 
          CL_VIERNES,CL_SABADO,CL_DOMINGO,CL_BAJA,CL_SUCURSAL,CL_EMPRESA ]).then(function(res) {
        }, function (err) {
          console.error(err);
        });
        }
      }

   
      
      for(var i = 0; i<this.productos.length; i++){
        var PD_CLAVE = this.productos[i].PD_CLAVE;
        var PD_NOMBRE = this.productos[i].PD_NOMBRE;
        var PD_UM = this.productos[i].PD_UM;
        var PD_GRUPO = this.productos[i].PD_GRUPO;
        var PD_CANTXCAJA = this.productos[i].PD_CANTXCAJA;
        var PD_BAJA = this.productos[i].PD_BAJA;
        var PD_SUCURSAL = this.productos[i].PD_SUCURSAL;
        var PD_EMPRESA = this.productos[i].PD_EMPRESA;
        var UM_CANTIDAD = this.productos[i].UM_CANTIDAD

        var query2 = "INSERT INTO tb_hh_productos(PD_CLAVE,PD_NOMBRE,PD_UM,PD_GRUPO,PD_CANTXCAJA, PD_BAJA, PD_SUCURSAL, PD_EMPRESA, UM_CANTIDAD ) VALUES (?,?,?,?,?,?,?,?,?)";
        db.executeSql(query2, [PD_CLAVE,PD_NOMBRE,PD_UM,PD_GRUPO,PD_CANTXCAJA,PD_BAJA,
          PD_SUCURSAL,PD_EMPRESA,UM_CANTIDAD]).then(function(res) {
        }, function (err) {
          console.error(err);
        });
      }

      for(var i = 0; i<this.precios.length; i++){
        var PR_TIPO_PRECIO = this.precios[i].PR_TIPO_PRECIO;
        var PR_CLAVE = this.precios[i].PR_CLAVE;
        var PR_PRECIO = this.precios[i].PR_PRECIO;
        var PR_IVA = this.precios[i].PR_IVA;
        var PR_IEPS = this.precios[i].PR_IEPS;
        var PR_SUCURSAL = this.precios[i].PR_SUCURSAL;
        var PR_EMPRESA = this.precios[i].PR_EMPRESA;
        var query3 = "INSERT INTO tb_hh_precios(PR_TIPO_PRECIO, PR_CLAVE, PR_PRECIO, PR_IVA, PR_IEPS, PR_SUCURSAL, PR_EMPRESA ) VALUES (?,?,?,?,?,?,?)";
        db.executeSql(query3, [PR_TIPO_PRECIO, PR_CLAVE, PR_PRECIO, PR_IVA, PR_IEPS, PR_SUCURSAL, PR_EMPRESA ]).then(function(res) {
        }, function (err) {
          console.error(err);
        });
      }

      for(var i = 0; i<this.precioCliente.length; i++){

        if(this.precioCliente[i].PRC_RUTA_CLIE === this.rutamail){

        var PRC_RUTA_CLIE = this.precioCliente[i].PRC_RUTA_CLIE;
        var PRC_CLIENTE = this.precioCliente[i].PRC_CLIENTE;
        var PRC_CLAVE = this.precioCliente[i].PRC_CLAVE;
        var PRC_NOM_CLAVE = this.precioCliente[i].PRC_NOM_CLAVE;
        var PRC_GRUPO = this.precioCliente[i].PRC_GRUPO;
        var PRC_PRECIO_ESPECIAL = this.precioCliente[i].PRC_PRECIO_ESPECIAL;
        var PRC_IVA = this.precioCliente[i].PRC_IVA;
        var PRC_IEPS = this.precioCliente[i].PRC_IEPS;
        var PRC_CORPO = this.precioCliente[i].PRC_CORPO;
        var PRC_SUCURSAL = this.precioCliente[i].PRC_SUCURSAL;
        var PRC_EMPRESA = this.precioCliente[i].PRC_EMPRESA;
        var query4 = "INSERT INTO tb_hh_precio_cliente(PRC_RUTA_CLIE, PRC_CLIENTE, PRC_CLAVE, PRC_NOM_CLAVE, PRC_GRUPO, PRC_PRECIO_ESPECIAL, PRC_IVA, PRC_IEPS, PRC_CORPO, PRC_SUCURSAL, PRC_EMPRESA) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        db.executeSql(query4, [PRC_RUTA_CLIE, PRC_CLIENTE, PRC_CLAVE, PRC_NOM_CLAVE, PRC_GRUPO, PRC_PRECIO_ESPECIAL, PRC_IVA, PRC_IEPS, PRC_CORPO, PRC_SUCURSAL, PRC_EMPRESA]).then(function(res) {
        }, function (err) {
          console.error(err);
          //this.presentToast(err)
        });
        }
      }
    

      for(var i = 0; i<this.ruta.length; i++){

        if(this.ruta[i].RT_RUTA === this.rutamail){

          var RT_RUTA = this.ruta[i].RT_RUTA;
          var RT_NOMBRE = this.ruta[i].RT_NOMBRE;
          var RT_TIPOPRECIO = this.ruta[i].RT_TIPOPRECIO;
          var RT_IDENTIFICADOR_EQUIPO = this.ruta[i].RT_IDENTIFICADOR_EQUIPO;
          var RT_SUCURSAL = this.ruta[i].RT_SUCURSAL;
          var RT_EMPRESA = this.ruta[i].RT_EMPRESA;
          var query5 = "INSERT INTO tb_hh_rutas(RT_RUTA, RT_NOMBRE, RT_TIPOPRECIO, RT_IDENTIFICADOR_EQUIPO, RT_SUCURSAL, RT_EMPRESA) VALUES (?,?,?,?,?,?)"
          db.executeSql(query5, [RT_RUTA, RT_NOMBRE, RT_TIPOPRECIO, RT_IDENTIFICADOR_EQUIPO, RT_SUCURSAL, RT_EMPRESA]).then(function(res) {
          }, function (err) {
            console.error(err);
            //this.presentToast(err)
          });
          }
        }


        for(var i = 0; i<this.tb_hh_usuarios.length; i++){
  
            var EM_NUMERO = this.tb_hh_usuarios[i].EM_NUMERO;
            var EM_NOMBRE = this.tb_hh_usuarios[i].EM_NOMBRE;
            var EM_SUCURSAL = this.tb_hh_usuarios[i].EM_SUCURSAL;
            var EM_EMPRESA = this.tb_hh_usuarios[i].EM_EMPRESA;
            var query6 = "INSERT INTO tb_hh_usuarios(EM_NUMERO, EM_NOMBRE, EM_SUCURSAL, EM_EMPRESA) VALUES (?,?,?,?)"
            db.executeSql(query6, [EM_NUMERO, EM_NOMBRE, EM_SUCURSAL, EM_EMPRESA]).then(function(res) {
            }, function (err) {
              console.error(err);
              //this.presentToast(err)
            });
          }


          for(var i = 0; i<this.tb_hh_revolventes.length; i++){

            if(this.tb_hh_revolventes[i].RV_RUTA == this.rutamail){
    
              var RV_CLIENTE = this.tb_hh_revolventes[i].RV_CLIENTE;
              var RV_NOM_CLIENTE = this.tb_hh_revolventes[i].RV_NOM_CLIENTE;
              var RV_RUTA = this.tb_hh_revolventes[i].RV_RUTA;
              var RV_FECHA_NOTA = this.tb_hh_revolventes[i].RV_FECHA_NOTA;
              var RV_NOTA_REVOLVENTE = this.tb_hh_revolventes[i].RV_NOTA_REVOLVENTE;
              var RV_TOTAL_NOTA = this.tb_hh_revolventes[i].RV_TOTAL_NOTA;
              var RV_IVA_NOTA = this.tb_hh_revolventes[i].RV_IVA_NOTA;
              var RV_IEPS_NOTA = this.tb_hh_revolventes[i].RV_IEPS_NOTA;
              var RV_SUCURSAL = this.tb_hh_revolventes[i].RV_SUCURSAL;
              var RV_EMPRESA = this.tb_hh_revolventes[i].RV_EMPRESA;
              var query7 = "INSERT INTO tb_hh_revolventes(RV_CLIENTE, RV_NOM_CLIENTE, RV_RUTA, RV_FECHA_NOTA, RV_NOTA_REVOLVENTE, RV_TOTAL_NOTA,RV_IVA_NOTA,RV_IEPS_NOTA,RV_SUCURSAL,RV_EMPRESA) VALUES (?,?,?,?,?,?,?,?,?,?)"
              db.executeSql(query7, [RV_CLIENTE, RV_NOM_CLIENTE, RV_RUTA, RV_FECHA_NOTA, RV_NOTA_REVOLVENTE, RV_TOTAL_NOTA,RV_IVA_NOTA,RV_IEPS_NOTA,RV_SUCURSAL,RV_EMPRESA]).then(function(res) {
              }, function (err) {
                console.error(err);
                //this.presentToast(err)
              });
              }
            }

            for(var i = 0; i<this.arreglos.length; i++){

               if(this.arreglos[i].AR_RUTA == this.rutamail){
       
                 var AR_CLIENTE = this.arreglos[i].AR_CLIENTE;
                 var AR_NOM_CLIENTE = this.arreglos[i].AR_NOM_CLIENTE;
                 var AR_RUTA = this.arreglos[i].AR_RUTA;
                 var AR_SALDO_PENDIENTE = this.arreglos[i].AR_SALDO_PENDIENTE;
                 var AR_COMPLETO = this.arreglos[i].AR_COMPLETO;
                 var AR_SUCURSAL = this.arreglos[i].AR_SUCURSAL;
                 var AR_EMPRESA = this.arreglos[i].AR_EMPRESA;
                 var query8 = "INSERT INTO tb_hh_arreglos(AR_CLIENTE, AR_NOM_CLIENTE, AR_RUTA, AR_SALDO_PENDIENTE, AR_COMPLETO, AR_SUCURSAL,AR_EMPRESA)VALUES (?,?,?,?,?,?,?)"
                 db.executeSql(query8, [AR_CLIENTE, AR_NOM_CLIENTE, AR_RUTA, AR_SALDO_PENDIENTE, AR_COMPLETO, AR_SUCURSAL,AR_EMPRESA]).then(function(res) {
                 }, function (err) {
                   console.error(err);
                   //this.presentToast(err)
                 });
                 }
               }

               


                for(var i = 0; i<this.cargasIniciales.length; i++){

                   if(this.cargasIniciales[i].DM_RUTA === this.rutamail){
           
                     var DM_RUTA = this.cargasIniciales[i].DM_RUTA;
                     var DM_CLAVE = this.cargasIniciales[i].DM_CLAVE;
                     var DM_GRUPO = this.cargasIniciales[i].DM_GRUPO;
                     var DM_CANTIDAD = this.cargasIniciales[i].DM_CANTIDAD;
                     var DM_TIPO_MOV = this.cargasIniciales[i].DM_TIPO_MOV;
                     var DM_USUARIO_REGISTRO = this.cargasIniciales[i].DM_USUARIO_REGISTRO;
                     var DM_SUCURSAL = this.cargasIniciales[i].DM_SUCURSAL;
                     var DM_EMPRESA = this.cargasIniciales[i].DM_EMPRESA;
                     var query9 = "INSERT INTO tb_hh_carga_iniciales(DM_RUTA, DM_CLAVE, DM_GRUPO, DM_CANTIDAD, DM_TIPO_MOV, DM_USUARIO_REGISTRO,DM_SUCURSAL,DM_EMPRESA)VALUES (?,?,?,?,?,?,?,?)"
                     db.executeSql(query9, [DM_RUTA, DM_CLAVE, DM_GRUPO, DM_CANTIDAD, DM_TIPO_MOV, DM_USUARIO_REGISTRO,DM_SUCURSAL,DM_EMPRESA]).then(function(res) {
                     }, function (err) {
                       console.error(err);
                       //this.presentToast(err)
                     });
                     }
                   }

                  //PROMOCIONES
                   for(var i = 0; i<this.promos.length; i++){

                       var PM_CLAVE_PROMO = this.promos[i].PM_CLAVE_PROMO;
                       var PM_CLAVE_PRODUCTO = this.promos[i].PM_CLAVE_PRODUCTO;
                       var PM_CANTIDAD = this.promos[i].PM_CANTIDAD;
                       var PM_PRECIOXUNIDAD_PROMO = this.promos[i].PM_PRECIOXUNIDAD_PROMO;
                       var PM_APLICAR_RUTAS = this.promos[i].PM_APLICAR_RUTAS;
                       var PM_ESTATUS = this.promos[i].PM_ESTATUS;
                       var PM_SUCURSAL = this.promos[i].PM_SUCURSAL;
                       var PM_EMPRESA = this.promos[i].PM_EMPRESA;
                       var query10 = "INSERT INTO tb_hh_promos(PM_CLAVE_PROMO,PM_CLAVE_PRODUCTO,PM_CANTIDAD,PM_PRECIOXUNIDAD_PROMO,PM_APLICAR_RUTAS,PM_ESTATUS,PM_SUCURSAL,PM_EMPRESA)VALUES (?,?,?,?,?,?,?,?)"
                       db.executeSql(query10, [PM_CLAVE_PROMO,PM_CLAVE_PRODUCTO,PM_CANTIDAD,PM_PRECIOXUNIDAD_PROMO,PM_APLICAR_RUTAS,PM_ESTATUS,PM_SUCURSAL,PM_EMPRESA]).then(function(res) {
                       }, function (err) {
                         console.error(err);
                         
                       });
                       //}
                     }

                     
                     //TABLA INVENTARIO:La primera vez sera igual a la tabla de cargas iniciales
                     for(var i = 0; i<this.cargasIniciales.length; i++){

                      if(this.cargasIniciales[i].DM_RUTA === this.rutamail){
              
                        var IN_RUTA = this.cargasIniciales[i].DM_RUTA;
                        var IN_CLAVE = this.cargasIniciales[i].DM_CLAVE;
                        var IN_GRUPO = this.cargasIniciales[i].DM_GRUPO;
                        var IN_CANTIDAD = this.cargasIniciales[i].DM_CANTIDAD;
                        var IN_TIPO_MOV = this.cargasIniciales[i].DM_TIPO_MOV;
                        var IN_USUARIO_REGISTRO = this.cargasIniciales[i].DM_USUARIO_REGISTRO;
                        var IN_SUCURSAL = this.cargasIniciales[i].DM_SUCURSAL;
                        var IN_EMPRESA = this.cargasIniciales[i].DM_EMPRESA;
                        var query11 = "INSERT INTO tb_hh_inventario(IN_RUTA, IN_CLAVE, IN_GRUPO, IN_CANTIDAD, IN_TIPO_MOV, IN_USUARIO_REGISTRO,IN_SUCURSAL,IN_EMPRESA)VALUES (?,?,?,?,?,?,?,?)"
                        db.executeSql(query11, [IN_RUTA, IN_CLAVE, IN_GRUPO, IN_CANTIDAD, IN_TIPO_MOV, IN_USUARIO_REGISTRO,IN_SUCURSAL,IN_EMPRESA]).then(function(res) {
                        }, function (err) {
                          console.error(err);
                          //this.presentToast(err)
                        });
                        }
                      }

                     //GENERA EL PRIMER FOLIO
                     
                     //Agrega un cero al numero de dia cuando sea menor a 10
                     if(this.dia<10)
                     {this.diaStr='0'+this.dia;}

                     //Agrega un cero al numero de mes cuando sea menor a 10
                     if(this.mes<10)
                     {this.mesStr ='0'+this.mes;}

                     //Extrae solo los ultimos dos digitos del año en curso
                     this.anioStr=this.anio.toString().substring(2);

                     //Concatena ceros al numero de ruta segun la cantidad de carasteres en el numero
                     if(this.rutaStr.length==1)
                     {this.rutaStr='000'+this.rutaStr;}
                     if(this.rutaStr.length==2)
                     {this.rutaStr='00'+this.rutaStr;}
                     if(this.rutaStr.length==3)
                     {this.rutaStr='0'+this.rutaStr;}

                     //Guarda el folio en variable
                     this.folioIni=this.rutaStr+this.diaStr+this.mesStr+this.anioStr+'000';
                     console.log(this.folioIni+ '      ->folio Inicializado');

                    //Inserta en la tabla folio                   
                    var query12 = "INSERT INTO tb_hh_folio(FL_ULTIMO_FOLIO)VALUES (?)" //siempre usar ?
                      db.executeSql(query12,[this.folioIni]); //lo que equivale al ?
                      
                    


/***************************************************************** */

      })
  
   }


}
