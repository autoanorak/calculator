const buttons = document.querySelectorAll('.calculator button:not(.operator)');
const operators = document.querySelectorAll('.operator');
const display = document.querySelector('#display');

buttons.forEach(button => { 
  button.addEventListener('click', manipulateDisplay);
});

operators.forEach(button => {
  button.addEventListener('click', operate);
  button.addEventListener('click', blinkOnce);
})

display.addEventListener('keydown', keyboardActions);
display.addEventListener('keydown', blinkOnce);
display.addEventListener('click', highlightDisplay);

let firstOperand;
let currentOperator;
let secondOperand;
let nextOperator;
let result;

let resetDisplay = false;
let secondOperandQueued = false;

function keyboardActions(event) {
  let isDigitOrDecimal = /^[.\d]$/.test(event.key);
  let isOperator = /[\+\-\*\/\^\=]|Enter/.test(event.key);

  if (event.key === 'Backspace') {
    moveCursorEnd();
    return;
  } else {
    event.preventDefault();
  }

  if (isDigitOrDecimal) {
    manipulateDisplay(event);
  } else if (isOperator) {
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

  if (buttonContent === '+/-') {
    display.value = parseFloat(display.value * -1);

  // When a digit or decimal is clicked, reset the display if the first operand
  // and the current operator have already been set
  } else if (resetDisplay) {
    display.value = '';
    resetDisplay = false;
    secondOperandQueued = false; // need this?
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


function parseResult(result, maxLength = 19) {
  let resultStr = result.toString();

  if (resultStr.length > maxLength) {
    if (resultStr.includes('e')) {
      let [mantissa, exponent] = resultStr.split('e');
      console.log(mantissa);
      console.log(exponent);
      let mantissaRounded = parseFloat(mantissa).toFixed(maxLength - exponent.length - 1);
      return Number(mantissaRounded + 'e' + exponent);
    } else if (resultStr.includes('.')) {
      let [integer, fraction] = resultStr.split('.');
      let roundedFraction = fraction.toFixed(maxLength - integer.length);
      return Number(integer + '.' + roundedFraction);
    } else {
      return Number(resultStr.slice(0, maxLength));
    }
  } else {
    return result;
  }
}


function operate(event) {
  let operator = parseOperator(event);
  handleEquals(operator);

  // Handle exception: division by 0
  if (secondOperand === 0 && operator === 'divide') {
    alert('You can\'t divide by zero!');

    display.value = '';
    firstOperand = null;
    currentOperator = null;
    secondOperand = null;
    nextOperator = null;
  }

  // If the first operand is not set, always set the first operand and current operator together
  if (!isValid(firstOperand)) {
    firstOperand = +display.value;
    currentOperator = operator;
    resetDisplay = true;
  // If the first operand has been set but no current operator, set the current operator
  } else if (isValid(firstOperand) && !currentOperator && operator !== 'equals') {
    currentOperator = operator;
    resetDisplay = true;
  // If the first operand and current operator have been set, update second operand only if
  // the user has typed something into the display since the time when the current operator was set
  // i.e. if the user sets the current operator and then clicks another operator without
  // updating the display, display.value will still be the previous operand; do not set
  } else if (isValid(firstOperand) && currentOperator && !secondOperandQueued && !isValid(secondOperand)) {
    currentOperator = operator;
  } else if (isValid(firstOperand) && currentOperator && secondOperandQueued && !isValid(secondOperand)) {
    secondOperand = parseFloat(display.value);
    secondOperandQueued = false;
    resetDisplay = true;
  }
  
  if (isValid(firstOperand) && currentOperator && isValid(secondOperand)) {
    switch (currentOperator) {
      case 'add':
        result = parseResult(firstOperand + secondOperand);
        updateInputs();
        break;
      case 'subtract':
        result = parseResult(firstOperand - secondOperand);
        updateInputs();
        break;
      case 'multiply':
        result = parseResult(firstOperand * secondOperand);
        updateInputs();
        break;
      case 'divide':
        result = parseResult(firstOperand / secondOperand);
        updateInputs();
        break;
      case 'power':
        result = parseResult(firstOperand ** secondOperand);
        updateInputs();
        break;
    }
  }
}


function isValid(operand) {
  if (typeof operand === 'undefined' || operand === null) {
    return false;
  } else {
    return true;
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
        return 'multiply';
      case '/':
        return 'divide';
      case '^':
        return 'power';
      case '=':
      case 'Enter':
        return 'equals';
    }
  } else {
    return event.target.getAttribute('id');
  }
}


function handleEquals(operator) {
  if (operator === 'equals') {
    if (secondOperandQueued) {
      secondOperand = parseFloat(display.value);
      secondOperandQueued = false;
      resetDisplay = true;
    }
    return;
  } else if (operator !== 'equals' && currentOperator && secondOperandQueued) {
    nextOperator = operator;
  }
}


function updateInputs() {
  display.value = result;
  firstOperand = result;
  result = null;
  secondOperand = null;
  currentOperator = nextOperator;
  nextOperator = null;
}


function blinkOnce(event) {
  let isOperator = /[\+\-\*\/\^\=]|Enter/.test(event.key);

  if (event.target.id === 'display') {
    if (!isOperator) { 
      return; 
    } else {
      display.classList.add('blink');
      setTimeout(() => {
        display.classList.remove('blink');
      }, 60)    
    }
  } else {
    display.classList.add('blink');
    setTimeout(() => {
      display.classList.remove('blink');
    }, 60)  
  }
}


function moveCursorEnd() {
  let cursorIndex= display.value.length + 1;

  display.setSelectionRange(cursorIndex, cursorIndex);
}


function highlightDisplay() {
  display.classList.add('highlight-display');
  setTimeout(() => {
    display.classList.remove('highlight-display');
  }, 50)  
}