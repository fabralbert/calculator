'use strict';

// для окна вывода в калькуляторе
const numberInput = document.querySelector('.calculator_number-input');
const resultInput = document.querySelector('.calculator_result-input');
const operationInput = document.querySelector('.calculator_operation-input');
// кнопки
const calculateBtn = document.querySelector('.calculator_item__calculate');
const deleteBtn = document.querySelector('.calculator_item__delete');
const clearBtn = document.querySelector('.calculator_item__clear');
const numbersBtns = document.querySelectorAll('.calculator_item__number');
const operationsBtns = document.querySelectorAll('.calculator_item__operation');
const errorText = document.querySelector('.calculator_error')

console.log(errorText.style)

// обработчики
// кнопки расчета '=', удаления последнего числа '<=', полной очистки (сброс всего) 'C'
calculateBtn.addEventListener('click', calculate);
deleteBtn.addEventListener('click', deleteLastNumber);
clearBtn.addEventListener('click', clear);
// коллекция цифр 1,2,3,4,5,6,7,8,9,0,.
numbersBtns.forEach(number => {
  number.addEventListener('click', selectNumber)
})
// коллекция операций +, -, /, *
operationsBtns.forEach(operation => {
  operation.addEventListener('click', selectOperation)
})

let previousNumber = 0;
let number = 0;
let total;
let operation;
// нужно для того чтобы сохранить последний 
let lastOperation;
// пометка, что последний раз пользовались кнопкой '='
let isLastEqualOperation = false;
// пометка, что последний раз жали на одну из операций '+, - , / , *'
let isLastSelectOperation = false;
// пометка, что последний раз пользовались вводом числа
let isLastSelectNumber = false;
// если был показан текст при делении на 0
let isLastError = false;

numberInput.textContent = 0;

function selectNumber(event){
  
  console.log(`%c${'selectNumber:'}`, `color: ${'#FFFF00'}`);
  console.log(`selectNumber Вход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} isLastEqualOperation: ${isLastEqualOperation}`)

  // если была ошибка, все отчищаем
  if (isLastError) {
    clear()
  }

  // если после знака равенства нажали на выбор цифр, все очищаем
  if (isLastEqualOperation){
    clear()
  }

  if (isLastSelectOperation) {
    isLastSelectOperation = false;
    previousNumber = number;
    number = 0;
  }

  // не добавлять '.', если уже присутвует в числе
  if (number.toString().includes('.') && event.target.textContent === '.') {
    return
  }

  // условие чтобы не было чисел в виде: 030, а было просто 30, но в случае если самый первый знак был '.', то 0 нужно будет добавить спереди.
  if (number === 0 && event.target.textContent !== '.') {
    number = event.target.textContent
  } else {
    number = number + event.target.textContent;
  }

  // делим число на две части до точки и после точки в виде массива
  const lengthOfNumbersAfterDot = number.toString().split('.')

  // если больше 8 цифр после запятой, то приводим к 8 знакам после запятой
  if (lengthOfNumbersAfterDot[1]?.length > 8){
    number = parseFloat(number).toFixed(8);
  }

  // если длина числа до точки больше 16, то обрезать
  if (lengthOfNumbersAfterDot[0]?.length > 16){
    number = lengthOfNumbersAfterDot[0].slice(0, -1)
  }

  updateNodes(operation, parseFloat(number), previousNumber || '')
  
  isLastSelectNumber = true;
  // обрабатывает размер текста с учетом количества цифр
  

  changeSizeOfText()
  console.log(`selectNumber Выход, prevNumber: ${previousNumber} number: ${number} operation: ${operation}`)
}

