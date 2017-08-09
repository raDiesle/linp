import {LinpPage} from './app.po';
import {browser, by, element} from "protractor";

describe('linp App', () => {
  let page: LinpPage;

  beforeEach(() => {
    page = new LinpPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('LINP');
  });

  it('should login user', () => {
    page.navigateTo();
    element(by.css('.btn-secondary')).click();
    element(by.id('playername')).clear();
    element(by.id('playername')).sendKeys('PlayerA');
    element(by.id('savePlayerName')).click();
  //  browser.explore();
    element(by.css('#welcomePage')).click();
    expect(element(by.css('#createGameButton')).getText()).toEqual('Create');

  });
});
