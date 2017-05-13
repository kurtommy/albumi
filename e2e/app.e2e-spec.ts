import { AlbumiPage } from './app.po';

describe('albumi App', () => {
  let page: AlbumiPage;

  beforeEach(() => {
    page = new AlbumiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
