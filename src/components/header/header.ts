import { fillGarage, updateQuantityOfCars } from '../garage/garage';
import { createElement, createButton, Component, state, getRequest } from '../helpers/helpers';
import { fillWinnersTable, getRequestWinner } from '../winners/winners';

export const createButtonsContainer = () => {
    const btnsContainer = createElement('div', 'btn-container') as HTMLDivElement;
    const btnToGarage = createButton('button', 'btn-garage', 'button') as HTMLButtonElement;
    btnToGarage.textContent = 'to garage';
    btnToGarage.id = 'garage';
    btnToGarage.onclick = async () => {
        localStorage.setItem('PAGE', 'garage');
        setTimeout(() => {
            if (localStorage.getItem('currentPage') === String(state.cars.length))
                (document.querySelector('.btn-next') as HTMLButtonElement).disabled = true;
        }, 100);
        btnToWinners.disabled = false;
        btnToGarage.disabled = true;
        state.cars = [];
        await getRequest();
        await getRequestWinner();
        fillGarage(state.cars);
        if (localStorage.getItem('currentPage') === String(state.cars.length))
            (document.querySelector('.btn-next') as HTMLButtonElement).disabled = true;
        updateQuantityOfCars();
        if (localStorage.getItem('createCarName')) {
            (document.querySelector('.create-input') as HTMLInputElement).value = localStorage.getItem(
                'createCarName'
            ) as string;
        }
        if (localStorage.getItem('createCarName')) {
            (document.querySelector('.update-input') as HTMLInputElement).value = localStorage.getItem(
                'updateCarName'
            ) as string;
        }
    };

    const btnToWinners = createButton('button', 'btn-winners', 'button') as HTMLButtonElement;
    btnToWinners.textContent = 'to winners';
    btnToWinners.id = 'winners';
    btnToWinners.onclick = () => {
        localStorage.setItem('PAGE', 'winners');
        btnToWinners.disabled = true;
        btnToGarage.disabled = false;
        setTimeout(() => {
            if (state.winners.length === 0) {
                (document.querySelector('.btn-next-win') as HTMLButtonElement).disabled = true;
            }
            if (state.winners.length === 1) {
                state.winners.flat().forEach((winner) => {
                    fillWinnersTable(winner.id, winner.wins, winner.name, winner.color, winner.time);
                    if (+(localStorage.getItem('currentWinPage') as string) === state.winners.length) {
                        (document.querySelector('.btn-next-win') as HTMLButtonElement).disabled = true;
                    }
                });
            } else if (state.winners.length > 1) {
                state.winners[+(localStorage.getItem('currentWinPage') as string) - 1].forEach((winner) => {
                    fillWinnersTable(winner.id, winner.wins, winner.name, winner.color, winner.time);
                    if (+(localStorage.getItem('currentWinPage') as string) === state.winners.length) {
                        (document.querySelector('.btn-next-win') as HTMLButtonElement).disabled = true;
                    }
                });
            }
        }, 100);
    };

    const garageLink = createElement('a', 'to-garage') as HTMLLinkElement;
    garageLink.href = `#${btnToGarage.id}`;

    const winnersLink = createElement('a', 'to-winners') as HTMLLinkElement;
    winnersLink.href = `#${btnToWinners.id}`;

    garageLink.append(btnToGarage);
    winnersLink.append(btnToWinners);
    btnsContainer.append(garageLink, winnersLink, createPopupWinner());

    return btnsContainer;
};

export const createPopupWinner = () => {
    const popup = createElement('div', 'popup-winner') as HTMLDivElement;
    return popup;
};

export class Header extends Component {
    constructor() {
        super();
        this.container = createButtonsContainer();
    }

    render() {
        return this.container;
    }
}
