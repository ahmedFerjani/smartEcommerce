import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  getEmail() {
    return localStorage.getItem('email');
  }

  logout() {
    localStorage.clear();
  }

  constructor() {}

  ngOnInit(): void {}
}
