var xhttp = new XMLHttpRequest();

function buttonSubmit() {

    var postCode = document.getElementById('postcode').value;

    xhttp.open('GET', 'http://localhost:3000/departureBoards?postcode=' + postCode, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function () {
        const stopNames = [];
        const busLists = [];
        const response = JSON.parse(xhttp.response);        
        let busString = '<h2>Results</h2>';
        for (let i = 0; i < response.length; i++) {
            stopNames.push(response[i][0]);
            busLists.push(response[i][1]);
        }
        for (let j = 0; j < response.length; j++) {
            busString = busString + `<h3>${stopNames[j]}</h3>''`;
            for (let i = 0 ; i < busLists[j].length; i++){
                const bus = busLists[j][i];
                console.log(bus);
                busString = busString + '<li>' + bus.timeToStationMins + ' minutes: ' + bus.line + ' to ' + bus.destination + '</li>' ;
            }
            busString = busString + '<ul></ul>';
        }
        console.log(busLists);
        document.getElementById("results").innerHTML = busString;
    };

    xhttp.send();
}
