const readlineSync = require('readline-sync');
const processing = require('./processing');

function printBusLists(busLists, stopList) {
    const numberOfStops = readlineSync.question('How many bus stops do you want to view?     ');
    for (let i = 0; i<numberOfStops; i++){
        try {
            console.log('\n\n');
            console.log(stopList[i].name + '\n');
            console.table(busLists[i], ['line', 'timeToStationMins', 'destination']);
        } catch(e) {
            console.log(`There are only ${i+1} stops within 500 metres of this postcode`);
            break;
        }
    }
}

async function runConsole() {
    const postCode = readlineSync.question('What is the postcode?    ');
    const stopList = await processing.getStopList(postCode);
    const busLists = await processing.getSortedBusLists(stopList);
    printBusLists(busLists, stopList);
    console.log('\n\n');
}

exports.runConsole = runConsole;
