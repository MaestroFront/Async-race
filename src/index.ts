import './sass/style.scss';
import { App } from './components/app/app';
import { state, getRequest, localFunc } from './components/helpers/helpers';
import { fillGarage, updateQuantityOfCars } from './components/garage/garage';
import { fillWinnersTable, getRequestWinner } from './components/winners/winners';

localFunc();

const app = new App();
app.run();

window.onload = async () => {
    if (localStorage.getItem('PAGE') === 'garage') {
        localStorage.setItem(
            'currentPage',
            `${(document.querySelector('.current-page') as HTMLSpanElement).textContent}`
        );
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
    }
    if (localStorage.getItem('PAGE') === 'winners') {
        localStorage.setItem('PAGE', 'winners');
        (document.querySelector('.btn-winners') as HTMLButtonElement).disabled = true;
        (document.querySelector('.btn-garage') as HTMLButtonElement).disabled = false;
        await getRequestWinner();
        setTimeout(() => {
            if (state.winners.length === 0) {
                (document.querySelector('.btn-next-win') as HTMLButtonElement).disabled = true;
            }
            if (state.winners.length === 1) {
                state.winners
                    .flat()
                    .forEach((winner: { id: number; wins: number; name: string; color: string; time: number }) => {
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
            (document.querySelector('.winners-quantity') as HTMLSpanElement).textContent = `(${
                state.winners.flat().length
            })`;
        }, 100);
    }
};
