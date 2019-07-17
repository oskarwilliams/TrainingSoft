const fs = require('fs').promises;
const moment = require('moment');
const readlineSync = require('readline-sync');
const log4js = require('log4js');
const parseXML = require('xml-js');
const neatCsv = require('neat-csv');
const classes = require('./classes');

const Transaction = classes.Transaction;

const logger = log4js.getLogger('file');

const UnparsedTransactionList = classes.UnparsedTransactionList;

async function defaultFromXML(string) {
    const jsonXMLString = await parseXML.xml2json(string, { compact: true, spaces: 4 });
    const unhelpfulResults = (await JSON.parse(jsonXMLString)).TransactionList.SupportTransaction;
    const TransactionList = [];
    unhelpfulResults.forEach(function (badTransaction) {
        const transaction = new Transaction;
        transaction.Date = moment('31/12/1899', 'DD/MM/YYYY').add(badTransaction._attributes.Date, 'days');
        transaction.FromAccount = badTransaction.Parties.From._text;
        transaction.ToAccount = badTransaction.Parties.To._text;
        transaction.Narrative = badTransaction.Description._text;
        transaction.Amount = badTransaction.Value._text;

        TransactionList.push(transaction);
    });
    return TransactionList;
}

async function defaultFromCSV(string) {
    const unhelpfulResults = await neatCsv(string)
    const TransactionList = [];
    unhelpfulResults.forEach(function (badTransaction) {
        const transaction = new Transaction;
        transaction.Date = moment(badTransaction.Date,'DD/MM/YYYY');
        transaction.FromAccount = badTransaction.From;
        transaction.ToAccount = badTransaction.To;
        transaction.Narrative = badTransaction.Narrative;
        transaction.Amount = badTransaction.Amount;

        TransactionList.push(transaction);
    });
    return TransactionList;
}

async function defaultFromJSON(string) {
    const unhelpfulResults = await JSON.parse(string)
    const TransactionList = [];
    unhelpfulResults.forEach(function (badTransaction) {
        const transaction = new Transaction;
        transaction.Date = moment(badTransaction.Date);
        transaction.FromAccount = badTransaction.FromAccount;
        transaction.ToAccount = badTransaction.ToAccount;
        transaction.Narrative = badTransaction.Narrative;
        transaction.Amount = badTransaction.Amount;

        TransactionList.push(transaction);
    });
    return TransactionList;
}


async function readCSVFile(stringFile) {
    const TransactionList = defaultFromCSV(stringFile);
    logger.trace('Inputs: ');
    logger.trace(TransactionList);
    return TransactionList;
}

async function readJSONFile(stringFile) {
    const TransactionList = defaultFromJSON(stringFile)
    logger.trace('Inputs: ');
    logger.trace(TransactionList);
    return TransactionList;
}

async function readXMLFile(stringFile) {
    const TransactionList = await defaultFromXML(stringFile);
    logger.trace('Inputs: ');
    logger.trace(TransactionList);
    return TransactionList;
}

async function getUnparsedTransactionList() {
    const csvOrJson = readlineSync.question('What is the filename?  ');
    csvOrJson.replace(/\s/g, "");
    try {
        const stringFile = await fs.readFile(`Data/${csvOrJson}`, 'utf-8');
        if (csvOrJson.includes('.csv')) {
            return TransactionList = await readCSVFile(stringFile);
        } else if (csvOrJson.includes('.json')) {
            return TransactionList = await readJSONFile(stringFile);
        } else if (csvOrJson.includes('.xml')) {
            return TransactionList = await readXMLFile(stringFile);
        } else {
            console.log('This can only accept .csv, .json, and .xml, please try one of these filetypes.   ');
            return getUnparsedTransactionList();
        }
    } catch {
        console.log('That is an incorrect file ending or name, please try again.  ');
        return getUnparsedTransactionList();
    }
}

exports.getUnparsedTransactionList = getUnparsedTransactionList;