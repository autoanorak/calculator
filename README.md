# odin-calculator

Bugs
- When user clicks an operator before entering a number, the "0" placeholder should become the first operand. Right now the first operand becomes NaN because the parseFloat(display.value) is not the number zero
- When display flashes after performing an operation, the pre-operation number is briefly visible 

Features to add:
- add feature to show history of operations
- use mono-spaced font for calculator display and buttons