import { ProductoProvider } from './../../providers/producto/producto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-productos',
  templateUrl: 'productos.html',
})
export class ProductosPage {

  productos: any;

  searchQuery: string = '';
  items: any;
  myitem= [];


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private producto:ProductoProvider
    ) {

      this.producto.getProductos().subscribe(res =>{
      this.productos = res.result;}) 

  }

  initializeItems() {
    this.items = this.productos;
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

  carritoVentas(producto){

    this.navCtrl.push("CarritoVtPage",{
      
      producto: producto

    });
    console.log(producto);
  }




}
