const classes = require('./classes');
const Person = classes.Person;
const UnparsedTransactionList = classes.UnparsedTransactionList;
const neatCsv = require('neat-csv');
const fs = require('fs').promises;
const moment = require('moment');
const readlineSync = require('readline-sync');
const log4js = require('log4js')
const desiredDateFormat = 'DD/MM/YYYY'


log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'trace' }
    }
});

const logger = log4js.getLogger('file')

async function readCSVFile(a) {
    let results = (await neatCsv(await fs.readFile(a, 'utf-8')));
    logger.trace('Inputs: ')
    logger.trace(results);
    return results
};

async function readJSONFile(a) {
    let results = (await JSON.parse(await fs.readFile(a, 'utf-8')));
    logger.trace('Inputs: ')
    logger.trace(results);
    return results
};

function isBlankOrWhitespace(a) {
    return (a === '' || a === ' ');
}

function extractNames(df) {
    let names = [];
    for (let i = 0; i < (df.Data).length; i++) {
        if (!names.includes(df.Data[i][df.Format[1]])) {
            names.push(df.Data[i][df.Format[1]]);
        }
    }
    return names
}

function errorLogging(debt, date, debtor, debtee, narrative, DateFormat) {
    let ans = 0
    if (isNaN(debt)) {
        logger.error(debt + '        Should be a number, transaction was on ' + date);
        ans = 1;
    }
    if (moment(date, DateFormat).format(desiredDateFormat) === 'Invalid date') {
        logger.error(moment(date, DateFormat).format(desiredDateFormat) + '        Should be a date, transaction was on ' + date);
        ans = 1;
    }
    if (isBlankOrWhitespace(debtor)) {
        logger.error('Is only whitespace or empty for debtor, transaction was on ' + date);
        ans = 1;
    }
    if (isBlankOrWhitespace(debtee)) {
        logger.error('Is only whitespace or empty for debtee, transaction was on ' + date);
        ans = 1;
    }
    if (isBlankOrWhitespace(narrative)) {
        logger.error('Is only whitespace or empty for narrative, transaction was on ' + date);
        ans = 1;
    }
    return ans
}

function nameToAccount(name) {
    let totaldebt = 0;
    let debtor = [];
    let transaction = [];
    let date = [];
    let narrative = [];
    return new Person(name, totaldebt, debtor, transaction, date, narrative)
}

function AccountToPeople(Account,df){
    for (let i = 0; i < df.Data.length; i++) {
        
        if (errorLogging(Number(df.Data[i][df.Format[4]]), df.Data[i][df.Format[0]], df.Data[i][df.Format[2]], df.Data[i][df.Format[1]], df.Data[i][df.Format[3]],df.DateFormat) === 1) {
            logger.error(i+1 + ' this line was in error so was ignored');
            console.log(i+1 + ' this line was in error so was ignored');
        } else {
            let Amount = Number(df.Data[i][df.Format[4]]);
            if (isNaN(Amount)){ console.log(df.Data[i][df.Format[4]])}
            let DebteeIndex = Account.findIndex((P) => P.Name === df.Data[i][df.Format[1]]);
            Account[DebteeIndex].Debtor.push(df.Data[i][df.Format[2]]);
            Account[DebteeIndex].Transaction.push(Amount);
            Account[DebteeIndex].Date.push(moment(df.Data[i][df.Format[0]], df.DateFormat))
            Account[DebteeIndex].Narrative.push(df.Data[i][df.Format[3]]);

            let DebtorIndex = Account.findIndex((P) => P.Name === df.Data[i][df.Format[2]]);
            Account[DebtorIndex].Debtor.push(df.Data[i][df.Format[1]]);
            Account[DebtorIndex].Transaction.push(-Amount);
            Account[DebtorIndex].Date.push(moment(df.Data[i][df.Format[0]], df.DateFormat))
            Account[DebtorIndex].Narrative.push(df.Data[i][df.Format[3]]);
            
        }
    }
    return Account
}

function createPeople(df) {
    const names = extractNames(df);
    let Account = [];
    names.forEach(name => {
        return Account.push(nameToAccount(name));
    });
    return People = AccountToPeople(Account,df);
}

function listAll(People) {
    People.forEach(element => {
        console.log(`Name: ${element.Name} -- Debt: ${(element.Debt).toFixed(2)}`);
    })
}

function listAccount(People) {
    let AccountName = readlineSync.question('Whose account would you like to look at?   ');
    let Account = People.find((P) => P.Name === AccountName);
    if (Account === undefined) {
        console.log('That is not a correct name, please try again.   ');
        listAccount(People);
        return
    };
    for (let i = 0; i < Account.Debtor.length; i++) {
        console.log(`Date: ${Account.Date[i].format(desiredDateFormat)} -- Name: ${Account.Debtor[i]} -- Debt: ${(Account.Transaction[i]).toFixed(2)} -- Narrative: ${Account.Narrative[i]}`)
    }
}


function getFunction() {
    let whichFunction = readlineSync.question('Would you like to list all total debts or the details for a single account?[A/S]   ');
    let usedFunction = 0;
    if (whichFunction === 'A') {
        usedFunction = listAll;
    } else if (whichFunction === 'S') {
        usedFunction = listAccount;
    } else {
        console.log('That is not a valid choice, please try again')
        getFunction()
    }
    return usedFunction;
}

async function dataType() {
    const csvOrJson = readlineSync.question('CSV or JSON file? (C/J)   ');
    let df = new UnparsedTransactionList([],[]);
    if (csvOrJson === 'C'){
        df.Data = await readCSVFile('Data/Transactions2014.csv');
        df.Format = await ['Date','From','To','Narrative','Amount']
        df.DateFormat = 'DD/MM/YYYY'
        return df
    } else if (csvOrJson === 'J'){
        df.Data = await readJSONFile('Data/Transactions2013.json');
        df.Format = await ['Date','FromAccount','ToAccount','Narrative','Amount']
        df.DateFormat = ''
        return df
    } else {
        console.log('Not a valid option, please try again.  ')
        return dataType()
    }
}

async function doTheJob() {
    logger.trace('=======START=======');
    const df = await dataType();
    const People = createPeople(df);
    const usedFunction = getFunction();
    usedFunction(People)
    logger.trace('=======END=======');
}

doTheJob();
