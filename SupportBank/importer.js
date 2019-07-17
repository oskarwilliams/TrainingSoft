const fs = require('fs').promises;
const moment = require('moment');
const readlineSync = require('readline-sync');
const log4js = require('log4js');
const parseXML = require('xml-js');
const neatCsv = require('neat-csv');
const classes = require('./classes');

const JSONmimic = classes.JSONmimic;

const logger = log4js.getLogger('file');

const UnparsedTransactionList = classes.UnparsedTransactionList;

async function JSONfromXML(string) {
    const jsonString = await parseXML.xml2json(string, { compact: true, spaces: 4 });
    const unhelpfulResults = (await JSON.parse(jsonString)).TransactionList.SupportTransaction;
    const TransactionList = [];
    unhelpfulResults.forEach(function (badTransaction) {
        const Transaction = new JSONmimic;
        Transaction.Date = moment('31/12/1899', 'DD/MM/YYYY').add(badTransaction._attributes.Date, 'days');
        Transaction.FromAccount = badTransaction.Parties.From._text;
        Transaction.ToAccount = badTransaction.Parties.To._text;
        Transaction.Narrative = badTransaction.Description._text;
        Transaction.Amount = badTransaction.Value._text;

        TransactionList.push(Transaction);
    });
    return TransactionList;
}

async function readCSVFile(a) {
    const results = (await neatCsv(await fs.readFile(a, 'utf-8')));
    logger.trace('Inputs: ');
    logger.trace(results);
    return results;
}

async function readJSONFile(a) {
    const results = (await JSON.parse(await fs.readFile(a, 'utf-8')));
    console.log(results);
    logger.trace('Inputs: ');
    logger.trace(results);
    return results;
}

async function readXMLFile(a) {
    const xmlString = await fs.readFile(a, 'utf-8');
    const results = JSONfromXML(xmlString);
    logger.trace('Inputs: ');
    logger.trace(results);
    return results;
}

async function getUnparsedTransactionList() {
    const csvOrJson = readlineSync.question('What is the filename?  ');
    csvOrJson.replace(/\s/g, "");
    const DataAndFormat = new UnparsedTransactionList();
    try {
    if (csvOrJson.includes('.csv')) {
        DataAndFormat.Data = await readCSVFile(`Data/${csvOrJson}`);
        DataAndFormat.Format = ['Date', 'From', 'To', 'Narrative', 'Amount'];
        DataAndFormat.DateFormat = 'DD/MM/YYYY';
        return DataAndFormat;
    } else if (csvOrJson.includes('.json')) {
        DataAndFormat.Data = await readJSONFile(`Data/${csvOrJson}`);
        DataAndFormat.Format = ['Date', 'FromAccount', 'ToAccount', 'Narrative', 'Amount'];
        DataAndFormat.DateFormat = '';
        return DataAndFormat;
    } else if (csvOrJson.includes('.xml')) {
        DataAndFormat.Data = await readXMLFile(`Data/${csvOrJson}`);
        DataAndFormat.Format = ['Date', 'FromAccount', 'ToAccount', 'Narrative', 'Amount'];
        DataAndFormat.DateFormat = '';
        return DataAndFormat;
    } else {
        console.log('This can only accept .csv, .json, and .xml, please try one of these filetypes.   ');
        return getUnparsedTransactionList();
    }} catch {
        console.log('That is an incorrect file ending or name, please try again.  ');
        return getUnparsedTransactionList();
    }
}

exports.getUnparsedTransactionList = getUnparsedTransactionList;