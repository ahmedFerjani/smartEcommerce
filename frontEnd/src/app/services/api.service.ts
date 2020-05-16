import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private cardinfoUpdated = new Subject();
  private searchproductsUpdated = new Subject();
  private seletedimageUpdated = new Subject();

  constructor(private http: HttpClient) {}

  getcardinfoListener() {
    return this.cardinfoUpdated.asObservable();
  }

  getsearchproductsListener() {
    return this.searchproductsUpdated.asObservable();
  }

  getselectedimageListener() {
    return this.seletedimageUpdated.asObservable();
  }

  login(data: FormData) {
    return this.http
      .post<{ message: string }>(
        'http://127.0.0.1:8000/login/',
        // {a: planData.get('name'), }
        data
      )
      // .subscribe((res) => {
      //   if (res) {
      //     localStorage.setItem('email', <any>data.getAll('email'));
      //   }
      // });
  }

  createUser(data: FormData) {
    return this.http
      .post<{ message: string }>(
        'http://127.0.0.1:8000/createuser/',
        data
      )

  }

  recognize(data: FormData) {
    return this.http
      .post<{
        user: {
          id: string;
          firstname: string;
          lastname: string;
          email: string;
          password: string;
        };
      }>('http://127.0.0.1:8000/recognize/', data)
      // .subscribe((res) => {
      //   if (res) {
      //     const credetialsForm = new FormData() ;
      //     credetialsForm.append('email',res.user.email) ;
      //     credetialsForm.append('password',res.user.password);
      //     this.login(credetialsForm) ;
      //   }
      // });
  }

  addAccountImage(data: FormData) {
    this.http
      .post<{ message: string[] }>('http://127.0.0.1:8000/addimage/', data)
      .subscribe((res) => {
        console.log(res);
      });
  }

  searchProduct(data: FormData, filename: string) {
    //console.log("data") ;
    //console.log(data.getAll('image'));
    console.log(filename);
    this.seletedimageUpdated.next({
      selectedimage: filename,
    });
    this.http
      .post<{ message: string[] }>('http://127.0.0.1:8000/search/', data)
      .subscribe((responseData) => {
        //console.log(responseData.message);
        this.searchproductsUpdated.next({
          products: responseData.message,
        });
      });
  }

  creditcard(data: FormData) {
    console.log(data.getAll('image'));

    this.http
      .post<{ cardnumber: string }>('http://127.0.0.1:8000/cardnumber/', data)
      .subscribe((responseData) => {
        console.log(responseData.cardnumber);
        this.cardinfoUpdated.next({
          cardnumber: responseData.cardnumber,
        });
      });
  }
}
