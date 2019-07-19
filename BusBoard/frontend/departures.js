var xhttp = new XMLHttpRequest();

function buttonSubmit() {

    var postCode = document.getElementById('postcode').value;

    xhttp.open('GET', 'http://localhost:3000/departureBoards?postcode=' + postCode, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function () {
        const stopNames = [];
        const busLists = [];
        const response = JSON.parse(xhttp.response);
        let busString0 = '';
        let busString1 = '';
        for (let i = 0; i < response.length; i++) {
            stopNames.push(response[i][0]);
            busLists.push(response[i][1]);
        }
        for (let i = 0 ; i < busLists[0].length; i++){
            const bus = busLists[0][i];
            busString0 = busString0 + '<li>' + bus.timeToStationMins + ' minutes: ' + bus.line + ' to ' + bus.destination + '</li>';
        }
        for (let i = 0 ; i < busLists[1].length; i++) {
            const bus = busLists[1][i];
            busString1 = busString1 + '<li>' + bus.timeToStationMins + ' minutes: ' + bus.line + ' to ' + bus.destination + '</li>';
        }
        document.getElementById("results").innerHTML = `<h2>Results</h2>
        <h3>${stopNames[0]}</h3>
        <ul>${busString0}</ul>
        <h3>${stopNames[1]}</h3>
        <ul>${busString1}</ul>`;
    };

    xhttp.send();
}


exports.buttonSubmit = buttonSubmit;