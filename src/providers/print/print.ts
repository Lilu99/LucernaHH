
import { Injectable } from '@angular/core';
import {AlertController, DateTime} from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { T } from '@angular/core/src/render3';

@Injectable()
export class PrintProvider {
  printParteClaves='';
  printParteReconocimiento='';
  printParteLeyenda= '';

  TotalLetra='';
  TotalParcial=0;
  resto=0;
 
   fechaActual=new Date();
  //variables para mostrar el horario
   Hora = this.fechaActual.getHours();
   Minutos = this.fechaActual.getMinutes();
   Segundos = this.fechaActual.getSeconds();
    
   //variables tipo string para mostrar el horario
    h='';
    m='';
    s='';
    horaFinal=''; //concatenado de todas las partes que conforman la hora

  constructor(private btSerial:BluetoothSerial,private alertCtrl:AlertController) { }

  searchBt()
  {
    return this.btSerial.list();
  }

  connectBT(address)
  {
    return this.btSerial.connect(address);

  }

  ProveedorimpresionNotaVta(address,cliente,clavesVta,tipoVentaCliente, reconocimientoVta,subtotalVta,IVAVta, totalFinal,KLAcumVta,IEPSVta, rutamail, tipoImpresion, ultimoFolio )
  {
    console.log(cliente.CL_CLIENTE);

   // Si la Hora, los Minutos o los Segundos son Menores o igual a 9, le añadimos un 0 */
    if (this.Hora <= 9) 
    { this.h = "0" + this.Hora;}
    else{ this.h =  this.Hora.toString();}

    if (this.Minutos <= 9) 
    {this.m = "0" + this.Minutos}
    else{ this.m =  this.Minutos.toString();}

    if (this.Segundos <= 9) 
    {this.s= "0" + this.Segundos}
    else{ this.s =  this.Segundos.toString();}
    
    this.horaFinal=this.h+":"+this.m+":"+this.s
     
    this.TotalParcial=subtotalVta+IVAVta+IEPSVta;

    this.TotalLetra=this.NumeroALetras(totalFinal);
    console.log(this.TotalLetra);

    let  printParteCliente= "  UNION DE GANADEROS LECHEROS" +
    "\r\n" + "      DE JUAREZ SA DE CV" +
    "\r\n" + "         UGL870209DL0 "+
    "\r\n" + " RAMON RAYON #1351, WATERFILL "+
    "\r\n" + " RIO BRAVO, CD. JUAREZ, CHIH. "+
    "\r\n" + "          C.P. 32553"+
    "\r\n" + " "+
    "\r\n" + "    NOTA DE VENTA "+tipoImpresion+
    "\r\n" + " "+
    "\r\n" + "RUTA: "+rutamail+
    "\r\n" + "FOLIO: "+ultimoFolio+
    "\r\n" + "FECHA: "+this.fechaActual.toLocaleDateString('en-GB')+" "+this.horaFinal+
    "\r\n" + "TIPO DE VENTA:"+tipoVentaCliente+
    "\r\n" + " "+
    "\r\n" + "# CLIENTE: "+cliente.CL_CLIENTE+
    "\r\n" + cliente.CL_NOMNEGOCIO+
    "\r\n" + cliente.CL_PUNTOVENTA+
    "\r\n" + "R.F.C:" +cliente.CL_RFC+
    "\r\n" + cliente.CL_DIRNEGOCIO+", "+cliente.CL_COLNEGOCIO+
    "\r\n" + cliente.CL_CIUDADNEGOCIO+", C.P. "+cliente.CL_CPCLIE+
    "\r\n" + "CORPORACION: "+cliente.CL_CORPORACION+
    "\r\n" + "==============================="+
    "\r\n" + "Clave  Producto"+
    "\r\n" + "===============================";
     

    for( var i=0; i<clavesVta.length;i++)
    {  
      //Concatena ceros al numero de clave para que todos sean  de 4 digitos
    let  guardaClave=  "\r\n" + clavesVta[i]['clave']+" "+ clavesVta[i]['nombre']+
    "\r\n" + "  Cant:"+clavesVta[i]['cantidad']+ " Precio:$"+clavesVta[i]['precio']+
    "\r\n" + "  IVA:$"+parseFloat(clavesVta[i]['iva']).toFixed(2)+" IEPS:$"+parseFloat(clavesVta[i]['ieps']).toFixed(2)+
    "\r\n" + "  Importe:$"+parseFloat(clavesVta[i]['importe']).toFixed(2)+
    "\r\n" + "===============================";
       this.printParteClaves=this.printParteClaves+guardaClave;
    }



  let printParteImportes=  "\r\n" + " "+
    "\r\n" + "      Subtotal: $"+ parseFloat(subtotalVta).toFixed(2)+
    "\r\n" + "           IVA: $"+ parseFloat(IVAVta).toFixed(2)+
    "\r\n" + "          IEPS: $"+ parseFloat(IEPSVta).toFixed(2);


  if(parseFloat(reconocimientoVta)>0)
  {      
       this.printParteReconocimiento=  "\r\n" + "Reconocimiento: $"+ parseFloat(reconocimientoVta).toFixed(2);   
  }
 
  else 
  {
    this.printParteReconocimiento='';
  }

  let printParteTotales= 
    "\r\n" + " Total a Pagar: $"+  parseFloat(totalFinal).toFixed(2) +
    "\r\n" + " "+
    "\r\n" + this.TotalLetra+
    "\r\n" + "==============================="+
    "\r\n" + "* KILOLITROS VENDIDOS: "+parseFloat(KLAcumVta).toFixed(2)+
    "\r\n" + "==============================="+
    "\r\n" + " ";

if(tipoVentaCliente=='CREDITO')
{
    this.printParteLeyenda= 
    "\r\n" + "POR ESTE PAGARE ME(NOS) OBLIGO"+
    "\r\n" + "(MOS) PAGAR INCONDICIONALMENTE"+
    "\r\n" + "A LA ORDEN DE UNION DE GANADEROS"+
    "\r\n" + "LECHEROS DE JUAREZ SA DE CV "+
    "\r\n" + "LA CANTIDAD DE "+this.TotalLetra+
    "\r\n" + "POR MERCANCIAS RECIBIDAS A MI "+
    "\r\n" + "(NUESTRA) ENTERA SATISFACCION. "+
    "\r\n" + " "+
    "\r\n" + " "+
    "\r\n" + "ACEPTO(AMOS)___________________ "+
    "\r\n" + " "+
    "\r\n" + "  ESTA REMISION SE PAGA EN UNA  "+
    "\r\n" + "        SOLA EXHIBICION"+
    "\r\n" + " "+
    "\r\n" + " ";
}
else
     {this.printParteLeyenda=''}

    let printParteFinal= 
    "\r\n" + " ATENDIDO POR: 0000"+
    "\r\n" + " AQUI NOMBRE DEL EMPLEADO"+
    "\r\n" + " "+
    "\r\n" + "  VISITE NUESTRA PAGINA WEB:"+
    "\r\n" + "     WWW.LECHELUCERNA.COM"+
    "\r\n" + " TEL. 8925000 EXT.VENTAS 2112"+
    "\r\n" + "  APPVENTAS Ver.1.0.RLHDFO19"+
    "\r\n" + " "+
    "\r\n" + " "+
    "\r\n" + " ";
    
    let xyz=this.connectBT(address).subscribe(data=>{
      this.btSerial.write(printParteCliente+this.printParteClaves+printParteImportes+this.printParteReconocimiento+printParteTotales+this.printParteLeyenda+printParteFinal).then(dataz=>{
    
      console.log("IMPRESION REALIZADA",dataz);
      this.LimpiarVariables();

      
      /*  let mno=this.alertCtrl.create({
          title:"Impresion en Curso!",
          buttons:['Aceptar']
        });
        mno.present();*/

        xyz.unsubscribe();
      },errx=>{
        console.log("FALLO DE IMPRESION",errx);
        let mno=this.alertCtrl.create({
          title:"Error de Impresion debido a  "+errx,
          buttons:['Aceptar']
        });
        mno.present();
      });
      },err=>{
        console.log("ERROR DE CONEXION IMPRESORA",err);
        let mno=this.alertCtrl.create({
          title:"Error de conexión con impresora debido a "+err,
          buttons:['Aceptar']
        });
        mno.present();
      });

  }

