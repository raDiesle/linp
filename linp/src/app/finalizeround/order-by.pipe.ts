import {Pipe, PipeTransform} from '@angular/core';

// http://www.advancesharp.com/blog/1211/angular-2-search-and-sort-with-ngfor-repeater-with-example
@Pipe({name: 'orderBy'})
export class OrderByPipe implements PipeTransform {

  transform(records: Array<any>, args?: any): any {
    return records.sort(function (a, b) {
      if (a[args.property] < b[args.property]) {
        return -1 * args.direction;
      } else if (a[args.property] > b[args.property]) {
        return 1 * args.direction;
      } else {
        return 0;
      }
    });
  };
}
