const neatCsv = require('neat-csv');
const fs = require('fs').promises;

async function readCSVFile(a) {
    let results = (await neatCsv(await fs.readFile(a, 'utf-8')));
    return results
    //=> [{type: 'unicorn', part: 'horn'}, {type: 'rainbow', part: 'pink'}]
};

class Person {
    constructor(Name , Debt) {    
      this.Name = Name;
      this.Debt = Debt;
    }
  }

async function doTheJob(){
    const Transactions = await readCSVFile('Transactions2014.csv')





    console.log(Transactions.length)
}



doTheJob();