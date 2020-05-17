import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { makeStateKey } from '@angular/platform-browser';

const configKey = makeStateKey('CONFIG');

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @ViewChild('searchKey') hiddenSearchHandler;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private zone: NgZone,
  ) {}

  searchByText(text: string) {
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

  ngOnInit(): void {}

  imageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const formdata = new FormData();
    formdata.append('image', file);
    this.apiService.searchProduct(formdata, file.name);
    this.router.navigate(['shop'], { queryParams: { category: 'search' } });
  }

  public voiceSearch() {
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
          this.searchByText(voiceHandler.value);
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
}
