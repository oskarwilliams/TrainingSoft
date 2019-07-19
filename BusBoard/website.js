const express = require('express');
const processing = require('./processing');
const app = express();
const port = 3000;
// app.static('public');

async function getResponse(params) {
    const postCode = params.departureBoards;
    const stopList = await processing.getStopList(postCode);
    const busLists = await processing.getSortedBusLists(stopList);
    const response = [];
    for (let i = 0; i<2; i++){
        response.push([stopList[i].name, busLists[i]]);
    }
    return response;

}

async function runWebsite() {
    console.log('Hi');
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    app.get('/departureBoards/:departureBoards', async function (req, res) {
        const response = await getResponse(req.params);
        res.send(response);
    });
    
}


exports.runWebsite = runWebsite;