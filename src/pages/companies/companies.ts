import { CompanyProvider } from './../../providers/company/company';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-companies',
  templateUrl: 'companies.html',
})
export class CompaniesPage {

  companies = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private company: CompanyProvider
    
    ) {
  }

  ionViewDidLoad() {
    this.getAllCompanies();
  }

  getAllCompanies(){
    this.company.getCompanies()
    .subscribe(res =>{
      console.log(res);
      this.companies = res.result;
    });
  }

}
