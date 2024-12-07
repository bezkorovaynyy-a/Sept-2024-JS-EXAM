const input = document.getElementById('input');// Поле введення даних
const list = document.getElementById('list');// Блок для формування списку

function checkInputValue(inputValue) {// Функція перевірки введених даних на їх коректність
    const regex = /^[A-Za-zА-Яа-яґҐЁёІіЇїЄє0-9 =]+$/;// Пара значень має містити тільки букви, цифри та знак 1 '='. Тяжко з цим(((
    if (regex.test(inputValue)) {
        const arrInputValue = inputValue.split('=');
        if (arrInputValue.length === 2 && arrInputValue[0] !== '' && arrInputValue[1] !== '') {// Введене значення коректне
            return true;
        } else if (arrInputValue.length > 2) {// Присутньо більше одного знака '='
            addErrorMsg(`The separator '=' must be 1`);
        } else if (!inputValue.includes('=')) {// Пара не розділена знаком '='
            addErrorMsg(`'Pare must be separated by the 1 '=' sign`);
        } else {// 'Name' або 'Value' пусті
            addErrorMsg(`'Name' and 'Value' must not be empty`);
        }
    } else {// Введене значення містить недопустимі символи
        addErrorMsg(`Only letters, numbers and 1 '=' sign`);
    }
}

function checkDoublePair(inputValue) {// Функція перевірки існування в списку ідентичної пари
    const listElements = [...document.querySelectorAll('p')];
    let double = 0;
    for (let i = 0; i < listElements.length; i++) {
        if (listElements[i].innerText === inputValue) {
            double++;
        }
    }
    return double;
}

function addErrorMsg(errorText) {// Функція створення повідомлення про помилку
    const errorMsg = document.createElement('div');
    errorMsg.classList.add('error-msg');
    errorMsg.textContent = errorText;
    document.getElementsByClassName('main-container')[0].appendChild(errorMsg);
}

function checkErrorMsg() {// Функція перевірки повідомлення про помилку та видалення якщо дані вірні
    const errorMsgElement = document.getElementsByClassName('error-msg')[0];
    if (errorMsgElement) {
        errorMsgElement.remove();
        input.classList.remove('is-invalid');
        list.classList.remove('is-invalid');
    }
}

function addElementToList(content) {// Функція додавання елементу в блок списку
    const newElementList = document.createElement('p');
    newElementList.textContent = content;
    list.prepend(newElementList);
    newElementList.onclick = function () {// Функція вибору елементів для видалення зі списку
        this.classList.contains('mark') ? this.classList.remove('mark') : this.classList.add('mark');
    }
}

const btnAdd = document.getElementById('btnAdd');// Подія на кнопку додавання пари значень в список
btnAdd.onclick = function () {
    checkErrorMsg();
    let inputValue = input.value.trim();
    if (inputValue === '') {
        input.classList.add('is-invalid');
        addErrorMsg('This field is required');
    } else if (checkInputValue(inputValue)) {
        let arrNameValue = inputValue.split('=');
        inputValue = `${arrNameValue[0].trim()}=${arrNameValue[1].trim()}`;
        if (checkDoublePair(inputValue) === 0) {
            addElementToList(inputValue);
            input.value = '';
            input.focus();
        } else {
            input.classList.add('is-invalid');
            addErrorMsg('This combination is already in the list');
        }
    }
}

const btnDel = document.getElementById('btnDel');// Подія на кнопку видалення елементів зі списку
btnDel.onclick = function () {
    checkErrorMsg();
    const listElements = document.querySelectorAll('p');
    if (listElements.length === 0) {
        list.classList.add('is-invalid');
        addErrorMsg('The list contains no elements');
    } else {
        let counterSelectedElements = 0;
        for (let i = 0; i < listElements.length; i++) {
            if (listElements[i].classList.contains('mark')) {
                listElements[i].remove();
                counterSelectedElements++;
            }
        }
        if (counterSelectedElements === 0) {
            list.classList.add('is-invalid');
            addErrorMsg('Mark (click) item(s) to be deleted');
        }
    }
}

const sortButtons = document.getElementsByName('sort');// Подія на кнопки сортування
for (let i = 0; i < sortButtons.length; i++) {
    sortButtons[i].onclick = function () {
        checkErrorMsg();
        const listElements = [...document.querySelectorAll('p')];
        if (listElements.length === 0) {
            addErrorMsg('There are no items in the list to sort');
        } else if (listElements.length === 1) {
            addErrorMsg('There is only 1 element in the list');
        } else {
            listElements.sort((a, b) => {
                if (b.innerText.split('=')[+this.value] > a.innerText.split('=')[+this.value]) {
                    return 1;
                }
                if (b.innerText.split('=')[+this.value] < a.innerText.split('=')[+this.value]) {
                    return -1;
                }
                if (b.innerText.split('=')[+this.value] === a.innerText.split('=')[+this.value]) {
                    return 0;
                }
            });
            list.innerHTML = '';
            for (let i = 0; i < listElements.length; i++) {
                addElementToList(listElements[i].innerText);
            }
        }
    };
}