import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from '@angular/core/src/util';



@Injectable()
export class CompanyProvider {

  email: any;


  constructor(public http: HttpClient, private storage: Storage) {
   
  }

  getUserData(): Observable<any>{
    this.getEmail();

    return this.http.get(`https://rateapiugl.herokuapp.com/api/home/${this.email}`);
  }


  getEmail(){
    this.storage.get('useremail').then(value => {
      this.email = value;
    });
  }

  createCompany(name, address, city, country, sector, website, userId?): Observable<any>{
    return this.http
    .post('https://rateapiugl.herokuapp.com/api/company/create',{
      name,
      address,
      city,
      country,
      sector,
      website,
      userId
    });
  }


  
  getCompanies(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/companies/all');
  }
  

}
