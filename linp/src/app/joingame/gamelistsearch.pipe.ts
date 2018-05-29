import {Injectable, Pipe, PipeTransform} from '@angular/core';

// https://hassantariqblog.wordpress.com/2017/03/16/angular2-creating-custom-search-filter-pipe-for-ngfor-directive/
// https://stackoverflow.com/questions/37067138/angular2-check-if-pipe-returns-an-empty-subset-of-original-list

@Pipe({
  name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    const filteredItems = items.filter(it => it[field].toLowerCase().startsWith(value.toLowerCase()));
    const noResultsFlag = [-1];
    return (filteredItems.length === 0) ? noResultsFlag : filteredItems;
  }
}
