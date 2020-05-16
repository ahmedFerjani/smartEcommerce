import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;
  cardnumber : string ="" ;
  imgSrc: string;
  cardinfo: Subscription;
  showSpinner: boolean = false ;
  constructor(public router: Router, public apiService: ApiService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      image: new FormControl(),
    });

    this.cardinfo = this.apiService.getcardinfoListener().subscribe(
      (cardinfo:{cardnumber: string}) => {
        if (cardinfo.cardnumber)
       {
        this.showSpinner = false;
        this.cardnumber= cardinfo.cardnumber ;}
        console.log(cardinfo.cardnumber)
      }
    )
  }

  imageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    //image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imgSrc = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(this.form.value.image);
    const formdata = new FormData();
    formdata.append('image', this.form.value.image, 'card');
    console.log(formdata.getAll('image'));
    this.showSpinner= true;
    this.apiService.creditcard(formdata) ;

  }
}
