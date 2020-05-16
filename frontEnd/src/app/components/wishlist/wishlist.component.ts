import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  getWishProducts() {
    return new Set(JSON.parse(localStorage.getItem('products_wish') || '[]'));
  }



  removeProductFromWish(product: string) {
    let productss = [];
    const products = JSON.parse(localStorage.getItem('products_wish') || '[]');
    products.forEach((element) => {
      if (element != product) {
        productss.push(element);
      }
    });
    localStorage.setItem('products_wish', JSON.stringify(productss));
  }

  addProductCart(product: string) {
    const products = JSON.parse(localStorage.getItem('products_cart') || '[]');
    products.push(product);
    localStorage.setItem('products_cart', JSON.stringify(products));
  }

  constructor() {}

  ngOnInit(): void {}
}
