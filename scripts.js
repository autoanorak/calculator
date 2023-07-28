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
let secondOperandQueued = false;

function keyboardActions(event) {
  let isDigitOrDecimal = /^[.\d]$/.test(event.key);

  if (event.key === 'Backspace') {
    return;
  } else {
    event.preventDefault();
  }

  if (isDigitOrDecimal) {
    manipulateDisplay(event);
    return;
  }

  let operators = ['+', '-', '*', '/', '%', '=', 'Enter'];

  if (operators.includes(event.key)) {
    operate(event);
  }

}

function manipulateDisplay(event) {  
  let buttonContent = event.target.textContent;
  let contentForDisplay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'];

  if (event.target.id === 'display') {
    buttonContent = event.key;
  } else {
    buttonContent = event.target.textContent;
  }

  // When a digit or decimal is clicked, reset the display if the first operand
  // and the current operator have already been set
  if (resetDisplay) {
    display.value = '';
    resetDisplay = false;
    secondOperandQueued = false;
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
      secondOperandQueued = true;
    }

    display.value += buttonContent;
  }
}

function operate(event) {
  let operator = parseOperator(event);

  if (operator === 'equals') {
    if (secondOperandQueued) {
      secondOperand = parseFloat(display.value);
      secondOperandQueued = false;
      resetDisplay = true;
    }
  } else if (operator !== 'equals' && currentOperator) {
    nextOperator = operator;
  }

  // If the first operand is not set, always set the first operand and current operator together
  if (!firstOperand) {
    firstOperand = parseFloat(display.value);
    currentOperator = operator;
    resetDisplay = true;
  // If the first operand has been set but no current operator, set the current operator
  } else if (firstOperand && !currentOperator) {
    currentOperator = operator;
  // If the first operand and current operator have been set, update second operand only if
  // the user has typed something into the display since the time when the current operator was set
  // i.e. if the user sets the current operator and then clicks another operator without
  // updating the display, display.value will still be the previous operand; do not set
  } else if (firstOperand && currentOperator && !secondOperand) {
    currentOperator = operator;

    if (secondOperandQueued) {
      secondOperand = parseFloat(display.value);
      secondOperandQueued = false;
      resetDisplay = true;
    }
  } else if (firstOperand && currentOperator && secondOperand) {
    switch (currentOperator) {
      case 'add':
        result = firstOperand + secondOperand;
        updateInputs();
        break;
      case 'subtract':
        result = firstOperand - secondOperand;
        updateInputs();
        break;
      case 'multiply':
        result = firstOperand * secondOperand;
        updateInputs();
        break;
      case 'divide':
        result = firstOperand / secondOperand;
        updateInputs();
        break;
      case 'modulo':
        result = firstOperand % secondOperand;
        updateInputs();
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
      case 'Enter':
        return 'equals';
    }
  } else {
    return event.target.getAttribute('id');
  }
}


function updateInputs() {
  display.value = result;
  firstOperand = result;
  secondOperand = null;
  currentOperator = nextOperator;
  nextOperator = null;
}