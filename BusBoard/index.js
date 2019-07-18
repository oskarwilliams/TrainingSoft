// const request = require('request-promise');
const readlineSync = require('readline-sync');
const classes = require('./classes');
const Bus = classes.Bus;
const Stop = classes.Stop;
const Website = classes.Website;


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
    const postCode = readlineSync.question('What is the postcode?    ');
    postCode.replace(/\s/g, "");
    const websitePostCode = new Website('http://api.postcodes.io/postcodes/' + postCode);
    const postCodeData = await websitePostCode.getData();
    const lon = postCodeData.result.longitude;
    const lat = postCodeData.result.latitude;
    const radius = 300;
    const websiteStopCode = new Website(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopPair,NaptanOnstreetBusCoachStopCluster&radius=${radius}&modes=bus&lat=${lat}&lon=${lon}&app_id=f9b3dd07&app_key=89faa5803f90f1a589d6f12b34120bd1`);
    const stopCodeData = await websiteStopCode.getData();
    const stopList = [];
    await stopCodeData.stopPoints.forEach(stop => {
        const stopPoint = new Stop(stop.children[0].id, stop.children[0].commonName, stop.children[0].stopLetter, stop.distance);
        stopList.push(stopPoint);
    });
    return stopList;
}

async function getBusList(stopCode) {
    const website = new Website(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=f9b3dd07&app_key=%89faa5803f90f1a589d6f12b34120bd1`);
    const busList = [];
    const arrivalsList = await website.getData();
    arrivalsList.forEach(arrival => {
        const bus = new Bus(arrival.vehicleId, arrival.lineName, arrival.timeToStation, arrival.destinationName);
        busList.push(bus);
    });
    return busList;
}

async function getSortedBusLists(stopList) {
    const busLists = [];
    for (let i = 0; i < stopList.length; i++) {
        const busList = await getBusList(stopList[i].id);
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