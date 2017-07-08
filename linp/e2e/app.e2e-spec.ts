import { LinpPage } from './app.po';

describe('linp App', () => {
  let page: LinpPage;

  beforeEach(() => {
    page = new LinpPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
