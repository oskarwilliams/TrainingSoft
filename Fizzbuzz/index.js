const readlineSync = require('readline-sync')
const FizzBuzzValue = require('./FizzBuzzValue')

function getMaxnum() {
    const maxnum = Number(readlineSync.question('What is the maximum number?  '));
    if (isNaN(maxnum)) {
        console.log('That is not a valid integer, please try again.')
        return getMaxnum()
    }
    return maxnum
}

const maxnum = getMaxnum()
const rules = readlineSync.question('What number rules do you want? (separate by commas)  ').split(',').map(Number);
for (let i = 1; i < maxnum + 1; i++) {
    console.log(FizzBuzzValue.Calculate(i, rules).join(''))
}