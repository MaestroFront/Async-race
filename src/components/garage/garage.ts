import {
    createElement,
    createInput,
    createButton,
    state,
    fillData,
    deleteRequest,
    generateColor,
    Page,
    generateCars,
    startAllEngine,
    stopAllEngine,
    patchRequestStartEngine,
    patchRequestMoveCar,
    moveCar,
    putRequest,
    clearData,
    postRequest,
    chunkCars,
    chunkWinners,
} from '../helpers/helpers';

import { getRequestWinner, postRequestWinner, deleteRequestWinner } from '../winners/winners';

const createSettingsBlock = () => {
    const settingsContainer = createElement('div', 'settings-container') as HTMLDivElement;
    settingsContainer.append(createCreateContainer(), createUpdateContainer(), createSettingsBtnsContainer());
    return settingsContainer;
};

const createCreateContainer = () => {
    const createBlock = createElement('div', 'create-block') as HTMLDivElement;
    const carName = createInput('input', 'create-input', 'text') as HTMLInputElement;
    carName.placeholder = 'edit a name of car';
    carName.addEventListener('change', (e) => {
        const element = e.target as HTMLInputElement;
        state.newCar.name = element.value;
    });
    carName.oninput = () => {
        localStorage.setItem('createCarName', carName.value);
        if (carName.value.length > 0) {
            createButtonElement.disabled = false;
        } else {
            createButtonElement.disabled = true;
        }
    };

    const carColor = createInput('input', 'create-color', 'color') as HTMLInputElement;
    carColor.addEventListener('change', (e) => {
        const element = e.target as HTMLInputElement;
        state.newCar.color = element.value;
    });
    carColor.value = generateColor();
    carColor.oninput = () => {
        if (carName.value.length > 0) {
            createButtonElement.disabled = false;
        } else {
            createButtonElement.disabled = true;
        }
    };

    const createButtonElement = createButton('button', 'create-button', 'button') as HTMLButtonElement;
    createButtonElement.textContent = 'Create';
    createButtonElement.disabled = true;
    createButtonElement.onclick = async () => {
        createButtonElement.disabled = true;
        if (
            (document.querySelector('.create-input') as HTMLInputElement).value.length > 0 &&
            (document.querySelector('.create-color') as HTMLInputElement).value.length > 0
        ) {
            await postRequest();
            setTimeout(() => {
                fillGarage(state.cars);
                clearData();
                updateQuantityOfCars();
            }, 300);
        }
        if (+(localStorage.getItem('currentPage') as string) < state.cars.length)
            (document.querySelector('.btn-next') as HTMLButtonElement).disabled = false;
    };

    createBlock.append(carName, carColor, createButtonElement);
    return createBlock;
};

const createUpdateContainer = () => {
    const updateBlock = createElement('div', 'update-block') as HTMLDivElement;
    const updateInput = createInput('input', 'update-input', 'text') as HTMLInputElement;
    updateInput.placeholder = 'edit a name of car';
    updateInput.addEventListener('change', (e) => {
        const element = e.target as HTMLInputElement;
        state.editCar.name = element.value;
    });
    updateInput.oninput = () => {
        if (updateInput.value.length > 0) {
            updateButton.disabled = false;
        } else {
            updateButton.disabled = true;
        }
        localStorage.setItem('updateCarName', updateInput.value);
    };

    const updateColorInput = createInput('input', 'update-color', 'color') as HTMLInputElement;
    updateColorInput.addEventListener('change', (e) => {
        const element = e.target as HTMLInputElement;
        state.editCar.color = element.value;
    });
    updateColorInput.value = generateColor();

    const updateButton = createButton('button', 'update-button', 'button') as HTMLButtonElement;
    updateButton.textContent = 'Update';
    updateButton.disabled = true;
    updateButton.onclick = async () => {
        await putRequest();
        fillGarage(state.cars);
        clearData();
        updateQuantityOfCars();
        updateButton.disabled = true;
    };

    updateBlock.append(updateInput, updateColorInput, updateButton);
    return updateBlock;
};

