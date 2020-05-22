import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

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
    this.accountService.logout();
  }

  constructor(private router: Router, private accountService: AccountService) {}

  ngOnInit(): void {
    $('#b-search_toggle').on('click', function () {
      var head_height = $('header').height();
      var window_height = $(window).height();
      var popup_height = window_height - head_height;
      $(this).find('i').toggleClass('icon-magnifier');
      $(this).find('i').toggleClass('icon-magnifier-remove');
      if ($('body').hasClass('b-search_open')) {
        $('.b-search_popup').css('top', '');
        $('.b-search_popup').css('height', '');
      } else {
        $('.b-search_popup').css('top', head_height);
        $('.b-search_popup').css('height', popup_height);
      }
      $('body').toggleClass('b-search_open');
    });
    $('#b-close_search').on('click', function () {
      $('#b-search_toggle i').addClass('icon-magnifier');
      $('#b-search_toggle i').removeClass('icon-magnifier-remove');
      $('.b-search_popup').css('top', '');
      $('.b-search_popup').css('height', '');
      $('body').removeClass('b-search_open');
    });

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
