const input = document.getElementById('input');// Поле введення даних
const list = document.getElementById('list');// Блок для формування списку
const btnAdd = document.getElementById('btnAdd');// Кнопка додавання пари значень в список
const btnDel = document.getElementById('btnDel');// Кнопка видалення елементів зі списку
const sortButtons = document.getElementsByName('sort');// Кнопки сортування

addEventListener("keydown", (event) => {
    if (event.key === "Enter" && input.value !== '') {
        btnAdd.click();
    }
});

function checkInputValue(inputValue) {// Функція перевірки введених даних на їх коректність
    const regex = /^[А-яA-zґҐЁёІіЇїЄє0-9 =]+$/;// Введене значення має містити тільки букви, цифри, пробіли та знак '='
    if (regex.test(inputValue)) {
        if (inputValue.includes('=')) {
            const arrInputValue = inputValue.split('=');
            arrInputValue[0] = arrInputValue[0].trim();// Зайве якщо Name та Value не повинні зовсім містити пробілів
            arrInputValue[1] = arrInputValue[1].trim();// Зайве якщо Name та Value не повинні зовсім містити пробілів
            if (arrInputValue.length === 2 && arrInputValue[0] !== '' && arrInputValue[1] !== '') {// Введене значення коректне
                return arrInputValue.join('=');
            } else if (arrInputValue.length > 2) {// Введене значення містить більше одного знака '='
                addErrorMsg(`The separator '=' must be 1`);
            } else {// 'Name' або 'Value' пусті
                addErrorMsg(`'Name' and 'Value' must not be empty`);
            }
        } else {// Введене значення не містить знака '='
            addErrorMsg(`'Pare' must be separated by the sign'='`);
        }
    } else {// Введене значення містить недопустимі символи
        addErrorMsg(`Only letters, numbers, space and 1 '=' sign`);
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
    if (errorMsgElement) {// Якщо є повідомлення про помилку - видаляємо його та видаляємо клас з поля введення або зі списку
        errorMsgElement.remove();
        input.classList.contains('is-invalid') ? input.classList.remove('is-invalid') : (list.classList.contains('is-invalid') ? list.classList.remove('is-invalid') : '');
    }
}

function addElementToList(content) {// Функція додавання елементу в блок списку
    const newElementList = document.createElement('p');
    newElementList.textContent = content;
    list.prepend(newElementList);
    newElementList.onclick = function () {// Подія виділення/зняття виділення елементів для видалення зі списку
        this.classList.contains('mark') ? this.classList.remove('mark') : this.classList.add('mark');
    }
}

btnAdd.onclick = function () {// Подія на кнопку додавання пари значень в список
    checkErrorMsg();
    let inputValue = input.value.replace(/\s+/g, ' ');//.replaceAll(/\s+/g, ''); - Якщо Name та Value не повинні зовсім містити пробілів
    if (inputValue === '') {// Якщо в поле для введення нічого зовсім не ввели
        input.classList.add('is-invalid');
        addErrorMsg('This field is required');
    } else {
        const cleanInputValue = checkInputValue(inputValue);
        if (cleanInputValue) {// Якщо введене значення відповідає вимогам намагаємось додати до списку
            if (checkDoublePair(cleanInputValue) === 0) {// Перевірка на відсутність у списку аналогічної пари
                addElementToList(cleanInputValue);
                input.value = '';
                input.focus();
            } else {
                addErrorMsg('This combination is already in the list');
            }
        }
    }
}

btnDel.onclick = function () {// Подія на кнопку видалення елементів зі списку
    checkErrorMsg();
    const listElements = document.querySelectorAll('p');
    if (listElements.length === 0) {// Перевірка на наявність елементів у списку
        list.classList.add('is-invalid');
        addErrorMsg('The list contains no elements');
    } else {
        let counterSelectedElements = 0;
        for (let i = 0; i < listElements.length; i++) {// Шукаємо відмічені елементи та видаляємо
            if (listElements[i].classList.contains('mark')) {
                listElements[i].remove();
                counterSelectedElements++;
            }
        }
        if (counterSelectedElements === 0) {// Перевірка на наявність відмічених елементів для видалення
            list.classList.add('is-invalid');
            addErrorMsg('Mark (click) item(s) to be deleted');
        }
    }
}

for (let i = 0; i < sortButtons.length; i++) {// Подія на кнопки сортування
    sortButtons[i].onclick = function () {
        checkErrorMsg();
        const listElements = [...document.querySelectorAll('p')];
        if (listElements.length === 0) {// Перевірка на наявність елементів у списку
            addErrorMsg('There are no items in the list to sort');
        } else if (listElements.length === 1) {// Якщо у списку тільки 1 елемент немає що сортувати
            addErrorMsg('There is only 1 element in the list');
        } else {
            const paramSort = +this.value;
            listElements.sort((a, b) => {// Сортуємо елементи по параметру зі значення натиснутої кнопки
                if (b.innerText.split('=')[paramSort] > a.innerText.split('=')[paramSort]) {
                    return 1;
                }
                if (b.innerText.split('=')[paramSort] < a.innerText.split('=')[paramSort]) {
                    return -1;
                }
                if (b.innerText.split('=')[paramSort] === a.innerText.split('=')[paramSort]) {
                    return 0;
                }
            });
            list.innerHTML = '';// Очищаємо список та формуємо його відсортованим
            for (let i = 0; i < listElements.length; i++) {
                addElementToList(listElements[i].innerText);
            }
        }
    };
}