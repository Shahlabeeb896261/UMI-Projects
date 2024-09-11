const ac = document.querySelector('.ac');
const de = document.querySelector('.de')
const dot = document.querySelector('.dot')
const divide = document.querySelector('.divide')
const seven = document.querySelector('.seven')
const eight = document.querySelector('.eight')
const nine = document.querySelector('.nine')
const multiply = document.querySelector('.multiply')
const four = document.querySelector('.four')
const five = document.querySelector('.five')
const six = document.querySelector('.six')
const minus = document.querySelector('.minus')
const one = document.querySelector('.one')
const two = document.querySelector('.two')
const three = document.querySelector('.three');
const plus = document.querySelector('.plus')
const doubleZero = document.querySelector('.doubleZero')
const zero = document.querySelector('.zero')
const equalBtn = document.querySelector('.equalBtn')
const display = document.querySelector('#display')

ac.addEventListener('click', () => {
    display.value = "";
    de.disabled = false;
})

de.addEventListener('click', () => {
    display.value = display.value.toString().slice(0, -1);
    de.disabled = false;
})

dot.addEventListener('click', () => {
    display.value += '.';
    de.disabled = false;
})

divide.addEventListener('click', () => {
    display.value += '/';
    de.disabled = false;
})

seven.addEventListener('click', () => {
    display.value += '7';
    de.disabled = false;
})

eight.addEventListener('click', () => {
    display.value += '8';
    de.disabled = false;
})

nine.addEventListener('click', () => {
    display.value += '9';
    de.disabled = false;
})

multiply.addEventListener('click', () => {
    display.value += '*';
    de.disabled = false;
})

four.addEventListener('click', () => {
    display.value += '4';
    de.disabled = false;
})

five.addEventListener('click', () => {
    display.value += '5';
    de.disabled = false;
})

six.addEventListener('click', () => {
    display.value += '6';
    de.disabled = false;
})

minus.addEventListener('click', () => {
    display.value += '-';
    de.disabled = false;
})

one.addEventListener('click', () => {
    display.value += '1';
    de.disabled = false;
})

two.addEventListener('click', () => {
    display.value += '2';
    de.disabled = false;
})

three.addEventListener('click', () => {
    display.value += '3';
    de.disabled = false;
})

plus.addEventListener('click', () => {
    display.value += '+';
    de.disabled = false;
})

doubleZero.addEventListener('click', () => {
    display.value += '00';
    de.disabled = false;
})

zero.addEventListener('click', () => {
    display.value += '0';
    de.disabled = false;
})

equalBtn.addEventListener('click', () => {
    display.value = eval(display.value);
    de.disabled = true;
})