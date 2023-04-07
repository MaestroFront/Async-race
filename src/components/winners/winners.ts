import { Page, createElement, createInput, state, createButton, chunkWinners } from '../helpers/helpers';
import { createSvgCar } from '../garage/garage';

const createWinnersPage = () => {
    const winnersPage = createElement('div', 'winners-page') as HTMLDivElement;
    const winnersTitle = createElement('p', 'winners-text') as HTMLParagraphElement;
    winnersTitle.textContent = 'Winners ';

    const winnersQuantity = createElement('span', 'winners-quantity') as HTMLSpanElement;
    winnersQuantity.textContent = `(${state.winners.flat().length})`;

    const page = createElement('p', 'current-win-page-text') as HTMLParagraphElement;
    page.textContent = 'Page ';
    const currentPage = createElement('span', 'current-win-page') as HTMLSpanElement;
    currentPage.textContent = `${localStorage.getItem('currentWinPage')}`;

    page.append(currentPage);
    winnersTitle.append(winnersQuantity);
    winnersPage.append(winnersTitle, page, createWinnersTable(), createBtnsContainer());

    return winnersPage;
};

const createWinnersTable = () => {
    const winnersTable = createElement('ul', 'winners-table') as HTMLUListElement;

    winnersTable.append(createTitle());

    return winnersTable;
};

const createTitle = () => {
    const car = createElement('li', 'winners-title') as HTMLLIElement;

    const arrow = createElement('img', 'arrow') as HTMLImageElement;
    arrow.src = '../../assets/icons/arrow.svg';

    const inputNumber = createInput('input', 'winners-number', 'text');
    inputNumber.value = 'Number';
    inputNumber.readOnly = true;

    const inputCar = createInput('input', 'winners-car', 'text');
    inputCar.value = 'Car';
    inputCar.readOnly = true;

    const inputName = createInput('input', 'winners-name', 'text');
    inputName.value = 'Name';
    inputName.readOnly = true;

    const inputWins = createInput('input', 'winners-wins', 'text');
    inputWins.value = 'Wins';
    inputWins.readOnly = true;
    inputWins.onclick = () => {
        sortWinners(arrow, 'sortWins', 'sortTime', '.winners-wins', sortWinnersForWins);
    };

    const inputBestTime = createInput('input', 'winners-best-time', 'text');
    inputBestTime.value = 'Best Time(s)';
    inputBestTime.readOnly = true;
    inputBestTime.onclick = () => {
        sortWinners(arrow, 'sortTime', 'sortWins', '.winners-best-time', sortWinnersForTime);
    };

    car.append(inputNumber, inputCar, inputName, inputWins, inputBestTime);

    return car;
};

export const sortWinners = (
    arrow: HTMLImageElement,
    parameter: string,
    otherParameter: string,
    className: string,
    func: () => void
) => {
    localStorage.setItem(otherParameter, 'default');
    if (localStorage.getItem(parameter) === 'default') {
        func();
        localStorage.setItem(parameter, 'increase');
        document.querySelector('.arrow')?.remove();
    } else if (localStorage.getItem(parameter) === 'increase') {
        func();
        localStorage.setItem(parameter, 'decrease');
        arrow.style.transform = 'rotate(180deg)';
        document.querySelector(className)?.after(arrow);
    } else if (localStorage.getItem(parameter) === 'decrease') {
        func();
        localStorage.setItem(parameter, 'default');
        arrow.style.transform = 'rotate(0deg)';
        document.querySelector(className)?.after(arrow);
    }
};

export const sortWinnersForWins = () => {
    const sort = localStorage.getItem('sortWins') as string;
    if (sort === 'increase') {
        state.winners = chunkWinners(
            state.winners.flat().sort((prev, curr) => curr.wins - prev.wins),
            10
        );
    }
    if (sort === 'default') {
        state.winners = chunkWinners(state.winners.flat(), 10);
    }
    if (sort === 'decrease') {
        state.winners = chunkWinners(
            state.winners.flat().sort((prev, curr) => prev.wins - curr.wins),
            10
        );
    }
    state.winners[+(localStorage.getItem('currentWinPage') as string) - 1].forEach((winner) => {
        (document.querySelector('.winners-table') as HTMLUListElement).innerHTML = '';
        (document.querySelector('.winners-table') as HTMLUListElement).append(createTitle());
        setTimeout(() => {
            fillWinnersTable(winner.id, winner.wins, winner.name, winner.color, winner.time);
        }, 100);
    });
};

export const sortWinnersForTime = () => {
    const sort = localStorage.getItem('sortTime') as string;
    if (sort === 'increase') {
        state.winners = chunkWinners(
            state.winners.flat().sort((prev, curr) => curr.time - prev.time),
            10
        );
    } else if (sort === 'decrease') {
        state.winners = chunkWinners(
            state.winners.flat().sort((prev, curr) => prev.time - curr.time),
            10
        );
    }
    state.winners[+(localStorage.getItem('currentWinPage') as string) - 1].forEach((winner) => {
        (document.querySelector('.winners-table') as HTMLUListElement).innerHTML = '';
        (document.querySelector('.winners-table') as HTMLUListElement).append(createTitle());
        setTimeout(() => {
            fillWinnersTable(winner.id, winner.wins, winner.name, winner.color, winner.time);
        }, 100);
    });
};

