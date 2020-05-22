import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as $ from 'jquery';
import { makeStateKey } from '@angular/platform-browser';

const configKey = makeStateKey('CONFIG');

declare var webkitSpeechRecognition: any;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  @ViewChild('searchKeyy') hiddenSearchHandler;
  contactForm: FormGroup;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {}

  voiceInteract() {
    if ('webkitSpeechRecognition' in window) {
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();
      const voiceHandler = this.hiddenSearchHandler.nativeElement;

      vSearch.onresult = (e) => {
        voiceHandler.value = e.results[0][0].transcript;
        vSearch.stop();
        console.log(voiceHandler.value);
        this.zone.run(() => {
          console.log(voiceHandler.value);
          this.contactForm.setValue({
            content:
              (this.contactForm.value.content
                ? typeof this.contactForm.value.content !== null
                : '') +
              '\n' +
              voiceHandler.value,
            subject: this.contactForm.value.subject,
          });
        });
        //this.chatbot.converse(voiceHandler.value);
      };
      vSearch.onerror = (e) => {
        console.log(e);
        vSearch.stop();
      };
    } else {
      //console.log(this.state.get(configKey, undefined as any));
    }
  }

  ngOnInit(): void {

    this.contactForm = new FormGroup({
      subject: new FormControl(),
      content: new FormControl(),
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  onSaveFormContact() {
    console.log(this.contactForm.value);
    const contactData = new FormData();
    contactData.append('subject', this.contactForm.value.subject);
    contactData.append('content', this.contactForm.value.content);
    this.http
      .post<{ message: string }>(
        'http://localhost:8000/sendemail/',
        contactData
      )
      .subscribe(
        (res) => {
          this.openSnackBar(res.message, 'ok');
        },
        (err) => {
          this.openSnackBar(err, 'ok');
        }
      );
  }
}
