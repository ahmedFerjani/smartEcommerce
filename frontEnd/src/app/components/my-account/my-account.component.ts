import {
  Component,
  OnInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
})
export class MyAccountComponent implements OnInit, AfterViewChecked {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 400 },
      height: { ideal: 300 },
    },
  };
  constraints2 = {
    video: false,
  };
  videoWidth = 0;
  videoHeight = 0;

  loginForm: FormGroup;
  registerForm: FormGroup;
  showSpinner = false;
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(this.attachVideo.bind(this))
        .catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  attachVideo(stream) {
    this.renderer.setProperty(
      this.videoElement.nativeElement,
      'srcObject',
      stream
    );
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  capture() {
    this.renderer.setProperty(
      this.canvas.nativeElement,
      'width',
      this.videoWidth
    );
    this.renderer.setProperty(
      this.canvas.nativeElement,
      'height',
      this.videoHeight
    );
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.videoElement.nativeElement, 0, 0);

    this.saveCanvasAs(document.getElementById('canvas'), 'export.png');
  }

  saveCanvasAs(canvas, fileName) {
    // get image data and transform mime type to application/octet-stream
    var canvasDataUrl = canvas
        .toDataURL()
        .replace(/^data:image\/[^;]*/, 'data:application/octet-stream'),
      link = document.createElement('a'); // create an anchor tag

    // set parameters for downloading
    link.setAttribute('href', canvasDataUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', fileName);

    // compat mode for dispatching click on your anchor
    if (document.createEvent) {
      var evtObj = document.createEvent('MouseEvents');
      evtObj.initEvent('click', true, true);
      link.dispatchEvent(evtObj);
    } else if (link.click) {
      link.click();
    }
  }

  ngAfterViewChecked() {}

  onSubmitRegister() {
    const registerData = new FormData();
    registerData.append('firstname', this.registerForm.value.firstname);
    registerData.append('lastname', this.registerForm.value.lastname);
    registerData.append('email', this.registerForm.value.email);
    registerData.append('password', this.registerForm.value.password);
    this.apiService.createUser(registerData).subscribe((res) => {
      this.openSnackBar('Account successfully created, try to login', 'ok');
    });
    //this.openSnackBar('User Created succeffuly')
    //this.router.navigate(['']);
  }

  getEmail() {
    return localStorage.getItem('email');
  }

  logout() {
    //localStorage.removeItem('email');
    localStorage.clear();
  }

  onSaveFormLogin() {
    console.log(this.loginForm.value);
    const loginData = new FormData();
    loginData.append('email', this.loginForm.value.email);
    loginData.append('password', this.loginForm.value.password);
    this.apiService.login(loginData).subscribe(
      (res) => {
        localStorage.setItem('email', <any>loginData.getAll('email'));
        this.showSpinner = false;
      },
      (err) => {
        this.openSnackBar('Error: wrong credentials', 'ok');
        this.showSpinner = false;
      }
    );
  }

  imageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const facedata = new FormData();
    facedata.append('email', this.getEmail());
    facedata.append('image', file, file.name);
    this.apiService.addAccountImage(facedata).subscribe((res) => {
      this.openSnackBar('Image added to the user profile', 'ok');
    });
  }

  imageFaceSelected(event: Event) {
    this.showSpinner = true;
    const file = (event.target as HTMLInputElement).files[0];
    const faceData = new FormData();
    faceData.append('image', file, 'face');
    this.apiService.recognize(faceData).subscribe(
      (res) => {
        console.log(res);
        const credetialsForm = new FormData();
        credetialsForm.append('email', res.user.email);
        credetialsForm.append('password', res.user.password);
        this.apiService.login(credetialsForm);
        this.openSnackBar('Successfully logged in', 'ok');
        localStorage.setItem('email', <any>credetialsForm.getAll('email'));
        this.showSpinner = false;
      },
      (err) => {
        this.openSnackBar('Error: Failed to login, please try again', 'ok');
        this.showSpinner = false;
      }
    );
  }

  ngOnInit(): void {
    $(document)
      .find('#b-register_but')
      .on('click', function () {
        $('.b-auth_text_register').fadeOut('');
        $('.b-auth_login').fadeOut('');
        $('.b-auth_register').fadeOut();
        $('.b-auth_text_login').fadeOut();
        $('.b-auth_register').fadeIn('slow');
        $('.b-auth_text_login').fadeIn('slow');
      });

    $(document)
      .find('#b-login_but')
      .on('click', function () {
        $('.b-auth_register').fadeOut('');
        $('.b-auth_text_login').fadeOut('');
        $('.b-auth_text_register').fadeOut();
        $('.b-auth_login').fadeOut();
        $('.b-auth_text_register').fadeIn('slow');
        $('.b-auth_login').fadeIn('slow');
      });

    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });

    this.registerForm = new FormGroup({
      firstname: new FormControl(),
      lastname: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
    });
  }
}
