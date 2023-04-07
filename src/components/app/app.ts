import { Header } from '../header/header';
import { Page, PageIds } from '../helpers/helpers';
import { Garage } from '../garage/garage';
import { Winners } from '../winners/winners';
import { Error } from '../error/error';

const mainSection = document.querySelector('.main') as HTMLDivElement;
const headerSection = document.querySelector('.header') as HTMLHeadElement;

export class App {
    private static container: HTMLElement = mainSection;
    private initialPage: Garage;
    private header: Header;

    static renderNewPage(idPage: string) {
        App.container.innerHTML = '';
        let page: Page | null = null;

        if (idPage === PageIds.Garage) {
            page = new Garage(idPage);
        } else if (idPage === PageIds.Winners) {
            page = new Winners(idPage);
        } else {
            page = new Error(idPage);
        }

        if (page) {
            const pageHtml = page.render();
            App.container.append(pageHtml);
        }
    }

    private enableRouteChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.renderNewPage(hash);
        });
    }

    constructor() {
        this.initialPage = new Garage('garage');
        this.header = new Header();
    }

    run() {
        App.renderNewPage(localStorage.getItem('PAGE') as string);
        headerSection.append(this.header.render());
        this.enableRouteChange();
    }
}
