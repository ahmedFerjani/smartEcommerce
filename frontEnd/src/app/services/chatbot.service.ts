import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message } from '../models/message';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  readonly baseURL: string = 'https://api.dialogflow.com/v1/query?v=20150910';
  //token1: string = '195a70973cbd48cfa8916fc64750b935'; // use your token from dialog flow
  readonly token: string = environment.dialogueflow.angularBot;
  private messages: Message[] = [];
  private messagesUpdated = new Subject<{ messages: Message[] }>();

  constructor(private http: HttpClient, private router: Router) {}

  getMessagesUpdatedListener() {
    return this.messagesUpdated.asObservable();
  }

  gotoproducts(text: string) {
    let category = '';
    let color = '';
    text
      .toLowerCase()
      .split(' ')
      .map((word) => {
        [
          'watches',
          'glasses',
          'jackets',
          'shoes',
          'skirts',
          'trousers',
          'watche',
          'glasse',
          'jacket',
          'skirt',
          'trouser',
        ].includes(word)
          ? (category = word)
          : null;
        [
          'white',
          'black',
          'blue',
          'yellow',
          'pink',
          'green',
          'grey',
          'red',
        ].includes(word)
          ? (color = word)
          : null;
      });
    this.router.navigate(['/shop'], {
      queryParams: { category: category, color: color },
    });
    console.log('Category : ' + category + ' Color : ' + color);
  }

  sendMsg(msg: string) {
    const data = {
      query: msg,
      lang: 'en',
      sessionId: '12345',
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    let options = { headers: headers };
    this.messages.push(new Message(msg, 'sent', new Date()));
    console.log(
      new Date().getHours() +
        ':' +
        new Date().getMinutes() +
        ' : ' +
        new Date().getSeconds()
    );
    this.messagesUpdated.next({ messages: [...this.messages] });
    return this.http.post(this.baseURL, data, options).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.messages.push(
          new Message(res.result.fulfillment.speech, 'replies', res.timestamp)
        );
        this.messagesUpdated.next({ messages: [...this.messages] });
        if (<number>res.result.fulfillment.speech.search('I get that') > -1) {
          this.gotoproducts(res.result.fulfillment.speech);
        } else if (
          res.result.fulfillment.speech ==
          "Done sir, you'll be redirected to the payment page"
        ) {
          this.router.navigate(['/checkout']);
        } else if (
          res.result.fulfillment.speech == "Done sir, you're cart cleared"
        ) {
          localStorage.removeItem('products_cart');
        }
      }
    });
  }
}
