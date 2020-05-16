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
    this.messagesUpdated.next({ messages: [...this.messages] });
    return this.http.post(this.baseURL, data, options).subscribe((res: any) => {
      if (res) {
        this.messages.push(
          new Message(res.result.fulfillment.speech, 'replies', res.timestamp)
        );
        console.log('messages' + this.messages);
        this.messagesUpdated.next({ messages: [...this.messages] });
        if (<string>res.result.fulfillment.speech.search("we get that")) {
          this.gotoproducts(res.result.fulfillment.speech) ;
        }
      }
      //console.log(this.messages) ;
    });
  }
}