const createSettingsBtnsContainer = () => {
    const btnsContainer = createElement('div', 'settings-btn__container') as HTMLDivElement;
    const btnRace = createButton('button', 'btn-race', 'button') as HTMLButtonElement;
    btnRace.textContent = 'Race';
    btnRace.onclick = async () => {
        (document.querySelector('.btn-generate') as HTMLButtonElement).disabled = true;
        btnRace.disabled = true;
        await startAllEngine();
        setTimeout(async () => {
            postRequestWinner();
            (document.querySelector('.btn-reset') as HTMLButtonElement).disabled = false;
            getRequestWinner();
        }, 11000);
    };
    const btnReset = createButton('button', 'btn-reset', 'button') as HTMLButtonElement;
    btnReset.textContent = 'Reset';
    btnReset.disabled = true;
    btnReset.onclick = () => {
        btnRace.disabled = false;
        btnReset.disabled = true;
        (document.querySelector('.btn-generate') as HTMLButtonElement).disabled = false;
        stopAllEngine();
        clearData();
    };

    const btnGenerate = createButton('button', 'btn-generate', 'button') as HTMLButtonElement;
    btnGenerate.textContent = 'Generate cars';
    btnGenerate.onclick = async () => {
        await generateCars();
        setTimeout(() => {
            fillGarage(state.cars);
            updateQuantityOfCars();
            (document.querySelector('.btn-next') as HTMLButtonElement).disabled = false;
        }, 500);
    };

    btnsContainer.append(btnRace, btnReset, btnGenerate);

    return btnsContainer;
};

export const updateQuantityOfCars = () => {
    const quantity = document.querySelector('.cars-quantity') as HTMLSpanElement;
    quantity.textContent = `(${state.cars.flat().length})`;
};

const createCarsListTitle = () => {
    const block = createElement('div', 'current-data') as HTMLDivElement;
    const listTitle = createElement('p', 'cars-title') as HTMLParagraphElement;
    listTitle.textContent = 'Garage ';

    const carsQuantity = createElement('span', 'cars-quantity') as HTMLSpanElement;
    carsQuantity.textContent = `(${state.cars.flat().length})`;

    const page = createElement('p', 'page') as HTMLParagraphElement;
    page.textContent = 'Page ';

    const currentPageNumber = createElement('span', 'current-page') as HTMLSpanElement;
    currentPageNumber.textContent = `${localStorage.getItem('currentPage')}`;

    listTitle.append(carsQuantity);
    page.append(currentPageNumber);
    block.append(listTitle, page);

    return block;
};

export const createSvgCar = (id: number) => {
    const xmlns = 'http://www.w3.org/2000/svg';

    const carImage = document.createElementNS(xmlns, 'svg');
    carImage.id = `${id}`;
    carImage.classList.add('car');
    carImage.setAttributeNS(null, 'version', '1.0');
    carImage.setAttributeNS(null, 'width', '100');
    carImage.setAttributeNS(null, 'viewBox', '0 0 1280.000000 640.000000');
    carImage.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');

    const g = document.createElementNS(xmlns, 'g');
    g.setAttribute('transform', 'translate(0.000000,640.000000) scale(0.100000,-0.100000)');
    g.setAttribute('stroke', 'none');

    const path = document.createElementNS(xmlns, 'path');
    path.setAttribute(
        'd',
        'M4235 5299 c-187 -12 -354 -28 -555 -55 -671 -89 -859 -155 -2007 -705 l-392 -188 -438 -56 c-241 -31 -455 -61 -475 -66 -88 -23 -148 -157 -183 -409 -16 -117 -35 -427 -35 -595 l-1 -110 -32 -20 c-39 -25 -71 -80 -91 -159 -14 -57 -13 -77 9 -296 l24 -235 -30 -43 -31 -42 22 -45 c27 -57 125 -148 239 -223 l90 -59 273 -37 c150 -21 462 -65 693 -98 231 -34 471 -64 534 -67 l115 -6 12 -50 c7 -27 36 -96 64 -151 197 -392 691 -578 1190 -448 270 70 495 240 598 454 l47 97 186 -5 185 -5 33 42 33 42 337 -6 c185 -3 838 -10 1451 -15 613 -6 1543 -15 2065 -20 934 -10 952 -10 1065 10 63 11 124 22 135 25 17 3 29 -10 65 -73 53 -90 185 -229 279 -292 270 -181 643 -244 952 -159 235 64 435 219 545 421 l39 72 135 33 c95 23 254 47 540 82 l405 49 216 88 216 87 6 211 c3 126 12 249 22 306 28 157 7 286 -52 313 -15 7 -27 24 -33 51 -45 176 -182 437 -288 548 -144 151 -827 325 -1798 457 -321 44 -655 82 -929 106 l-179 15 -176 104 c-313 186 -695 393 -1067 579 -334 167 -765 368 -843 392 -265 83 -655 134 -1175 155 -288 11 -1831 11 -2010 -1z'
    );

    g.append(path);
    carImage.append(g);

    return carImage;
};

