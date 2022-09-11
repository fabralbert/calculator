'use strict';

// для делегирования событий
const calculatorBody = document.querySelector('.calculator_body');
// для окна вывода в калькуляторе
const numberInput = document.querySelector('.calculator_number-input');
const resultInput = document.querySelector('.calculator_result-input');
const operationInput = document.querySelector('.calculator_operation-input');
// кнопки
const calculateBtn = document.querySelector('.calculator_item__calculate')

let firstNumber = 0;
let secondNumber = 0;
let operation;
let isLastOperationCalculate = false;
let lastOperation;

numberInput.textContent = 0;

calculatorBody.addEventListener('click', function(event){
  if (event.target.classList.contains('calculator_item__number')) {
    selectNumber(event)
  }
  if (event.target.classList.contains('calculator_item__operation')){
    selectOperation(event)
  }
})

calculateBtn.addEventListener('click', calculate)

// функция выбора числа
function selectNumber(event){
  if (isLastOperationCalculate){
    clear()
  }

  isLastOperationCalculate = false;

  // если операция не выбрана, значит первое число уже указано
  if (!operation){

    // чтобы только 1 точка была в числе
    if (firstNumber?.toString().includes('.') && event.target.textContent === '.') {
      return
    }

    // условие чтобы не было чисел в виде: 030, а было просто 30, но в случае если самый первый знак был '.', то 0 нужно будет добавить спереди.
    if (firstNumber === 0 && event.target.textContent !== '.') {
      firstNumber = event.target.textContent
    } else {
      firstNumber = firstNumber + event.target.textContent;
    }
    numberInput.textContent = firstNumber;

  } else {
    
    if (secondNumber?.toString().includes('.') && event.target.textContent === '.') {
      return
    }

    if (secondNumber === 0 && event.target.textContent !== '.') {
      secondNumber = event.target.textContent
    } else {
      secondNumber = secondNumber + event.target.textContent;
    }
    numberInput.textContent = secondNumber;
  }

  // в случае если начали набирать с точки, то подставится спереди 0.
  if (numberInput.textContent === '.') {
    console.log('test')
    numberInput.textContent = '0.'
  }
}

function selectOperation(event) {

  if (secondNumber && event.target.textContent === '%') {
    if (operationInput.textContent) {
      lastOperation = operationInput.textContent;
    }
    if (lastOperation === '*' || lastOperation === '/') {
      secondNumber = parseFloat(secondNumber) / 100;
    }
    if (lastOperation === '+' || lastOperation === '-') {
      secondNumber = parseFloat(firstNumber) * parseFloat(secondNumber) / 100;
    }
    operationInput.textContent = '';
    operation = event.target.textContent;
    resultInput.textContent = `${firstNumber} ${lastOperation} ${secondNumber} =`;
    numberInput.textContent = firstNumber;
    return
  } else if (event.target.textContent === '%') {
    firstNumber = 0;
    secondNumber = 0;
  }

  // если после знака равно нажали что-то из +,-,/,*, то сбросить второе число
  // в итоге далее по условию по условию после этого не будет происходить вычислений
  if (isLastOperationCalculate) {
    secondNumber = '';
    isLastOperationCalculate = false;
  }

  if (secondNumber){
    calculate(event)
    secondNumber = '';
  }

  operation = event.target.textContent;
  resultInput.textContent = firstNumber;
  if (operation === '+' || operation === '-' || operation === '*' || operation === '/') {
    operationInput.textContent = operation;
  }
  numberInput.textContent = firstNumber;
}

function calculate(event) {
  let lastFirstNumber;

  if (!secondNumber){
    secondNumber = firstNumber;
  }

  switch(operation) {
    case '/':
      if (parseFloat(secondNumber) === 0){
        numberInput.textContent = 'на ноль делить нельзя';
        return
      }
      lastFirstNumber = firstNumber;
      firstNumber = parseFloat(firstNumber) / parseFloat(secondNumber);
      operationInput.textContent = '';
      resultInput.textContent = `${lastFirstNumber} / ${secondNumber} =`;
      numberInput.textContent = firstNumber;
      break;

    case '*':
      lastFirstNumber = firstNumber;
      firstNumber = parseFloat(firstNumber) * parseFloat(secondNumber);
      operationInput.textContent = '';
      resultInput.textContent = `${lastFirstNumber} * ${secondNumber} =`;
      numberInput.textContent = firstNumber;
      break;

    case '+':
      lastFirstNumber = firstNumber;
      firstNumber = parseFloat(firstNumber) + parseFloat(secondNumber);
      operationInput.textContent = '';
      resultInput.textContent = `${lastFirstNumber} + ${secondNumber} =`;
      numberInput.textContent = firstNumber;
      break;

    case '-':
      lastFirstNumber = firstNumber;
      firstNumber = parseFloat(firstNumber) - parseFloat(secondNumber);
      operationInput.textContent = '';
      resultInput.textContent = `${lastFirstNumber} - ${secondNumber} =`;
      numberInput.textContent = firstNumber;
      break;
    
    case '%':
      if (!lastOperation){
        operationInput.textContent = '='
        return
      }
      lastFirstNumber = firstNumber;

      if (lastOperation === '*') {
        firstNumber = parseFloat(firstNumber) * parseFloat(secondNumber);
      }
      if (lastOperation === '/') {
        firstNumber = parseFloat(firstNumber) / parseFloat(secondNumber);
      }
      if (lastOperation === '+') {
        firstNumber = parseFloat(firstNumber) + parseFloat(secondNumber);
      }
      if (lastOperation === '-') {
        firstNumber = parseFloat(firstNumber) - parseFloat(secondNumber);
      }
     
      operationInput.textContent = '';
      resultInput.textContent = `${lastFirstNumber} ${lastOperation} ${secondNumber} =`;
      numberInput.textContent = firstNumber;
      operation = lastOperation;
      lastOperation = '';
      break;

    default:
      resultInput.textContent = firstNumber;
      operationInput.textContent = '=';
      numberInput.textContent = firstNumber;
      break;
  }

  if (event.target.textContent === '='){
    isLastOperationCalculate = true;
  }
}


function clear(){
  firstNumber = 0;
  secondNumber = 0;
  operation = '';
  numberInput.textContent = '';
  operationInput.textContent = '';
  resultInput.textContent = '';
  isLastOperationCalculate = false;
  // lastOperation = '';
}


