const FizzBuzzValue = require('./FizzBuzzValue');
const checks = [[10, [3, 5], ['Buzz']], [21, [3, 7], ['Fizz', 'Bang']], [33, [11, 3], ['Bong']], [65, [5, 13], ['Fezz', 'Buzz']]]

checks.forEach((k) => {
    test('checks ' + k[0] + ' with rules ' + k[1], () => {
        expect(FizzBuzzValue.Calculate(k[0], k[1])).toEqual(k[2]);
    })
})