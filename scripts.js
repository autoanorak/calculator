const buttons = document.querySelectorAll('.calculator button:not(.operator)');
const operators = document.querySelectorAll('.operator');
const display = document.querySelector('#display');

buttons.forEach((button) => { 
  button.addEventListener('click', manipulateDisplay);
});

operators.forEach((button) => {
  button.addEventListener('click', operate);
  button.addEventListener('mousedown', (event) => event.target.classList.add('pressed'));
  button.addEventListener('mouseup', (event) => event.target.classList.remove('pressed'));
})

let firstOperand;
let currentOperator;
let secondOperand;
let nextOperator;
let result;

let resetDisplay = false;

function manipulateDisplay(event) {  
  let buttonContent = event.target.textContent;
  let contentForDisplay = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.',
  ];

  // When a digit or decimal is clicked, reset the display if the first operand
  // and the current operator have been entered
  if (resetDisplay) {
    display.value = '';
    resetDisplay = false;
  }

  if (event.target.getAttribute('id') === 'clear') {
    display.value = '';
    firstOperand = null;
    currentOperator = null;
    secondOperand = null;
    nextOperator = null;
  }
  
  if (event.target.getAttribute('id') === 'decimal') {
    if (display.value.split('').includes('.')) {
      return;
    }
    display.value += buttonContent;
  }
  
  if (contentForDisplay.includes(Number(buttonContent))) {
    display.value += buttonContent;
  }
}

function operate(event) {
  checkInputs: 
  if (!firstOperand) {
    console.log('if reached');
    firstOperand = parseFloat(display.value);
    currentOperator = event.target.getAttribute('id');
    resetDisplay = true;
  } else if (currentOperator === 'equals') {
    console.log('else if reached');
    nextOperator = event.target.getAttribute('id');
    if (nextOperator !== 'equals') {
      currentOperator = nextOperator;
      nextOperator = null;
    }
    break checkInputs;
  } else {
    console.log('else reached');
    secondOperand = parseFloat(display.value);
    nextOperator = event.target.getAttribute('id');
    resetDisplay = true;
  }

  if (firstOperand && currentOperator && secondOperand) {
    switch (currentOperator) {
      case 'add':
        console.log('switch add reached');
        result = firstOperand + secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
      case 'subtract':
        console.log('switch subtract reached');
        result = firstOperand - secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
      case 'multiply':
        console.log('switch multiply reached');
        result = firstOperand * secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
      case 'divide':
        console.log('switch divide reached');
        result = firstOperand / secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
    }
  }
  
}

