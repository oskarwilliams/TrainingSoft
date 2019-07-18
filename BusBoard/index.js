const request = require('request-promise');
const readlineSync = require ('readline-sync');
const classes = require('./classes');
const Bus = classes.Bus;

const stopCode = readlineSync.question('What is the stopcode?  ');

const url = `https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=f9b3dd07&app_key=%89faa5803f90f1a589d6f12b34120bd1`;


async function doTheThing() {
    let arrivalsList;
    let busList = [];
    arrivalsList = await request(url, function (error, response, body) {
        return body ;
    });
    arrivalsList = await JSON.parse(arrivalsList);
    arrivalsList.forEach(arrival => {
        let bus = new Bus(arrival.vehicleId, arrival.lineName, arrival.timeToStation, arrival.destinationName);
        busList.push(bus);
    });

    console.log(busList);

}

doTheThing();