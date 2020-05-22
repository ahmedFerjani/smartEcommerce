import { Component, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { from, Subscription } from 'rxjs';
import { Message } from '../../models/message';
import { makeStateKey } from '@angular/platform-browser';

const configKey = makeStateKey('CONFIG');

declare var webkitSpeechRecognition: any;
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('searchKey') hiddenSearchHandler;

  messages: Message[] = [];
  public inputext: string = '';
  private messagesSub: Subscription;
  constructor(private chatService: ChatbotService, private zone: NgZone) {}

  voiceInteract() {
    if ('webkitSpeechRecognition' in window) {
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();
      const voiceHandler = this.hiddenSearchHandler.nativeElement;

      vSearch.onresult = (e) => {
        console.log(e);
        voiceHandler.value = e.results[0][0].transcript;
        vSearch.stop();
        console.log(voiceHandler.value);
        this.zone.run(() => {
          this.sendToBot(voiceHandler.value);
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

  sendToBot(msg: string) {
    this.chatService.sendMsg(msg);
    this.inputext = '';
  }

  ngOnInit(): void {
    this.messagesSub = this.chatService
      .getMessagesUpdatedListener()
      .subscribe((messagesData: { messages: Message[] }) => {
        this.messages = messagesData.messages;
      });

    $(document).ready(function () {
      $('.chat_on').click(function () {
        $('.Layout').toggle();
        $('.chat_on').hide(300);
      });

      $('.chat_close_icon').click(function () {
        $('.Layout').hide();
        $('.chat_on').show(300);
      });
    });
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }
}