export const createWinner = (id: number, name: string, wins: number, color: string, time: number) => {
    const car = createElement('li', 'car-winner') as HTMLLIElement;

    const number = createElement('span', 'car-winner-number') as HTMLSpanElement;
    state.winners.flat().forEach((item, index) => {
        if (item.id === id) {
            number.textContent = `${index + 1}`;
        }
    });

    const carImage = createSvgCar(id);
    carImage.style.width = '50px';
    carImage.setAttributeNS(null, 'fill', color);

    const nameCar = createElement('span', 'car-winner-name') as HTMLSpanElement;
    nameCar.textContent = name;

    const winsEl = createElement('span', 'car-winner-wins') as HTMLSpanElement;
    if (localStorage.getItem(`Winners_${id}`)) {
        winsEl.textContent = localStorage.getItem(`Winners_${id}`);
    } else {
        winsEl.textContent = `${wins}`;
    }

    const bestTime = createElement('span', 'car-winner-best-time') as HTMLSpanElement;
    bestTime.textContent = `${time}`;

    car.append(number, carImage, nameCar, winsEl, bestTime);

    return car;
};

const createBtnsContainer = () => {
    const container = createElement('div', 'winners-btns-container') as HTMLDivElement;
    const btnPrev = createButton('button', 'btn-prev-win', 'button') as HTMLButtonElement;
    btnPrev.textContent = 'prev';
    btnPrev.onclick = () => {
        localStorage.setItem('currentWinPage', String(+(localStorage.getItem('currentWinPage') as string) - 1));
        (document.querySelector('.current-win-page') as HTMLSpanElement).textContent = localStorage.getItem(
            'currentWinPage'
        ) as string;
        state.winners[+(localStorage.getItem('currentWinPage') as string) - 1].forEach((winner) => {
            (document.querySelector('.winners-table') as HTMLUListElement).innerHTML = '';
            (document.querySelector('.winners-table') as HTMLUListElement).append(createTitle());
            setTimeout(() => {
                fillWinnersTable(winner.id, winner.wins, winner.name, winner.color, winner.time);
            }, 100);
        });
        btnNext.disabled = false;
        if (localStorage.getItem('currentWinPage') === '1') btnPrev.disabled = true;
    };

    const btnNext = createButton('button', 'btn-next-win', 'button') as HTMLButtonElement;
    btnNext.textContent = 'next';
    btnNext.onclick = () => {
        localStorage.setItem('currentWinPage', String(+(localStorage.getItem('currentWinPage') as string) + 1));
        (document.querySelector('.current-win-page') as HTMLSpanElement).textContent = localStorage.getItem(
            'currentWinPage'
        ) as string;
        state.winners[+(localStorage.getItem('currentWinPage') as string) - 1].forEach((winner) => {
            (document.querySelector('.winners-table') as HTMLUListElement).innerHTML = '';
            (document.querySelector('.winners-table') as HTMLUListElement).append(createTitle());
            setTimeout(() => {
                fillWinnersTable(winner.id, winner.wins, winner.name, winner.color, winner.time);
            }, 100);
        });
        btnPrev.disabled = false;
        if (localStorage.getItem('currentWinPage') === String(state.winners.length)) btnNext.disabled = true;
    };
    if (localStorage.getItem('currentWinPage') === '1') btnPrev.disabled = true;

    container.append(btnPrev, btnNext);
    return container;
};

export const getRequestWinner = async () => {
    return fetch('http://127.0.0.1:3000/winners', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            state.winners = chunkWinners(data, 10);
        });
};

export const postRequestWinner = async () => {
    const newId = state.newWinner.id as number;
    if (
        !state.winners
            .flat()
            .map((winner) => winner.id)
            .includes(newId)
    ) {
        return fetch('http://127.0.0.1:3000/winners', {
            method: 'POST',
            body: JSON.stringify(state.newWinner),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((res) => {
            if (res.status === 500) {
                state.winners.flat().forEach((item) => {
                    if (item.id === state.newWinner.id) {
                        const winner = state.newWinner.time as number;
                        if (item.time > winner) {
                            putRequestWinner(item.id);
                        }
                    }
                });
            }
            return res.json();
        });
    } else {
        putRequestWinner(state.newWinner.id);
    }
};

export const putRequestWinner = async (id: number | undefined) => {
    return fetch(`http://127.0.0.1:3000/winners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(state.newWinner),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => data);
};

export const deleteRequestWinner = (id: number) => {
    if (
        state.winners
            .flat()
            .map((winner) => winner.id)
            .includes(id)
    ) {
        return fetch(`http://127.0.0.1:3000/winners/${id}`, {
            method: 'DELETE',
        });
    }
};

export const fillWinnersTable = async (id: number, wins: number, name: string, color: string, time: number) => {
    await getRequestWinner();
    const winnersList = document.querySelector('.winners-table') as HTMLUListElement;
    winnersList.append(createWinner(id, name, wins, color, time));
};

export class Winners extends Page {
    constructor(id: string) {
        super(id);
        this.container = createWinnersPage();
    }

    render() {
        return this.container;
    }
}
