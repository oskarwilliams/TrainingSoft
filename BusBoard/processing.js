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

async function getStopList(postCode) {
    const postCodeAPI = new PostCodeAPI;
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

exports.getStopList = getStopList;
exports.getSortedBusLists = getSortedBusLists;