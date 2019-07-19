const request = require('request-promise-native');

const classes = require('./classes');
const Bus = classes.Bus;
const Stop = classes.Stop;


class PostCodeAPI {
    async getLatLon(postCode) {
        const endpoint = 'postcodes/' + postCode;
        const data = await this.makeRequest(endpoint);
        return [data.result.latitude, data.result.longitude];
    }
    makeRequest(endpoint) {
        const options = {
            url: 'http://api.postcodes.io/' + endpoint,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return request(options);
    }
}

class TflAPI {
    constructor(appid, appkey) {
        this.appid = appid;
        this.appkey = appkey;
    }
    async getBusList(stopCode) {
        const endpoint = 'StopPoint/' + stopCode + '/Arrivals';
        const busList = [];
        const arrivalsList = await this.makeRequest(endpoint);
        arrivalsList.forEach(arrival => {
            const bus = new Bus(arrival.vehicleId, arrival.lineName, arrival.timeToStation, arrival.destinationName);
            busList.push(bus);
        });
        return busList;
    }

    async getStopList(latLon) {
        const radius = 400;
        const endpoint = 'StopPoint';
        const queries = {
            'radius': radius,
            'stopTypes': 'NaptanOnstreetBusCoachStopPair,NaptanOnstreetBusCoachStopCluster',
            'modes': 'bus',
            'lat': latLon[0],
            'lon': latLon[1]
        };
        const stopCodeData = await this.makeRequest(endpoint, queries);
        const stopList = [];
        await stopCodeData.stopPoints.forEach(stop => {
            const stopPoint = new Stop(stop.children[0].id, stop.children[0].commonName, stop.children[0].stopLetter, stop.distance);
            stopList.push(stopPoint);
        });
        return stopList;
    }

    makeRequest(endpoint, queries) {
        const options = {
            url: 'https://api.tfl.gov.uk/' + endpoint,
            qs: {
                app_id: this.appid,
                app_key: this.appkey,
                ...queries
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        return request(options);
    }
}

exports.TflAPI = TflAPI;
exports.PostCodeAPI = PostCodeAPI;