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
    const postCode = readlineSync.question('What is the postcode?    ');
    const latLon = await postCodeAPI.getLatLon(postCode);
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

async function doTheThing() {
    const stopList = await getStopList();
    const busLists = await getSortedBusLists(stopList);
    console.log('\n\n');
    console.log(stopList[0].name + '\n');
    console.table(busLists[0], ['line', 'timeToStationMins', 'destination']);
    console.log('\n' + stopList[1].name + '\n');
    console.table(busLists[1], ['line', 'timeToStationMins', 'destination']);
}

doTheThing();