export const createCarItem = (car: { name: string; color: string }, index: number) => {
    const carItem = createElement('li', 'car-item') as HTMLLIElement;
    carItem.id = `${index}`;
    const changingBlock = createElement('div', 'changing-block') as HTMLDivElement;

    const btnSelect = createButton('button', 'btn-select', 'button') as HTMLButtonElement;
    btnSelect.textContent = 'Select';
    btnSelect.onclick = () => {
        editCar(index);
        (document.querySelector('.update-button') as HTMLButtonElement).disabled = false;
    };

    const btnRemove = createButton('button', 'btn-remove', 'button') as HTMLButtonElement;
    btnRemove.textContent = 'Remove';
    btnRemove.onclick = () => {
        if (localStorage.getItem('currentPage') === String(state.cars.length - 1))
            (document.querySelector('.btn-next') as HTMLButtonElement).disabled = true;
        localStorage.removeItem(`Winners_${index}`);
        deleteCar(index);
    };

    const nameCar = createElement('span', 'car-name') as HTMLSpanElement;
    nameCar.textContent = car.name;
    changingBlock.append(btnSelect, btnRemove, nameCar);

    const carImage = createSvgCar(index) as SVGElement;
    carImage.setAttributeNS(null, 'fill', car.color);

    const moveBlock = createElement('div', 'move-block') as HTMLDivElement;
    const startBtn = createButton('button', 'start-car', 'button') as HTMLButtonElement;
    startBtn.textContent = 'A';
    startBtn.id = `${index}`;
    startBtn.onclick = async () => {
        setTimeout(async () => {
            startBtn.disabled = true;
            await patchRequestStartEngine(+startBtn.id, 'started');
            await patchRequestMoveCar(+startBtn.id);
            // moveCar(+startBtn.id, 'started');
            stopBtn.disabled = false;
        }, 200);
    };

    const stopBtn = createButton('button', 'stop-car', 'button') as HTMLButtonElement;
    stopBtn.textContent = 'B';
    stopBtn.id = `${index}`;
    stopBtn.disabled = true;
    stopBtn.onclick = async () => {
        await patchRequestStartEngine(+stopBtn.id, 'stopped');
        startBtn.disabled = false;
        moveCar(+stopBtn.id, 'stopped');
        stopBtn.disabled = true;
    };

    const finish = createElement('img', 'finish-image') as HTMLImageElement;
    finish.src = '../../assets/icons/finish.png';

    moveBlock.append(startBtn, stopBtn, carImage, finish);
    carItem.append(changingBlock, moveBlock);

    return carItem;
};

