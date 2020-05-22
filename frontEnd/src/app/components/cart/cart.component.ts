import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  getCardProducts() {
    return new Set(JSON.parse(localStorage.getItem('products_cart') || '[]'));
  }


  removeProductFromCart(product: string) {
    let productss = [];
    const products = JSON.parse(localStorage.getItem('products_cart') || '[]');
    products.forEach((element) => {
      if (element != product) {
        productss.push(element);
      }
    });
    localStorage.setItem('products_cart', JSON.stringify(productss));
  }


  getQuantity(product_cart:string) {
    const products = JSON.parse(localStorage.getItem('products_cart') || '[]');
    return products.filter(x => x === product_cart).length
  }
  constructor() { }

  ngOnInit(): void {

  }

}
