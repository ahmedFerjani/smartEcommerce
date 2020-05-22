import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  form: FormGroup;
  cardnumber: string = '';
  cardtype: string = '';
  imgSrc: string;
  cardinfo: Subscription;
  showSpinner: boolean = false;
  constructor(
    public router: Router,
    public apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      image: new FormControl(),
    });

    this.cardinfo = this.apiService.getcardinfoListener().subscribe(
      (cardinfo: { cardnumber: string; cardtype: string }) => {
        this.showSpinner = false;
        this.cardnumber = cardinfo.cardnumber;
        this.cardtype = cardinfo.cardtype;
        if (
          typeof this.cardnumber == 'undefined' &&
          typeof this.cardtype == 'undefined'
        ) {
          this.openSnackBar(
            'Error: please verify the image, it should be of a credit card',
            'ok'
          );
        } else if (
          typeof this.cardnumber == 'undefined' ||
          typeof this.cardtype == 'undefined'
        ) {
          this.openSnackBar(
            'Error: please verify the credit card image, it should be clear',
            'ok'
          );
        }
      },
      (err) => {
        this.showSpinner = false;
        this.openSnackBar(
          'Error: please verify the image, it should be of a credit card',
          'ok'
        );
      }
    );
  }

  ngOnDestroy() {}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  imageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    //image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imgSrc = reader.result as string;
      console.log(this.imgSrc);
    };
    reader.readAsDataURL(file);

    const formdata = new FormData();
    formdata.append('image', this.form.value.image, 'card');
    this.showSpinner = true;
    this.apiService.creditcard(formdata);
  }
}
