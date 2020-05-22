import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient, private router: Router) {}

  deleteUser(email: string) {
    this.http
      .delete<{ message: string }>('http://localhost:8000/deleteuser/' + email)
      .subscribe((res) => {
        console.log(res);
        this.logout();
      });
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }

  isAuth() {
    return (! (localStorage.getItem('email') == null)) ;
  }
}