const createPageSwitchesButtonsBlock = () => {
    const block = createElement('div', 'switches-block') as HTMLDivElement;
    const btnPrev = createButton('button', 'btn-prev', 'button') as HTMLButtonElement;
    btnPrev.textContent = 'prev';
    btnPrev.onclick = () => {
        localStorage.setItem('currentPage', `${+(localStorage.getItem('currentPage') as string) - 1}`);
        (document.querySelector('.current-page') as HTMLSpanElement).textContent = localStorage.getItem('currentPage');
        fillGarage(state.cars);
        btnNext.disabled = false;
        if (localStorage.getItem('currentPage') === '1') btnPrev.disabled = true;
    };

    const btnNext = createButton('button', 'btn-next', 'button') as HTMLButtonElement;
    btnNext.textContent = 'next';
    btnNext.onclick = () => {
        localStorage.setItem('currentPage', `${+(localStorage.getItem('currentPage') as string) + 1}`);
        (document.querySelector('.current-page') as HTMLSpanElement).textContent = localStorage.getItem('currentPage');
        fillGarage(state.cars);
        btnPrev.disabled = false;
        if (localStorage.getItem('currentPage') === String(state.cars.length)) btnNext.disabled = true;
    };
    if (localStorage.getItem('currentPage') === '1') btnPrev.disabled = true;

    block.append(btnPrev, btnNext);

    return block;
};

const carsList = createElement('ul', 'cars-list') as HTMLUListElement;

const createGaragePage = () => {
    const garagePage = createElement('div', 'garage-page') as HTMLDivElement;

    garagePage.append(createSettingsBlock(), createCarsListTitle(), carsList, createPageSwitchesButtonsBlock());

    return garagePage;
};

const editCar = (id: number) => {
    const currentPage = localStorage.getItem('currentPage') as string;
    state.cars[+currentPage - 1].forEach((car, index) => {
        if (car.id === id) {
            const editableCar = state.cars[+currentPage - 1][index];
            state.editCar = editableCar;
        }
    });
    fillData();
};

const deleteCar = async (id: number) => {
    await removeCarAndWinner(id);
    await getRequestWinner();
    state.cars = chunkCars(state.cars.flat(), 7);
    state.winners = chunkWinners(state.winners.flat(), 10);
    fillGarage(state.cars);
    updateQuantityOfCars();
};

const removeCarAndWinner = async (id: number) => {
    const currentPage = localStorage.getItem('currentPage') as string;
    state.cars[+currentPage - 1].forEach((car, index) => {
        if (car.id === id) {
            const editableCar = state.cars[+currentPage - 1][index];
            deleteRequest(editableCar.id);
            deleteRequestWinner(editableCar.id);
            state.cars[+currentPage - 1].splice(index, 1);
            state.winners.flat().forEach((item, ind) => {
                if (item.id === editableCar.id) {
                    state.winners.flat().splice(ind, 1);
                }
            });
        }
    });
};

export const fillGarage = (cars: { name: string; color: string; id: number }[][]) => {
    const carsList = document.querySelector('.cars-list') as HTMLUListElement;
    const currentPage = localStorage.getItem('currentPage') as string;
    carsList.innerHTML = '';
    if (cars.length === 0) {
        cars.push([]);
        cars[+currentPage - 1].forEach((car, index) => {
            if (car.name && car.color) {
                carsList.append(createCarItem(car, state.cars[+currentPage - 1][index].id));
            } else if (car.name) {
                car.color = generateColor();
                carsList.append(createCarItem(car, state.cars[+currentPage - 1][index].id));
            }
        });
    }
    if (cars[+currentPage - 1].length) {
        cars[+currentPage - 1].forEach((car, index) => {
            if (car.name && car.color) {
                carsList.append(createCarItem(car, state.cars[+currentPage - 1][index].id));
            } else if (car.name) {
                car.color = generateColor();
                carsList.append(createCarItem(car, state.cars[+currentPage - 1][index].id));
            }
        });
    }
};

export class Garage extends Page {
    protected container: HTMLDivElement;

    constructor(id: string) {
        super(id);
        this.container = createGaragePage();
    }

    render() {
        return this.container;
    }
}
