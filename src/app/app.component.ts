import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage} from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; //AGREGAR PARA USAR SQL
import { CarritoVtPage } from '../pages/carrito-vt/carrito-vt';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;

  pages: any[];
  rutamail

  LimpiarClientes:string;
  LimpiarProductos:string;
  LimpiarPrecios:string;
  LimpiarPreciosCliente:string;
  LimpiarArreglos:string;
  LimpiarCargaInicial:string;
  LimpiarRevolvente:string;
  LimpiarRutas:string;
  LimpiarUsuarios :string;
  LimpiarPromos:string;
  LimpiarFolios: string;
  LimpiarInventario:string;
  LimpiarNotas:string;
  LimpiarDetalleNotas:string;








  constructor(  public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private alertCtrl:AlertController,
    private storage: Storage,private sqlite: SQLite, //Agregar para usar SQL
    private app:App) {
    
   
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Inicio', component:'HomePage', icon:'home'},
      {title: 'Descarga de Listas', component:'DescargaListasPage', icon:'create'},
      {title: 'Lista Clientes', component:'ClientesPage', icon:'list-box'},
      {title: 'Crear Nota TEST', component:'CreatecompanyPage', icon:'search'},
      {title: 'Leaderboard', component:'HomePage', icon:'archive'}
    ];


    platform.registerBackButtonAction(() =>{ 
      let Nav = app.getActiveNavs()[0];
      let active= Nav.getActive();

     if(active.instance instanceof CarritoVtPage)
     {
      const prompt = this.alertCtrl.create({
        title:'Confirmación:',
      
          message:'Si regresa a página de Inicio el registro de esta nota de venta No será guardado.',
          buttons:[
            {
              text: 'Ir a Inicio.',
              handler:()=>{
                //this.nav.popTo(this.nav.getByIndex(1)); //regresa a a pagina del listado de clientes
                this.nav.setRoot("HomePage"); //regresa a la pagina de Inicio 
            }
          },
          {
            text:'Ir a Venta.',
            handler: ()=>{
            }       
          }
          ]
        });
        prompt.present();

      }

    })
  }

  ionViewWillEnter(){
    this.storage.get('useremail').then((val) =>{
      this.rutamail = val;
      console.log(this.rutamail)
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('useremail').then(loggedIn =>{
        if(loggedIn === null){
          this.nav.setRoot("LoginPage");
        }
        if(loggedIn !== null){
          this.nav.setRoot("HomePage");
        }
      });
    });

  }

  openPage(page) {
    if(page.component === "HomePage"){
      this.nav.setRoot(page.component);
    }else{
      this.nav.push(page.component);
    }
    
  }

  logout(){
    this.storage.remove('useremail');
    this.nav.setRoot("LoginPage");


    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

       this.LimpiarClientes = `DROP TABLE clientes`
       db.executeSql(this.LimpiarClientes,[])

       this.LimpiarArreglos = `DROP TABLE tb_hh_arreglos`
       db.executeSql(this.LimpiarArreglos,[])

       this.LimpiarCargaInicial = `DROP TABLE tb_hh_carga_iniciales`
       db.executeSql(this.LimpiarCargaInicial,[])
        
      this.LimpiarPrecios = `DROP TABLE tb_hh_precios`
      db.executeSql(this.LimpiarPrecios,[])

      this.LimpiarPreciosCliente = `DROP TABLE tb_hh_precio_cliente`
      db.executeSql(this.LimpiarPreciosCliente,[])

      this.LimpiarProductos = `DROP TABLE  tb_hh_productos`
      db.executeSql(this.LimpiarProductos,[])

      this.LimpiarRevolvente = `DROP TABLE tb_hh_revolventes`
      db.executeSql(this.LimpiarRevolvente,[])

      this.LimpiarRutas = `DROP TABLE tb_hh_rutas`
      db.executeSql(this.LimpiarRutas,[])

      this.LimpiarUsuarios = `DROP TABLE tb_hh_usuarios`
      db.executeSql(this.LimpiarUsuarios,[])

      this.LimpiarPromos = `DROP TABLE tb_hh_promos`
      db.executeSql(this.LimpiarPromos,[])

      this.LimpiarFolios = `DROP TABLE tb_hh_folio`
      db.executeSql(this.LimpiarFolios,[])

      this.LimpiarInventario = `DROP TABLE tb_hh_inventario`
      db.executeSql(this.LimpiarInventario,[])

      this.LimpiarNotas = `DROP TABLE tb_hh_nota_venta`
      db.executeSql(this.LimpiarNotas,[])

      this.LimpiarDetalleNotas = `DROP TABLE tb_hh_nota_detalle`
      db.executeSql(this.LimpiarDetalleNotas,[])

    })


  }

  obtenerRuta(){
    
  }


}
