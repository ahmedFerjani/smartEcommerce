import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products = [
    {
      category: 'watches',
      color: 'black',
      unit_price: 45.99,
      image: '4694.jpg',
    },
    {
      category: 'watches',
      color: 'white',
      unit_price: 45.99,
      image: '10141.jpg',
    },
    {
      category: 'watches',
      color: 'black',
      unit_price: 45.99,
      image: '4703.jpg',
    },
    {
      category: 'watches',
      color: 'white',
      unit_price: 45.99,
      image: '5080.jpg',
    },
    {
      category: 'watches',
      color: 'white',
      unit_price: 45.99,
      image: '8115.jpg',
    },
    {
      category: 'watches',
      color: 'red',
      unit_price: 45.99,
      image: '8144.jpg',
    },
    {
      category: 'watches',
      color: 'white',
      unit_price: 45.99,
      image: '10098.jpg',
    },
    {
      category: 'watches',
      color: 'black',
      unit_price: 45.99,
      image: '10581.jpg',
    },
    {
      category: 'glasses',
      color: 'black',
      unit_price: 45.99,
      image: '33.jpg',
    },
    {
      category: 'glasses',
      color: 'black',
      unit_price: 45.99,
      image: '97.jpg',
    },
    {
      category: 'glasses',
      color: 'green',
      unit_price: 45.99,
      image: '104.jpg',
    },
    {
      category: 'glasses',
      color: 'blue',
      unit_price: 45.99,
      image: '113.jpg',
    },
    {
      category: 'glasses',
      color: 'blue',
      unit_price: 45.99,
      image: '127.jpg',
    },
    {
      category: 'glasses',
      color: 'orange',
      unit_price: 45.99,
      image: '333.jpg',
    },
    {
      category: 'glasses',
      color: 'black',
      unit_price: 45.99,
      image: '263.jpg',
    },
    {
      category: 'glasses',
      color: 'white',
      unit_price: 45.99,
      image: '346.jpg',
    },
    {
      category: 'jackets',
      color: 'brown',
      unit_price: 45.99,
      image: '331.jpg',
    },
    {
      category: 'jackets',
      color: 'grey',
      unit_price: 45.99,
      image: '231.jpg',
    },
    {
      category: 'jackets',
      color: 'brown',
      unit_price: 45.99,
      image: '128.jpg',
    },
    {
      category: 'jackets',
      color: 'green',
      unit_price: 45.99,
      image: '133.jpg',
    },
    {
      category: 'jackets',
      color: 'green',
      unit_price: 45.99,
      image: '134.jpg',
    },
    {
      category: 'jackets',
      color: 'pink',
      unit_price: 45.99,
      image: '72.jpg',
    },
    {
      category: 'jackets',
      color: 'black',
      unit_price: 45.99,
      image: '181.jpg',
    },
    {
      category: 'jackets',
      color: 'black',
      unit_price: 45.99,
      image: '209.jpg',
    },
    {
      category: 'shoes',
      color: 'red',
      unit_price: 45.99,
      image: '23.jpg',
    },
    {
      category: 'shoes',
      color: 'white',
      unit_price: 45.99,
      image: '31.jpg',
    },
    {
      category: 'shoes',
      color: 'blue',
      unit_price: 45.99,
      image: '96.jpg',
    },
    {
      category: 'shoes',
      color: 'pink',
      unit_price: 45.99,
      image: '105.jpg',
    },
    {
      category: 'shoes',
      color: 'blue',
      unit_price: 45.99,
      image: '238.jpg',
    },
    {
      category: 'shoes',
      color: 'black',
      unit_price: 45.99,
      image: '304.jpg',
    },
    {
      category: 'shoes',
      color: 'black',
      unit_price: 45.99,
      image: '433.jpg',
    },
    {
      category: 'shoes',
      color: 'white',
      unit_price: 45.99,
      image: '473.jpg',
    },
    {
      category: 'skirts',
      color: 'white',
      unit_price: 45.99,
      image: '449.jpg',
    },

    {
      category: 'skirts',
      color: 'red',
      unit_price: 45.99,
      image: '222.jpg',
    },

    {
      category: 'skirts',
      color: 'white',
      unit_price: 45.99,
      image: '85.jpg',
    },
    {
      category: 'skirts',
      color: 'blue',
      unit_price: 45.99,
      image: '270.jpg',
    },

    {
      category: 'skirts',
      color: 'grey',
      unit_price: 45.99,
      image: '61.jpg',
    },

    {
      category: 'skirts',
      color: 'yellow',
      unit_price: 45.99,
      image: '216.jpg',
    },

    {
      category: 'trousers',
      color: 'blue',
      unit_price: 45.99,
      image: '103.jpg',
    },

    {
      category: 'trousers',
      color: 'black',
      unit_price: 45.99,
      image: '303.jpg',
    },
    {
      category: 'trousers',
      color: 'grey',
      unit_price: 45.99,
      image: '307.jpg',
    },
    {
      category: 'trousers',
      color: 'black',
      unit_price: 45.99,
      image: '310.jpg',
    },
    {
      category: 'trousers',
      color: 'black',
      unit_price: 45.99,
      image: '335.jpg',
    },
    {
      category: 'trousers',
      color: 'grey',
      unit_price: 45.99,
      image: '327.jpg',
    },
    {
      category: 'trousers',
      color: 'blue',
      unit_price: 45.99,
      image: '419.jpg',
    },
    {
      category: 'trousers',
      color: 'black',
      unit_price: 45.99,
      image: '447.jpg',
    },
  ];

  getProductsByCC(category: string, color: string) {
    let resultProducts = [];
    this.products.map((product) => {
      product.category === category &&
      (product.color === color || color == 'all')
        ? resultProducts.push(product)
        : null;
    });
    return resultProducts;
  }

  

  getProductsByCategory(category: string) {
    let resultProducts = [];
    this.products.map((product) => {
      product.category === category || category == 'all'
        ? resultProducts.push(product)
        : null;
    });
    return resultProducts;
  }

  constructor() {}
}
