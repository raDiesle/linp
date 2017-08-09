import { browser, by, element } from 'protractor';

export class LinpPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.id('title')).getText();
  }
}
