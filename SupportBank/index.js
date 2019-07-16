const classes = require('./classes');
const Person = classes.Person;
const neatCsv = require('neat-csv');
const fs = require('fs').promises;
const moment = require('moment');
const readlineSync = require('readline-sync');
const log4js = require('log4js')

const dataDateFormat = 'DD/MM/YYYY'
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
    //=> [{type: 'unicorn', part: 'horn'}, {type: 'rainbow', part: 'pink'}]
};

function isBlankOrWhitespace(a) {
    return (a === '' || a === ' ');
}

function extractNames(a) {
    let names = [];
    for (let i = 0; i < a.length; i++) {
        if (!names.includes(a[i]['From'])) {
            names.push(a[i]['From']);
        }
    }
    return names
}

function errorLogging(debt, date, debtor, debtee, narrative) {
    let ans = 0
    if (isNaN(debt)) {
        logger.error(debt + '        Should be a number, transaction was on ' + date);
        ans = 1;
    }
    if (moment(date, dataDateFormat).format(desiredDateFormat) === 'Invalid date') {
        logger.error(moment(date, dataDateFormat).format(desiredDateFormat) + '        Should be a date, transaction was on ' + date);
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

function nameToAccount(name, data) {
    let totaldebt = 0;
    let debtor = [];
    let transaction = [];
    let date = [];
    let narrative = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].To === name || data[i].From === name) {
            let debt = 0;
            if (errorLogging(Number(data[i].Amount), data[i].Date, data[i].To, data[i].From, data[i].Narrative) === 1) {
                logger.error(i+1 + ' this line was in error so was ignored');
                console.log(i+1 + ' this line was in error so was ignored');
            } else {
                if (data[i].From === name) {
                    debt = Number(data[i].Amount);
                    debtor.push(data[i].To);
                };
                if (data[i].To === name) {
                    debt = -Number(data[i].Amount);
                    debtor.push(data[i].From);
                };
                transaction.push(debt);
                date.push(moment(data[i].Date, dataDateFormat));
                narrative.push(data[i].Narrative)
            }
            totaldebt += debt;
        }
    };
    return new Person(name, totaldebt.toFixed(2), debtor, transaction, date, narrative)
}

function createPeople(data) {
    const names = extractNames(data)
    let People = []
    names.forEach(name => {
        return People.push(nameToAccount(name, data))
    });
    return People
}

function listAll(People) {
    People.forEach(element => {
        console.log(`Name: ${element.Name} -- Debt: ${element.Debt}`);
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
        console.log(`Date: ${Account.Date[i].format(desiredDateFormat)} -- Name: ${Account.Debtor[i]} -- Debt: ${Account.Transaction[i]} -- Narrative: ${Account.Narrative[i]}`)
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


async function doTheJob() {
    logger.trace('=======START=======');
    const data = await readCSVFile('Data/DodgyTransactions2015.csv');
    const People = createPeople(data);
    const usedFunction = getFunction();
    usedFunction(People)
    logger.trace('=======END=======');
}

doTheJob();
