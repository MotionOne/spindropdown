import { UitestPage } from './app.po';

describe('uitest App', () => {
  let page: UitestPage;

  beforeEach(() => {
    page = new UitestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
