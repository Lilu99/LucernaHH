import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RegisterProvider } from '../../providers/register/register';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string;
  password: string;

  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reg: RegisterProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private Storage: Storage
    ) {
  }

  ionViewDidLoad() {
    
  } 

  registerPage(){
     this.navCtrl.push("RegisterPage");
  }

  login(){

    if(this.email !== undefined || this.email !== undefined){
      this.showLoading();
      this.reg.loginUser(this.email, this.password)
      .subscribe(res =>{
        this.loading.dismiss();
        if(res.user){
          this.Storage.set('useremail', res.user.email);
          this.navCtrl.setRoot("HomePage",{
            email: res.user.email
          });
        }
  
        if(res.error){
          let alert = this.alertCtrl.create({
            title: 'Login Error',
            subTitle: res.error,
            buttons: ['Ok']
            
          });
          alert.present();
        }
  
      });
  

      this.email = '';
      this.password = '';
    }else{
      let alert = this.alertCtrl.create({
        title: 'Login Error',
        subTitle: 'You cannot submit empty fields',
        buttons: ['Ok']
        
      });
      alert.present();

    }
  }

  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating..',
      duration: 3000
    });

    this.loading.present();
  }
   
    
  }

