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
let resetDisplay = true;
let operand;
let operator;
let result;

function manipulateDisplay(event) {  
  let buttonContent = event.target.textContent;
  let contentForDisplay = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.',
  ];

  if (resetDisplay && runningDisplay[0]) {
    display.value = '';
    resetDisplay = false;
  }

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
  let operator;
  let currentOperator = event.target.getAttribute('id');

  if (!runningDisplay[0]) {
    operand = parseFloat(display.value);
    runningDisplay.push(operand, currentOperator);
    console.log(`if (!runningDisplay[0] -- ${runningDisplay}`);
    return;
  } else {
    operand = parseFloat(display.value);
    operator = runningDisplay[1];
    runningDisplay.push(operand);
    resetDisplay = true;
    console.log(`if (!runningDisplay[0] ... else -- ${runningDisplay}`);
  }


  switch (operator) {
    case 'add':
      result = runningDisplay[0] + runningDisplay[2];
      display.value = result;
      resetDisplay = true;
      runningDisplay = [];
      runningDisplay.push(result, currentOperator);
      console.log(`switch (operator) case 'add' -- ${runningDisplay}`);
      break;
    case 'subtract':
      result = runningDisplay[0] - runningDisplay[2];
      display.value = result;
      resetDisplay = true;
      runningDisplay = [];
      runningDisplay.push(result, currentOperator);
      console.log(`switch (operator) case 'subtract' -- ${runningDisplay}`);
      break;
    case 'multiply':
      result = runningDisplay[0] * runningDisplay[2];
      display.value = result;
      resetDisplay = true;
      runningDisplay = [];
      runningDisplay.push(result, currentOperator);
      console.log(`switch (operator) case 'multiply' -- ${runningDisplay}`);

      break;
    case 'divide':
      result = runningDisplay[0] / runningDisplay[2];
      display.value = result;
      resetDisplay = true;
      runningDisplay = [];
      runningDisplay.push(result, currentOperator);
      console.log(`switch (operator) case 'divide' -- ${runningDisplay}`);
      break;
    case 'equals':
      result = runningDisplay[0];
      display.value = result;
      resetDisplay = true;
      runningDisplay = [];
      runningDisplay.push(result, currentOperator);
      console.log(`switch (operator) case 'equals' -- ${runningDisplay}`);
      break;
  }
}

