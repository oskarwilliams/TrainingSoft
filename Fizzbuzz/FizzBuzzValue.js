exports.Calculate = function (i, rules) {
    const s = []
    if (i % 3 == 0 && rules.includes(3)) {
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