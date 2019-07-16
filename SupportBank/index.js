const neatCsv = require('neat-csv');
const fs = require('fs').promises;
const moment = require('moment')

async function readCSVFile(a) {
    let results = (await neatCsv(await fs.readFile(a, 'utf-8')));
    return results
    //=> [{type: 'unicorn', part: 'horn'}, {type: 'rainbow', part: 'pink'}]
};

function extractNames(a) {
    let names = [];
    for (let i = 0; i < a.length; i++) {
        if (!names.includes(a[i]['From'])) {
            names.push(a[i]['From']);
        }
    }
    return names
}

class Person {
    constructor(Name, Debt) {
        this.Name = Name;
        this.Debt = Debt;
    }
}

function createPeople(data) {
    const names = extractNames(data)
    let People = []
    names.forEach(element => {
        let debt = 0;
        for (let i = 0; i < data.length; i++){
            if (data[i]['From'] === element) {
                debt -= data[i]['Amount']
            };
            if (data)
        };
        return People.push(new Person(element, debt))
    });
    return People
}



async function doTheJob() {
    const data = await readCSVFile('Transactions2014.csv')
    
    const People = createPeople(data)
    console.log(People)

}



doTheJob();