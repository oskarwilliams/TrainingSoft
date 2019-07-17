const classes = require('./classes');
const Person = classes.Person;
const File = classes.File;
const log4js = require('log4js');
const fs = require('fs');
const moment = require('moment');
const readlineSync = require('readline-sync');
const importer = require('./importer');

const desiredDateFormat = 'DD/MM/YYYY';

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'trace' }
    }
});

const logger = log4js.getLogger('file');

function isBlankOrWhitespace(a) {
    return (a === '' || a === ' ');
}

function errorLogging(SingleTransaction) {
    let ans = 0;
    if (isNaN(SingleTransaction.Amount)) {
        logger.error(`${SingleTransaction.Amount}        Should be a number, transaction was on ${SingleTransaction.Date}`);
        ans = 1;
    }
    if ((SingleTransaction.Date).format(desiredDateFormat) === 'Invalid date') {
        logger.error(`${(SingleTransaction.Date).format(desiredDateFormat)}        Should be a date, transaction was on ${SingleTransaction.Date}`);
        ans = 1;
    }
    if (isBlankOrWhitespace(SingleTransaction.ToAccount)) {
        logger.error(`Is only whitespace or empty for debtor, transaction was on ${SingleTransaction.Date}`);
        ans = 1;
    }
    if (isBlankOrWhitespace(SingleTransaction.FromAccount)) {
        logger.error(`Is only whitespace or empty for debtee, transaction was on ${SingleTransaction.Date}`);
        ans = 1;
    }
    if (isBlankOrWhitespace(SingleTransaction.Narrative)) {
        logger.error(`Is only whitespace or empty for narrative, transaction was on ${SingleTransaction.Date}`);
        ans = 1;
    }
    return ans;
}

function getEmptyAccountList(name) {
    const totaldebt = 0;
    const debtor = [];
    const transaction = [];
    const date = [];
    const narrative = [];
    return new Person(name, totaldebt, debtor, transaction, date, narrative);
}

function getNames(TransactionList) {
    const names = [];
    for (let i = 0; i < TransactionList.length; i++) {
        if (!names.includes(TransactionList[i].FromAccount)) {
            names.push(TransactionList[i].FromAccount);
        }
    }
    return names;
}

function populateAccountList(EmptyAccountList, TransactionList) {
    const AccountList = EmptyAccountList;
    TransactionList.forEach(SingleTransaction => {
        if (errorLogging(SingleTransaction) === 1) {
            logger.error(`${i + 1} this line was in error so was ignored`);
            console.log(`${i + 1} this line was in error so was ignored`);
        } else {
            const Amount = Number(SingleTransaction.Amount);
            if (isNaN(Amount)) { console.log(SingleTransaction.Amount); }
            const DebteeIndex = AccountList.findIndex(P => P.Name === SingleTransaction.FromAccount);
            AccountList[DebteeIndex].Debtor.push(SingleTransaction.ToAccount);
            AccountList[DebteeIndex].Transaction.push(Amount);
            AccountList[DebteeIndex].Date.push(SingleTransaction.Date);
            AccountList[DebteeIndex].Narrative.push(SingleTransaction.Narrative);

            const DebtorIndex = AccountList.findIndex(P => P.Name === SingleTransaction.ToAccount);
            AccountList[DebtorIndex].Debtor.push(SingleTransaction.FromAccount);
            AccountList[DebtorIndex].Transaction.push(-Amount);
            AccountList[DebtorIndex].Date.push(SingleTransaction.Date);
            AccountList[DebtorIndex].Narrative.push(SingleTransaction.Narrative);
        }
    });
    return AccountList;
}

function getAccountList(TransactionList) {
    const names = getNames(TransactionList);
    const EmptyAccountList = [];
    names.forEach(name => EmptyAccountList.push(getEmptyAccountList(name))
    );
    let AccountList = populateAccountList(EmptyAccountList, TransactionList);
    return AccountList
}

function listAll(AccountList) {
    AccountList.forEach((Account) => {
        console.log(`Name: ${Account.Name} -- Debt: ${(Account.Debt).toFixed(2)}`);
    });
}

function listAccount(AccountList) {
    const AccountName = readlineSync.question('Whose account would you like to look at?   ');
    const Account = AccountList.find(P => P.Name === AccountName);
    if (Account === undefined) {
        console.log('That is not a correct name, please try again.   ');
        listAccount(AccountList);
        return;
    };
    for (let i = 0; i < Account.Debtor.length; i++) {
        console.log(`Date: ${Account.Date[i].format(desiredDateFormat)} -- Name: ${Account.Debtor[i]} -- Debt: ${(Account.Transaction[i]).toFixed(2)} -- Description: ${Account.Narrative[i]}`);
    }
}

function getExportFileSetup(AccountList) {
    const ExportFileSetup = new File;
    ExportFileSetup.Name = readlineSync.question('What is the desired filename?    ');
    ExportFileSetup.Name.replace(/\s/g, "");
    ExportFileSetup.Data = AccountList
    ExportFileSetup.DateFormat = readlineSync.question('What is the desired Date format? (Will default to "DD/MM/YYYY" if empty)    ');
    if (ExportFileSetup.DateFormat === ''){
        ExportFileSetup.DateFormat = 'DD/MMM/YYYY'
    }
    return ExportFileSetup
}

function exportAccountList(AccountList) {
    ExportFileSetup = getExportFileSetup(AccountList);
    const jsonExport = JSON.stringify(ExportFileSetup.Data)
    fs.writeFileSync('Outputs/' + ExportFileSetup.Name + '.json', jsonExport)
}


async function doTheJob() {
    logger.trace('=======START=======');
    console.log('======WELCOME=======\nWhat function would you like to perform?\nIMPORT a new file\nCLEAR all stored data\nLIST ALL account balances\nLIST the transactions for an account\nEXPORT the transcations to a file')
    const desiredFunction = (readlineSync.prompt()).toLowerCase()
    switch (desiredFunction){
        case 'import':
            let TransactionList = await importer.getUnparsedTransactionList();
            FullTransactionList = FullTransactionList.concat(TransactionList);
            AccountList = await getAccountList(FullTransactionList);
            break
        case 'clear':
            FullTransactionList.splice(0, FullTransactionList.length);
            AccountList.splice(0, AccountList.length)
            break
        case 'list all':
            listAll(AccountList);
            break
        case 'list':
            listAccount(AccountList);
            break
        case 'export':
            exportAccountList(AccountList);
            break
        default:
            console.log('That is not a valid instruction, please try again.   ')
            break
    }
    logger.trace('=======END=======');
    console.log('\n\n\n\n')
    doTheJob()
}

let AccountList = []
let FullTransactionList = []
doTheJob()