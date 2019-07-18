const request = require('request-promise');

class Bus {
    constructor(id, line, timeToStation, destination) {
        this.id = id;
        this.line = line;
        this.timeToStation = timeToStation;
        this.destination = destination;
        this.timeToStationMins = this.getTimeToStationMins();
    }

    getTimeToStationMins() {
        let minutes = Math.floor(this.timeToStation / 60);
        let seconds = this.timeToStation - minutes * 60;
        if (seconds < 10) { seconds = '0' + seconds; }
        return (minutes + ':' + seconds);
    }
}

class Stop {
    constructor(id, name, letter, distance) {
        this.id = id;
        this.name = name;
        this.letter = letter;
        this.distance = distance;
    }
}

class Website {
    constructor(url) {
        this.url = url;
    }

    async getData() {
        let Data = await request(this.url, function (error, response, body) {
            return body;
        });
        return await JSON.parse(Data);
    }
}

exports.Bus = Bus;
exports.Stop = Stop;
exports.Website = Website;