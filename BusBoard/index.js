// const request = require('request-promise');
const Console = require('./console');
const website = require('./website');
const readlineSync = require('readline-sync');

function run(){
    const consoleOrWebsite = readlineSync.question('Console or Website? (C/W)    ');
    if (consoleOrWebsite === 'C'){        
        return Console.runConsole();
    } else if (consoleOrWebsite === "W") {
        return website.runWebsite();
    } else {
        console.log(' Not a valid option, please try again.   ');
        return run();
    }
}

run();