// const request = require('request-promise');
const readlineSync = require('readline-sync');
const API = require('./API');
const TflAPI = API.TflAPI;
const PostCodeAPI = API.PostCodeAPI;

const tflAPI = new TflAPI('f9b3dd07', '89faa5803f90f1a589d6f12b34120bd1');

function compare(a, b) {
    if (a.timeToStation < b.timeToStation) {
        return -1;
    }
    if (a.timeToStation > b.timeToStation) {
        return 1;
    }
    return 0;
}

async function getStopList() {
    const postCodeAPI = new PostCodeAPI;
    const latLon = await postCodeAPI.getLatLon();
    return await tflAPI.getStopList(latLon);
}

async function getSortedBusLists(stopList) {
    const busLists = [];
    for (let i = 0; i < stopList.length; i++) {
        const busList = await tflAPI.getBusList(stopList[i].id);
        busLists.push(busList.sort(compare));
    }
    return busLists;
}

function printBusLists(busLists, stopList) {
    const numberOfStops = readlineSync.question('How many bus stops do you want to view?     ');
    for (let i = 0; i<numberOfStops; i++){
        try {
            console.log('\n\n');
            console.log(stopList[i].name + '\n');
            console.table(busLists[i], ['line', 'timeToStationMins', 'destination']);
        } catch {
            console.log(`There are only ${i+1} stops within 500 metres of this postcode`)
            break;
        }
    }
}

async function go() {
    const stopList = await getStopList();
    const busLists = await getSortedBusLists(stopList);
    printBusLists(busLists, stopList);
    console.log('\n\n');
}

go();