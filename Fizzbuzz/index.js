var readlineSync = require('readline-sync')

function getMaxnum(){
    const maxnum = Number(readlineSync.question('What is the maximum number?  '));
    if (isNaN(maxnum)){
        console.log('That is not a valid integer, please try again.')
        return getMaxnum()
    }
    return maxnum
}


function FizzBuzz(i,rules) {
    let s = []
    if (i % 3 == 0 && rules.includes(3)){
        s.push('Fizz')        
    }
    if (i % 13 == 0 && rules.includes(13)) {
        s.push('Fezz')
    }
    if (i % 5 == 0 && rules.includes(5)) {
        s.push('Buzz')
    }
    if (i % 7 == 0 && rules.includes(7)) {
        s.push('Bang')
    }
    if (i % 11 == 0 && rules.includes(11)) {
        s = ['Bong']
    }
    if (i % (11 * 13) == 0 && rules.includes(11) && rules.includes(13)) {
        s = ['FezzBong']
    }
    if (i % 17 == 0 && rules.includes(17)) {
        s.reverse()
    }
    if (s.length == 0) {
        s = [i]
    }
    return s    
}


const maxnum = getMaxnum()
const rules = readlineSync.question('What number rules do you want? (separate by commas)  ').split(',').map(Number);
console.log(rules)
for (let i = 1; i < +maxnum + 1; i++){
    console.log(FizzBuzz(i,rules).join(''))
}