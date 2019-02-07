import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';




@Injectable()
export class RegisterProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RegisterProvider Provider');
    
  }


  registerUser(fullname, email, password):Observable<any>{
    return this.http
    .post('https://rateapiugl.herokuapp.com/api/singup/user',{
      fullname: fullname,
      email: email,
      password: password
    });
  }

  loginUser(email, password): Observable<any>{
    return this.http
    .post('https://rateapiugl.herokuapp.com/api/login/user', {
      email: email,
      password: password
    });
  }
 



}