function selectOperation(event) {
  console.log(`%c${'selectOperation:'}`, `color: ${'#DA70D6'}`);
  console.log(`selectOperation Вход, prevNumber: ${previousNumber} number: ${number} operation: ${operation}`)

  if (isLastError) {
    clear()
  }

  // если operationInput.textContent равен одно из операторов +,-,/,*, тогда можно его записать в lastOperator
  if (operationInput.textContent && operationInput.textContent !== '%' && operationInput.textContent !== '=') {
    lastOperation = operationInput.textContent;
  }

  // в случае если lastOperator есть и нажали на %, значит сделать расчет с %.
  if (lastOperation && event.target.textContent === '%'){
    console.log('lastOperation', lastOperation)
    console.log('Заход')
    operation = event.target.textContent;
    calculate(event)
    return
  }

  if (!operation){
    number = parseFloat(number);
    previousNumber = parseFloat(number)
  }

  // если последний раз нажимали кнопку '=', тогда делаем и number и prevNumber = total.
  if (isLastEqualOperation){
    previousNumber = parseFloat(total) || 0;
    number = parseFloat(total) || 0;
    total = '';
  }
  console.log(`%c${'selectOperation:'}`, `color: ${'#DA70D6'}`);
  console.log(`selectOperation Средний, prevNumber: ${previousNumber} number: ${number} operation: ${operation}`)

  // !isLastSelectOperation нужен чтобы вычисление не выполнялось если мы много раз подряд к примеру нажмем '+'
  // !isLastEqualOperation нужен т.к. если мы последний раз нажали '=', и потом нажали еще например + то вычисление уже выполнено, еще одно сразу же не нужно.
  if (!isLastSelectOperation && !isLastEqualOperation && operation && operation !== '%'){

    // проверка деления на ноль
    if (parseFloat(number) === 0 && operation === '/'){
      console.log('здесьошибка')
      showErrorText()
      return
    }

    calculate(event)
    console.log('Заходтут')
    previousNumber = parseFloat(total);
    number = parseFloat(total);
    total = '';
  }

  operation = event.target.textContent;

  updateNodes(operation, number, previousNumber || number)

  // зашли в выбор операции, переключили все нужные toggle.
  isLastSelectOperation = true;
  isLastEqualOperation = false;
  isLastSelectNumber = false;

  changeSizeOfText()
  console.log(`selectOperation Выход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} isLastEqualOperation: ${isLastEqualOperation}`)
}

// функция расчета
function calculate(event) {
  number = parseFloat(number);

  if (isLastError) {
    clear()
  }

  console.log(`%c${'calculate:'}`, `color: ${'#d77332'}`);
  console.log(`calculate Вход, prevNumber: ${previousNumber} number: ${number} operation: ${operation}`)

  if (!operation){
    
    previousNumber = parseFloat(number);
    updateNodes(event.target.textContent, number, previousNumber);
    return
  }

  if (event.target.textContent === '='){
    isLastEqualOperation = true;
  }

  switch(operation){
    case '/':

      if (parseFloat(number) === 0){
        console.log('здесьошибка')
        showErrorText()
        return
      }

      total = parseFloat(previousNumber) / parseFloat(number);
      fixNumbersAfterDot()
      break;

    case '*':
      total = parseFloat(previousNumber) * parseFloat(number);
      fixNumbersAfterDot()
      break;

    case '+':
      total = parseFloat(previousNumber) + parseFloat(number);
      fixNumbersAfterDot()
      break;

    case '-':
      total = parseFloat(previousNumber) - parseFloat(number);
      fixNumbersAfterDot()
      break;
    
    case '%':
      if (!lastOperation) {
        return
      }

      if (lastOperation === '*') {
        total = parseFloat(previousNumber) * (parseFloat(number) / 100);
        fixNumbersAfterDot()
      }

      // Проверка на то что number не равен нулю
      if (lastOperation === '/' && parseFloat(number)) { 
        console.log(number)
        total = parseFloat(previousNumber) / (parseFloat(number) / 100);
        fixNumbersAfterDot()
      } else if (lastOperation === '/') {
        showErrorText()
        return
      }

      if (lastOperation === '+') {
        total = parseFloat(previousNumber) + parseFloat(previousNumber) * parseFloat(number) / 100
        fixNumbersAfterDot()
      }
      
      if (lastOperation === '-') {
        total = parseFloat(previousNumber) - parseFloat(previousNumber) * parseFloat(number) / 100
        fixNumbersAfterDot()
      }
      break;

    default:
      updateNodes('=', number, previousNumber);
      break;
  }

  // перерендериваем DOM
  if (!(lastOperation && operation === '%')) {
    updateNodes('', total, `${previousNumber} ${operation} ${number} =`); // это для обычного расчета когда считаем +, -, *, /
  } else {
    updateNodes('', total, `${previousNumber} ${lastOperation} ${number}${operation} =`); // для случая когда считаем что-то с процентами
  }
  
  // после каждого расчета приравниваем prevNumer к total, чтобы уже на основе нового prevNumber продолжать другие расчеты
  if (!isNaN(total)){
    previousNumber = parseFloat(total);
  }

  console.log(`calculate Выход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} total: ${total}`)

  isLastSelectNumber = false;

  changeSizeOfText()
}

