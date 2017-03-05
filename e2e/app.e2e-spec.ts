import { MeanFlipCardPage } from './app.po';

describe('mean-flip-card App', () => {
  let page: MeanFlipCardPage;

  beforeEach(() => {
    page = new MeanFlipCardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
