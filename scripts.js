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

display.addEventListener('keydown', keyboardActions);

let firstOperand;
let currentOperator;
let secondOperand;
let nextOperator;
let result;

let resetDisplay = false;
let displayUpdated = false;

function keyboardActions(event) {
  let isDigitOrDecimal = /^[.\d]$/.test(event.key);

  if (event.key === 'Backspace') {
    return;
  } else {
    event.preventDefault();
  }

  if (isDigitOrDecimal) {
    manipulateDisplay(event);
  }

  let operators = ['+', '-', '*', ];

}

function manipulateDisplay(event) {  
  let buttonContent = event.target.textContent;
  let contentForDisplay = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.' ];

  if (event.target.id === 'display') {
    buttonContent = event.key;
  } else {
    buttonContent = event.target.textContent;
  }

  // When a digit or decimal is clicked, reset the display if the first operand
  // and the current operator have been entered
  if (resetDisplay) {
    display.value = '';
    resetDisplay = false;
    displayUpdated = false;
  }

  // Clear display and empty variables when 'clear' button is pressed
  if (event.target.getAttribute('id') === 'clear') {
    display.value = '';
    firstOperand = null;
    currentOperator = null;
    secondOperand = null;
    nextOperator = null;
  }
  
  // Specify behaviour for when decimal button is clicked
  if (buttonContent === '.') {
    if (display.value.split('').includes('.')) {
      return;
    }
    display.value += buttonContent;
  }

  // Populate display with numbers
  if (contentForDisplay.includes(parseInt(buttonContent))) {
    if (currentOperator) {
      displayUpdated = true;
    }

    display.value += buttonContent;
  }
}

function operate(event) {
  let operator = parseOperator(event);

  checkInputs: 
  if (!firstOperand) {
    firstOperand = parseFloat(display.value);
    currentOperator = operator;
    resetDisplay = true;
  } else if (operator === 'equals') {
    nextOperator = operator;

    if (displayUpdated) {
      secondOperand = parseFloat(display.value);
      displayUpdated = true;
      resetDisplay = true;
    }
    break checkInputs;
  } else if (firstOperand && !secondOperand) {
    console.log('firstOperand set, no secondOperand');
    nextOperator = operator;
    
    if (displayUpdated) {
      secondOperand = parseFloat(display.value);
      displayUpdated = true;
      resetDisplay = true;
    }
  }

  // Conduct operations only if inputs exist
  if (firstOperand && currentOperator && secondOperand) {
    switch (currentOperator) {
      case 'add':
        result = firstOperand + secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
      case 'subtract':
        result = firstOperand - secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
      case 'multiply':
        result = firstOperand * secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
      case 'divide':
        result = firstOperand / secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
      case 'modulo':
        result = firstOperand % secondOperand;
        display.value = result;
        firstOperand = result;
        secondOperand = null;
        currentOperator = nextOperator;
        break;
    }
  }
  
}


function parseOperator(event) {
  if (event.target.id === 'display') {
    switch(event.key) {
      case '+':
        return 'add';
      case '-':
        return 'subtract';
      case '*':
        return 'muiltiply';
      case '/':
        return 'divide';
      case '%':
        return 'modulo';
      case '=':
        return 'equals';
    }
  } else {
    return event.target.getAttribute('id');
  }
}
