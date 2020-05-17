import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

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

  ngOnInit(): void {
    $('#b-nav_icon').on('click', function (event) {
      $('body').toggleClass('mobile-menu-open');
      return false;
    });
    $(document).on('click', function (e) {
      if (!$(e.target).is('.b-main_menu-wrapper, .b-main_menu-wrapper *')) {
        $('body').removeClass('mobile-menu-open');
      }
    });
    $(document).on('click', '.b-main_menu-wrapper ul li.has-sub > a', function (
      event
    ) {
      $(this).parent().find('.dropdown-inner').slideToggle('slow');
      return false;
    });
  }
}
