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

let runningDisplay = [];
let firstOperand = null;
let secondOperand = null;
let result = null;

function manipulateDisplay(event) {  
  let buttonContent = event.target.textContent;
  let contentForDisplay = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.',
  ];

  if (event.target.getAttribute('id') === 'decimal') {
    if (display.value.split('').includes('.')) {
      return;
    }
    display.value += buttonContent;
  } else if (event.target.getAttribute('id') === 'clear') {
    display.value = '';
  } else if (contentForDisplay.includes(Number(buttonContent))) {
    display.value += buttonContent;
  }
}


function operate(event) {
  let currentOperator = event.target.getAttribute('id');
  
  if (firstOperand === null) {
    firstOperand = parseFloat(display.value);
    runningDisplay.push(firstOperand, currentOperator);
    return;
  } else {
    secondOperand = parseFloat(display.value);
    runningDisplay.push(secondOperand, currentOperator);
    console.log('else reached');
  }

  console.log(runningDisplay);

  let operator = runningDisplay[1];

  /* switch (operator) {
    case 'add':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
  } */
}