  //CODIGO PARA CONVERTIR EL TOTAL DE NUMERO A LETRA
  NumeroALetras(num){
    var data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: "",
      letrasMonedaPlural: "PESOS",
      letrasMonedaSingular: "PESOS"
    };
  
    if (data.centavos > 0)
      data.letrasCentavos = "CON " + data.centavos + "/100";
  
    if(data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return this.Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
      return this.Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
  }

  Unidades(num){

    switch(num)
    {
      case 1: return "UN";
      case 2: return "DOS";
      case 3: return "TRES";
      case 4: return "CUATRO";
      case 5: return "CINCO";
      case 6: return "SEIS";
      case 7: return "SIETE";
      case 8: return "OCHO";
      case 9: return "NUEVE";
    }
  
    return "";
  }
  
Decenas(num){
  
    var decena = Math.floor(num/10);
    var unidad = num - (decena * 10);
  
    switch(decena)
    {
      case 1:   
        switch(unidad)
        {
          case 0: return "DIEZ";
          case 1: return "ONCE";
          case 2: return "DOCE";
          case 3: return "TRECE";
          case 4: return "CATORCE";
          case 5: return "QUINCE";
          default: return "DIECI" + this.Unidades(unidad);
        }
      case 2:
        switch(unidad)
        {
          case 0: return "VEINTE";
          default: return "VEINTI" + this.Unidades(unidad);
        }
      case 3: return this.DecenasY("TREINTA", unidad);
      case 4: return this.DecenasY("CUARENTA", unidad);
      case 5: return this.DecenasY("CINCUENTA", unidad);
      case 6: return this.DecenasY("SESENTA", unidad);
      case 7: return this.DecenasY("SETENTA", unidad);
      case 8: return this.DecenasY("OCHENTA", unidad);
      case 9: return this.DecenasY("NOVENTA", unidad);
      case 0: return this.Unidades(unidad);
    }
  }
  
DecenasY(strSin, numUnidades){
    if (numUnidades > 0)
      return strSin + " Y " + this.Unidades(numUnidades)
  
    return strSin;
  }
  
