class Bus{
    constructor(id, line, timeToStation, destination){
        this.id = id;
        this.line = line;
        this.timeToStation = timeToStation;
        this.destination = destination;
    }

    get goodTime() {
        let minutes = Math.floor(this.timeToStation / 60);
        let seconds = this.timeToStation - minutes * 60;
        if (seconds<10){seconds = '0' + seconds;}
        return minutes + ':' + seconds;
    }
}

exports.Bus = Bus;