import { Page, createElement } from '../helpers/helpers';

const createErrorPage = () => {
    const block = createElement('div', 'error-page') as HTMLDivElement;
    const text = createElement('p', 'error-text') as HTMLParagraphElement;
    text.textContent = 'Error 404!!!';
    block.append(text);

    return block;
};

export class Error extends Page {
    constructor(id: string) {
        super(id);
        this.container = createErrorPage();
    }

    render() {
        return this.container;
    }
}