 Centenas(num){
  
    var centenas = Math.floor(num / 100);
    var decenas = num - (centenas * 100);
  
    switch(centenas)
    {
      case 1:
        if (decenas > 0)
          return "CIENTO " +this.Decenas(decenas);
        return "CIEN";
      case 2: return "DOSCIENTOS " + this.Decenas(decenas);
      case 3: return "TRESCIENTOS " + this.Decenas(decenas);
      case 4: return "CUATROCIENTOS " + this.Decenas(decenas);
      case 5: return "QUINIENTOS " + this.Decenas(decenas);
      case 6: return "SEISCIENTOS " + this.Decenas(decenas);
      case 7: return "SETECIENTOS " + this.Decenas(decenas);
      case 8: return "OCHOCIENTOS " + this.Decenas(decenas);
      case 9: return "NOVECIENTOS " + this.Decenas(decenas);
    }
  
    return this.Decenas(decenas);
  }
  
   Seccion(num, divisor, strSingular, strPlural)
   {
    var cientos = Math.floor(num / divisor)
    var letras = "";
  
    if (cientos > 0)
      if (cientos > 1)
        letras = this.Centenas(cientos) + " " + strPlural;
      else
        letras = strSingular;
  
    if (this.resto > 0)
      letras += "";
  
    return letras;
  }
  
 Miles(num){
    var divisor = 1000;
    var cientos = Math.floor(num / divisor)
    this.resto = num - (cientos * divisor)
  
    var strMiles = this.Seccion(num, divisor, "UN MIL", "MIL");
    var strCentenas = this.Centenas(this.resto);
  
    if(strMiles == "")
      return strCentenas;
  
    return strMiles + " " + strCentenas;
  
  }
  
  Millones(num){
    var divisor = 1000000;
    var cientos = Math.floor(num / divisor)
    var resto = num - (cientos * divisor)
  
    var strMillones = this.Seccion(num, divisor, "UN MILLON", "MILLONES");
    var strMiles = this.Miles(resto);
  
    if(strMillones == "")
      return strMiles;
  
    return strMillones + " " + strMiles;
  
 }

   LimpiarVariables()
   {
  this.printParteLeyenda='';
  this.printParteReconocimiento='';
  this.printParteReconocimiento='';
  this.printParteClaves='';
   }





}//fin