function clear() {
  previousNumber = 0;
  number = 0;
  operation = '';
  lastOperation = '';
  total = '';
  numberInput.textContent = 0;
  operationInput.textContent = '';
  resultInput.textContent = '';
  isLastEqualOperation = false;
  isLastSelectOperation = false;
  isLastSelectNumber = false;
  isLastError = false;
  errorText.style.display = 'none'
  changeSizeOfText();
}

function deleteLastNumber() {
  
  if (isLastError) {
    clear()
  }

  console.log(`deleteLastNum Вход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} total: ${total}`)
  if (isLastSelectNumber) {
    const editNumber = number.toString().slice(0, -1);
    number = parseFloat(editNumber || 0);
    updateNodes(operation, number, previousNumber || '')
  }

  changeSizeOfText()

  console.log(`deleteLastNum Выход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} total: ${total}`)
}

function updateNodes(operationInp, numberInp, previousNumberInp){
  operationInput.textContent = operationInp;
  numberInput.textContent = numberInp;
  resultInput.textContent = previousNumberInp;
}

function showErrorText() {
  updateNodes('', '', '');
  errorText.style.display = 'block';
  isLastError = true;
}

// изменение размера при увеличении количества цифр
function changeSizeOfText(){
  if (numberInput.textContent.length < 8) {
    numberInput.style.fontSize = "100px";
  };
  if (numberInput.textContent.length > 8 && numberInput.textContent.length <= 12) {
    numberInput.style.fontSize = "70px";
  };
  if (numberInput.textContent.length > 12 && numberInput.textContent.length <= 14) {
    numberInput.style.fontSize = "60px";
  };
  if (numberInput.textContent.length > 14 && numberInput.textContent.length < 16) {
    numberInput.style.fontSize = "50px";
  };

  console.log('length', resultInput.textContent.length)
  if (resultInput.textContent.length < 8) {
    operationInput.style.fontSize = "70px";
    resultInput.style.fontSize = "70px";
  };
  if (resultInput.textContent.length > 12 && resultInput.textContent.length <= 22) {
    operationInput.style.fontSize = "60px";
    resultInput.style.fontSize = "60px";
  };
  if (resultInput.textContent.length > 22 && resultInput.textContent.length <= 32) {
    operationInput.style.fontSize = "50px";
    resultInput.style.fontSize = "50px";
  };
  if (resultInput.textContent.length > 32 && resultInput.textContent.length <= 40) {
    operationInput.style.fontSize = "35px";
    resultInput.style.fontSize = "35px";
  };
  if (resultInput.textContent.length > 40) {
    operationInput.style.fontSize = "22px";
    resultInput.style.fontSize = "22px";
  };
}

function fixNumbersAfterDot(){
  // смотрим сколько количество цифр после запятой у total
  const numsAfterDotTotal = total.toString().split('.')[1]?.length;

  if (numsAfterDotTotal >= 1) {
    total = parseFloat(total.toFixed(8))
  }
}