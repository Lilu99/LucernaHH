import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage} from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; //AGREGAR PARA USAR SQL


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








  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private storage: Storage,private sqlite: SQLite //Agregar para usar SQL
    ) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Inicio', component:'HomePage', icon:'home'},
      {title: 'Descarga de Listas', component:'DescargaListasPage', icon:'create'},
      {title: 'Lista Clientes', component:'ClientesPage', icon:'list-box'},
      {title: 'Crear Nota TEST', component:'CreatecompanyPage', icon:'search'},
      {title: 'Leaderboard', component:'HomePage', icon:'archive'}
    ];

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

      this.LimpiarInventario = `DROP TABLE tb_hh_inventario `
      db.executeSql(this.LimpiarInventario,[])

    })


  }

  obtenerRuta(){
    
  }


}
