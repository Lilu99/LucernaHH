import { ProductosPage } from './../pages/productos/productos';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import {RoundProgressModule} from 'angular-svg-round-progressbar';



import { IonicStorageModule } from '@ionic/storage';


import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RegisterProvider } from '../providers/register/register';
import { CompanyProvider } from '../providers/company/company';
import { ClienteProvider } from '../providers/cliente/cliente';
import { ProductoProvider } from '../providers/producto/producto';
import { CarritoProvider } from '../providers/carrito/carrito';
import { PrecioProvider } from '../providers/precio/precio';
import { PrecioClienteProvider } from '../providers/precio-cliente/precio-cliente';
import { RutaProvider } from '../providers/ruta/ruta';
import { TbHhUsuariosProvider } from '../providers/tb-hh-usuarios/tb-hh-usuarios';
import { RevolventesProvider } from '../providers/revolventes/revolventes';
import { PromosProvider } from '../providers/promos/promos';
import { CargaInicialProvider } from '../providers/carga-inicial/carga-inicial';
import { ArregloProvider } from '../providers/arreglo/arreglo';
import { NotaVentaProvider } from '../providers/nota-venta/nota-venta';
import { DetalleNotaProvider } from '../providers/detalle-nota/detalle-nota';
import { PrintProvider } from '../providers/print/print';

import {PrinterListModalPage} from '../pages/printer-list-modal/printer-list-modal';  //PARA IMPRIMIR SE DEBE AGREGAR ESTA LINEA
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';




@NgModule({
  declarations: [
    MyApp,
    PrinterListModalPage //PARA IMPRIMIR SE DEBE AGREGAR ESTA LINEA
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoundProgressModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PrinterListModalPage //PARA IMPRIMIR SE DEBE AGREGAR ESTA LINEA
     
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RegisterProvider,
    CompanyProvider,
    ClienteProvider,
    ProductoProvider,
    CarritoProvider,
    PrecioProvider,
    PrecioClienteProvider,
    SQLite,
    Toast,
    RutaProvider,
    TbHhUsuariosProvider,
    RevolventesProvider,
    PromosProvider,
    CargaInicialProvider,
    ArregloProvider,
    NotaVentaProvider,
    DetalleNotaProvider,
    PrintProvider, //PARA IMPRIMIR SE DEBE AGREGAR ESTA LINEA
    BluetoothSerial,
    NotaVentaProvider

  ]
})
export class AppModule {}
