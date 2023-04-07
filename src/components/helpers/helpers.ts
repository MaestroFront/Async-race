export const createElement = (tagName: string, className: string) => {
    const element = document.createElement(tagName);
    element.classList.add(className);

    return element;
};

const wrapper = createElement('div', 'wrapper') as HTMLDivElement;
const header = createElement('div', 'header') as HTMLDivElement;
const main = createElement('div', 'main') as HTMLDivElement;
const footer = createElement('div', 'footer') as HTMLDivElement;
wrapper.append(header, main, footer);
document.querySelector('.body')?.append(wrapper);

interface IState {
    cars: { name: string; color: string; id: number }[][];
    newCar: {
        name: string;
        color: string;
        id?: number;
    };
    editCar: {
        name: string;
        color: string;
        id?: number;
    };
    startCars: number[];
    newWinner: {
        id?: number;
        wins?: number;
        time?: number;
        name?: string;
        color?: string;
    };
    winners: {
        id: number;
        wins: number;
        time: number;
        name: string;
        color: string;
    }[][];
}

export const state: IState = {
    cars: [],
    newCar: {
        name: '',
        color: '',
    },
    editCar: {
        name: '',
        color: '',
    },
    startCars: [],
    newWinner: {},
    winners: [],
};

export const localFunc = () => {
    if (!localStorage.getItem('currentPage')) {
        localStorage.setItem('currentPage', '1');
    }

    if (!localStorage.getItem('currentWinPage')) {
        localStorage.setItem('currentWinPage', '1');
    }

    if (!localStorage.getItem('sortWins')) {
        localStorage.setItem('sortWins', 'default');
    }

    if (!localStorage.getItem('sortTime')) {
        localStorage.setItem('sortTime', 'default');
    }

    if (!localStorage.getItem('PAGE')) {
        localStorage.setItem('PAGE', 'garage');
    }
};

export const createInput = (tagName: string, className: string, inputType: string) => {
    const element = createElement(tagName, className) as HTMLInputElement;
    element.classList.add('input');
    element.type = inputType;

    return element;
};

export const createButton = (tagName: string, className: string, buttonType: string) => {
    const element = createElement(tagName, className) as HTMLButtonElement;
    element.classList.add('button');
    element.type = buttonType;

    return element;
};

export abstract class Component {
    protected container: HTMLDivElement;

    constructor() {
        this.container = header;
    }

    render() {
        return this.container;
    }
}

export abstract class Page {
    protected container: HTMLDivElement;

    constructor(id: string) {
        this.container = main;
        this.container.id = id;
    }

    render() {
        return this.container;
    }
}

export const enum PageIds {
    Garage = 'garage',
    Winners = 'winners',
}

export const getRequest = async () => {
    return fetch('http://127.0.0.1:3000/garage', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => res.json())
        .then((cars) => (state.cars = chunkCars(state.cars.flat().concat(cars), 7)));
};

