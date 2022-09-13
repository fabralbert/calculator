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

numberInput.textContent = 0;

function selectNumber(event){
  console.log(`%c${'selectNumber:'}`, `color: ${'#FFFF00'}`);
  console.log(`selectNumber Вход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} isLastEqualOperation: ${isLastEqualOperation}`)

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

  updateNodes(operation, number , previousNumber || '')

  isLastSelectNumber = true;


  console.log(`selectNumber Выход, prevNumber: ${previousNumber} number: ${number} operation: ${operation}`)
}

function selectOperation(event) {
  console.log(`%c${'selectOperation:'}`, `color: ${'#DA70D6'}`);
  console.log(`selectOperation Вход, prevNumber: ${previousNumber} number: ${number} operation: ${operation}`)

  // если operationInput.textContent равен одно из операторов +,-,/,*, тогда можно его записать в lastOperator
  if (operationInput.textContent && operationInput.textContent !== '%') {
    lastOperation = operationInput.textContent;
  }

  // в случае если lastOperator есть и нажали на %, значит сделать расчет с %.
  if (lastOperation && event.target.textContent === '%'){
    operation = event.target.textContent;
    calculate(event)
    return
  }

  if (!operation){
    previousNumber = number
  }

  // если последний раз нажимали кнопку '=', тогда делаем и number и prevNumber = total.
  if (isLastEqualOperation){
    previousNumber = total || 0;
    number = total || 0;
    total = '';
  }
  console.log(`%c${'selectOperation:'}`, `color: ${'#DA70D6'}`);
  console.log(`selectOperation Средний, prevNumber: ${previousNumber} number: ${number} operation: ${operation}`)

  // !isLastSelectOperation нужен чтобы вычисление не выполнялось если мы много раз подряд к примеру нажмем '+'
  // !isLastEqualOperation нужен т.к. если мы последний раз нажали '=', и потом нажали еще например + то вычисление уже выполнено, еще одно сразу же не нужно.
  if (number && !isLastSelectOperation && !isLastEqualOperation && operation){
    calculate(event)
    previousNumber = total;
    number = total;
    total = '';
  }

  operation = event.target.textContent;

  updateNodes(operation, number, previousNumber || number)

  // зашли в выбор операции, переключили все нужные toggle.
  isLastSelectOperation = true;
  isLastEqualOperation = false;
  isLastSelectNumber = false;

  console.log(`selectOperation Выход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} isLastEqualOperation: ${isLastEqualOperation}`)
}

function calculate(event) {
  console.log(`%c${'calculate:'}`, `color: ${'#d77332'}`);
  console.log(`calculate Вход, prevNumber: ${previousNumber} number: ${number} operation: ${operation}`)

  if (!operation){
    previousNumber = number
    updateNodes(event.target.textContent, number, previousNumber);
    return
  }

  if (event.target.textContent === '='){
    isLastEqualOperation = true;
  }

  switch(operation){
    case '/':
      if (parseFloat(number) === 0){
        numberInput.textContent = 'на ноль делить нельзя';
        return 'деление на ноль'
      }

      total = parseFloat(previousNumber) / parseFloat(number);
      break;

    case '*':
      total = parseFloat(previousNumber) * parseFloat(number);
      break;

    case '+':
      total = parseFloat(previousNumber) + parseFloat(number);
      break;

    case '-':
      total = parseFloat(previousNumber) - parseFloat(number);
      break;
    
    case '%':
      if (!lastOperation) {
        return
      }

      if (lastOperation === '*') {
        total = parseFloat(previousNumber) * (parseFloat(number) / 100);

      }

      // Проверка на то что number не равен нулю
      if (lastOperation === '/' && parseFloat(number)) { 
        console.log(number)
        total = parseFloat(previousNumber) / (parseFloat(number) / 100);
      } else if (lastOperation === '/') {
        numberInput.textContent = 'на ноль делить нельзя';
        isLastEqualOperation = true
        return
      }

      if (lastOperation === '+') {
        total = parseFloat(previousNumber) + parseFloat(previousNumber) * parseFloat(number) / 100
      }
      
      if (lastOperation === '-') {
        total = parseFloat(previousNumber) - parseFloat(previousNumber) * parseFloat(number) / 100
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
    previousNumber = total;
  }

  console.log(`calculate Выход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} total: ${total}`)

  isLastSelectNumber = false;
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
}

function deleteLastNumber() {
  console.log(`deleteLastNum Вход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} total: ${total}`)
  if (isLastSelectNumber) {
    const editNumber = number.toString().slice(0, -1);
    number = parseFloat(editNumber || 0);
    updateNodes(operation, number, previousNumber || '')
  }
  console.log(`deleteLastNum Выход, prevNumber: ${previousNumber} number: ${number} operation: ${operation} total: ${total}`)
}

function updateNodes(operationInp, numberInp, previousNumberInp){
  operationInput.textContent = operationInp;
  numberInput.textContent = numberInp;
  resultInput.textContent = previousNumberInp;
}