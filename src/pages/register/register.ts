import { Storage } from '@ionic/storage';
import { RegisterProvider } from './../../providers/register/register';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  fullname: string;
  email: string;
  password: string;

  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    private reg: RegisterProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  loginPage(){
    this.navCtrl.setRoot("LoginPage");
  }

  userSignup(){
 
    if(this.fullname !== undefined || this.email !== undefined){
      this.showLoading();
      this.reg.registerUser(this.fullname, this.email, this.password)
      .subscribe(res =>{
        this.loading.dismiss();
        if(res.user){
          this.storage.set('useremail', res.user.email);
          this.navCtrl.setRoot("HomePage");
        }
  
        if(res.error){
          let alert = this.alertCtrl.create({
            title: 'Signup Error',
            subTitle: res.error,
            buttons: ['Ok']
            
          });
          alert.present();
        }
  
      });
  
      this.fullname = '';
      this.email = '';
      this.password = '';
    }else{
      let alert = this.alertCtrl.create({
        title: 'Signup Error',
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