export const postRequest = async () => {
    const currentPage = localStorage.getItem('currentPage') as string;
    return fetch('http://127.0.0.1:3000/garage', {
        method: 'POST',
        body: JSON.stringify(state.newCar),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => res.json())
        .then((cars) => {
            if (state.cars[+currentPage - 1].length < 7) {
                state.cars[+currentPage - 1].push(cars);
            } else if (state.cars[+currentPage]) {
                state.cars[+currentPage + 1].push(cars);
            } else {
                state.cars.push([]);
                state.cars[+currentPage].push(cars);
            }
        });
};

export const postRequestGenerate = () => {
    const cars = generateCars();
    return fetch('http://127.0.0.1:3000/garage', {
        method: 'POST',
        body: JSON.stringify(cars),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then((res) => res.json());
};

export const putRequest = () => {
    return fetch(`http://127.0.0.1:3000/garage/${state.editCar.id}`, {
        method: 'PUT',
        body: JSON.stringify(state.editCar),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => res.json())
        .then((data) => data);
};

export const deleteRequest = (id: number) => {
    return fetch(`http://127.0.0.1:3000/garage/${id}`, {
        method: 'DELETE',
    });
};

export const clearData = () => {
    state.newCar.name = '';
    state.newCar.color = '';
    state.newWinner.id = 0;
    state.newWinner.wins = 0;
    state.newWinner.time = 0;

    (document.querySelector('.create-input') as HTMLInputElement).value = '';
    (document.querySelector('.create-color') as HTMLInputElement).value = generateColor();
    (document.querySelector('.update-input') as HTMLInputElement).value = '';
    (document.querySelector('.update-color') as HTMLInputElement).value = generateColor();
};

export const fillData = () => {
    (document.querySelector('.update-input') as HTMLInputElement).value = state.editCar.name;
    (document.querySelector('.update-color') as HTMLInputElement).value = state.editCar.color;
};

export const generateColor = () => {
    const color = Math.round(100000 + Math.random() * 900000);
    return `#${color}`;
};

export async function generateCars() {
    const url = 'https://cars-base.ru/api/cars';
    const res = await fetch(url);
    const data = await res.json();
    const cars = [];

    const url2 = 'https://api.sampleapis.com/simpsons/characters';
    const res2 = await fetch(url2);
    const data2 = await res2.json();

    for (let i = 0; i < 100; i++) {
        const index = Math.round(Math.random() * 309);
        cars.push({
            name: `${data[index].id} ${data2[index].name.split(' ')[0]}`,
            color: generateColor(),
        });
    }
    cars.forEach(async (car) => {
        return fetch('http://127.0.0.1:3000/garage', {
            method: 'POST',
            body: JSON.stringify(car),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => res.json())
            .then((cars) => {
                state.cars = chunkCars(state.cars.flat().concat(cars), 7);
            });
    });
}

export const patchRequestStartEngine = async (id: number, status: string) => {
    return fetch(`http://127.0.0.1:3000/engine?id=${id}&status=${status}`, {
        method: 'PATCH',
        body: JSON.stringify(state.cars),
    })
        .then((res) => res.json())
        .then((data: { distance: number; velocity: number }) => {
            state.startCars.push(+(data.distance / 1000 / 2 / data.velocity).toFixed(2));
        });
};

export const startAllEngine = async () => {
    const cars = document.querySelectorAll('.car') as NodeListOf<HTMLElement>;
    await Promise.all(
        Array.from(cars).map(async (car) => {
            await patchRequestStartEngine(+car.id, 'started');
        })
    );
    cars.forEach((car, index) => {
        patchRequestMoveAllCar(car);
        car.style.transform = `translateX(${window.innerWidth - 250}px)`;
        car.style.transition = `all ${state.startCars[index]}s ease-in-out`;
    });
    setTimeout(() => {
        const minTime = Math.min.apply(null, state.startCars);
        const car = state.cars[+(localStorage.getItem('currentPage') as string) - 1][state.startCars.indexOf(minTime)];
        const popup = document.querySelector('.popup-winner') as HTMLDivElement;
        popup.style.transform = 'translateX(-50%) scale(1)';
        popup.style.opacity = '1';
        if (state.startCars.filter((item) => item !== 100).length === 0) {
            popup.textContent = `NOBODY wins!`;
        } else {
            popup.textContent = `${car.name} win with time: ${minTime} seconds!`;
        }

        if (!localStorage.getItem(`Winners_${car.id}`)) {
            localStorage.setItem(`Winners_${car.id}`, '1');
        } else {
            localStorage.setItem(
                `Winners_${car.id}`,
                String(+(localStorage.getItem(`Winners_${car.id}`) as string) + 1)
            );
        }
        state.newWinner = {
            id: +car.id,
            wins: +(localStorage.getItem(`Winners_${car.id}`) as string),
            time: minTime,
            name: car.name,
            color: car.color,
        };
        setTimeout(() => {
            popup.style.transform = 'scale(0)';
            popup.style.opacity = '0';
        }, 3000);
    }, 5000);
};

export const stopAllEngine = async () => {
    const cars = document.querySelectorAll('.car') as NodeListOf<HTMLElement>;
    await Promise.all(
        Array.from(cars).map(async (car) => {
            await patchRequestStartEngine(+car.id, 'stopped');
        })
    );
    cars.forEach((car) => {
        car.style.transform = `translateX(0px)`;
        car.style.transition = `all 1s ease-in-out`;
    });
    state.startCars = [];
};

export const moveCar = async (id: number, status: string) => {
    const cars = document.querySelectorAll('.car') as NodeListOf<HTMLElement>;
    cars.forEach((car, index) => {
        if (+car.id === id) {
            if (status === 'started') {
                car.style.transform = `translateX(${window.innerWidth - 250}px)`;
                car.style.transition = `all ${state.startCars[index]}s ease-in-out`;
            } else if (status === 'stopped') {
                car.style.transform = `translateX(0px)`;
                car.style.transition = `all 1s ease-in-out`;
            }
        }
    });
};

export const patchRequestMoveCar = async (id: number) => {
    const cars = document.querySelectorAll('.car') as NodeListOf<HTMLLIElement>;
    moveCar(+id, 'started');
    return fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, {
        method: 'PATCH',
        body: JSON.stringify(state.cars),
    }).then((res) => {
        if (res.status === 500) {
            cars.forEach((car) => {
                if (car.id === `${id}`) {
                    const coordinateX = Math.floor(car.getBoundingClientRect().x) - 80;
                    car.style.transform = `translate(${coordinateX}px)`;
                }
            });
        }
    });
};

export const patchRequestMoveAllCar = async (car: HTMLElement) => {
    return fetch(`http://127.0.0.1:3000/engine?id=${car.id}&status=drive`, {
        method: 'PATCH',
        body: JSON.stringify(state.cars),
    }).then((res) => {
        if (res.status === 500) {
            const coordinateX = Math.floor(car.getBoundingClientRect().x) - 80;
            car.style.transform = `translate(${coordinateX}px)`;
            state.cars[+(localStorage.getItem('currentPage') as string) - 1].forEach((item, index) => {
                if (item.id === +car.id) {
                    state.startCars.splice(index, 1, 100);
                }
            });
        }
    });
};

export const chunkCars = (cars: { name: string; color: string; id: number }[], size: number) => {
    const result = [];
    for (let i = 0; i < Math.ceil(cars.length / size); i++) {
        result[i] = cars.slice(i * size, i * size + size);
    }
    return result;
};

export const chunkWinners = (
    winners: { id: number; wins: number; time: number; name: string; color: string }[],
    size: number
) => {
    const result = [];
    for (let i = 0; i < Math.ceil(winners.length / size); i++) {
        result[i] = winners.slice(i * size, i * size + size);
    }
    return result;
};
