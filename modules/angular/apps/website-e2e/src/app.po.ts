import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.css('jina-draicana-root h1')).getText();
    }
}
