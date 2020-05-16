import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ProductsService } from 'src/app/services/products.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-result',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  searchproductsSub: Subscription;
  searchproducts: string[];
  products = [];
  productss = [];
  category = '';
  selectedimageSub: Subscription;
  selectedimage: string = 'noimage.jpg';
  showSpinner: boolean = false;

  constructor(
    public router: Router,
    public apiService: ApiService,
    private productsService : ProductsService,
    private routerActivated: ActivatedRoute,
    private snackBar: MatSnackBar

  ) {}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  addCart(product: string) {
    const products = JSON.parse(localStorage.getItem('products_cart') || '[]');
    products.push(product);
    localStorage.setItem('products_cart', JSON.stringify(products));
    this.openSnackBar('Products added to the cart','ok'); 
  }

  addWishlist(product: string) {
    const products = JSON.parse(localStorage.getItem('products_wish') || '[]');
    if (products.indexOf(product) < 0) {
      products.push(product);
      localStorage.setItem('products_wish', JSON.stringify(products));
    }
    this.openSnackBar('Product added to the wishlist','ok') ;
  }
  setselectedimage() {
    this.selectedimageSub = this.apiService
      .getselectedimageListener()
      .subscribe((data: { selectedimage: string }) => {
        this.selectedimage = data.selectedimage;
      });
  }

  setSearchproducts() {
    this.searchproductsSub = this.apiService
      .getsearchproductsListener()
      .subscribe((searchproducts: { products: string[] }) => {
        if (searchproducts.products) {
          this.showSpinner = false;
          searchproducts.products.map( (product) => {
            this.productss.push({
              category:'',
              color:'',
              unit_price:'',
              image: product
            })
          })
          this.searchproducts=this.productss;
        }
        this.products=this.searchproducts ;
      });
  }

  ngOnInit(): void {
    this.setselectedimage();
    this.routerActivated.queryParams.subscribe((params) => {
      this.category = params.category;

      if (params.category !== '' && params.category !== 'search') {
        if(typeof params.color!='undefined'){
          this.products = this.productsService.getProductsByCC(params.category,params.color)
        }
        else
        {
          this.products = this.productsService.getProductsByCategory(params.category)
        }
      } else if (params.category === 'search') {
        this.setselectedimage();
        this.setSearchproducts();
      } else {
        this.products = [];
      }
    });
  }
}
