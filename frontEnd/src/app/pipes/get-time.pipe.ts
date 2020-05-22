import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getTime',
})
export class GetTimePipe implements PipeTransform {
  datetime: Date;
  transform(value: any): string {
    this.datetime = new Date(value);
    return (
      this.datetime.getHours() +
      ':' +
      this.datetime.getMinutes() +
      ':' +
      this.datetime.getSeconds()
    );
  }
}
