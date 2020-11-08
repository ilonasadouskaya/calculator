class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = undefined;
        this.readyToReset = false;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.readyToReset === true) {
            this.currentOperand = '';
            this.readyToReset = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand.length === 17) return;
        this.currentOperand = `${this.currentOperand}${number}`;
        this.updateDisplay();
    }

    processMinusButton() {
        if (this.currentOperand === '-') return;
        if (this.currentOperand === '') {
            this.appendNumber('-');
        } else {
            this.chooseOperation('-');
        }
    }

    chooseOperation(operation) {
        if ((this.operation === '√' && this.currentOperand === '' && this.previousOperand !== '')
            || (this.currentOperand !== '' && this.previousOperand !== '')) {
                this.compute();
        }
        if (this.currentOperand === '') return;
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        this.operation = operation;
        if (this.operation === 'x<sup>y</sup>') this.operation = '^';
        this.previousOperand = `${this.currentOperand} ${this.operation}`;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computed;
        if (this.operation === '') return;
        if (this.currentOperand === '-') return;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev)) return;
        switch(this.operation) {
            case '-':
                computed = prev - current;
                break;
            case '+':
                computed = prev + current;
                break;
            case '*':
                computed = prev * current;
                break;
            case '÷':
                computed = prev / current;
                break;
            case '^':
                computed = prev ** current;
                break;
            case '√':
                if (prev < 0 || isNaN(prev)) {
                    computed = 'Error';
                } else {
                    computed = Math.sqrt(prev);
                }
                break;
            default:
                return;
        }
        this.readyToReset = true;
        this.currentOperand = computed.toString().substr(0, 17);
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    updateDisplay() {
        this.previousOperandTextElement.innerHTML = this.previousOperand;
        this.currentOperandTextElement.innerHTML = this.currentOperand;
    }
}

const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const allClearButton = document.querySelector('[data-all-clear');
const deleteButton = document.querySelector('[data-delete]');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const minusButton = document.querySelector('[data-minus-button]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

allClearButton.addEventListener('click', () => {
    calculator.clear();
})

deleteButton.addEventListener('click', () => {
    calculator.delete();
})

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerHTML);
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerHTML);
    })
})

minusButton.addEventListener('click', () => {
    calculator.processMinusButton();
})

equalsButton.addEventListener('click', () => {
    calculator.compute();
})
