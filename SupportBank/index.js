const classes = require('./classes');
const Person = classes.Person;
const log4js = require('log4js');
const fs = require('fs').promises;
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

function errorLogging(df, Format, DateFormat) {
    let ans = 0;
    if (isNaN(df[Format[4]])) {
        logger.error(`${df[Format[4]]}        Should be a number, transaction was on ${df[Format[0]]}`);
        ans = 1;
    }
    if (moment(df[Format[0]], DateFormat).format(desiredDateFormat) === 'Invalid date') {
        logger.error(`${moment(df[Format[0]], DateFormat).format(desiredDateFormat)}        Should be a date, transaction was on ${df[Format[0]]}`);
        ans = 1;
    }
    if (isBlankOrWhitespace(df[Format[2]])) {
        logger.error(`Is only whitespace or empty for debtor, transaction was on ${df[Format[0]]}`);
        ans = 1;
    }
    if (isBlankOrWhitespace(df[Format[1]])) {
        logger.error(`Is only whitespace or empty for debtee, transaction was on ${df[Format[0]]}`);
        ans = 1;
    }
    if (isBlankOrWhitespace(df[Format[3]])) {
        logger.error(`Is only whitespace or empty for narrative, transaction was on ${df[Format[0]]}`);
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

function getNames(df) {
    const names = [];
    for (let i = 0; i < (df.Data).length; i++) {
        if (!names.includes(df.Data[i][df.Format[1]])) {
            names.push(df.Data[i][df.Format[1]]);
        }
    }
    return names;
}

function populateAccountList(EmptyAccountList, DataAndFormat) {
    DataAndFormat.Data.forEach(SingleTransaction => {
        if (errorLogging(SingleTransaction, DataAndFormat.Format, DataAndFormat.DateFormat) === 1) {
            logger.error(`${i + 1} this line was in error so was ignored`);
            console.log(`${i + 1} this line was in error so was ignored`);
        } else {
            const Amount = Number(SingleTransaction[DataAndFormat.Format[4]]);
            if (isNaN(Amount)) { console.log(SingleTransaction[DataAndFormat.Format[4]]); }
            const DebteeIndex = EmptyAccountList.findIndex(P => P.Name === SingleTransaction[DataAndFormat.Format[1]]);
            EmptyAccountList[DebteeIndex].Debtor.push(SingleTransaction[DataAndFormat.Format[2]]);
            EmptyAccountList[DebteeIndex].Transaction.push(Amount);
            EmptyAccountList[DebteeIndex].Date.push(moment(SingleTransaction[DataAndFormat.Format[0]], DataAndFormat.DateFormat));
            EmptyAccountList[DebteeIndex].Narrative.push(SingleTransaction[DataAndFormat.Format[3]]);

            const DebtorIndex = EmptyAccountList.findIndex(P => P.Name === SingleTransaction[DataAndFormat.Format[2]]);
            EmptyAccountList[DebtorIndex].Debtor.push(SingleTransaction[DataAndFormat.Format[1]]);
            EmptyAccountList[DebtorIndex].Transaction.push(-Amount);
            EmptyAccountList[DebtorIndex].Date.push(moment(SingleTransaction[DataAndFormat.Format[0]], DataAndFormat.DateFormat));
            EmptyAccountList[DebtorIndex].Narrative.push(SingleTransaction[DataAndFormat.Format[3]]);
        }
    });
    return EmptyAccountList;
}

function getAccountList(DataAndFormat) {
    const names = getNames(DataAndFormat);
    const EmptyAccountList = [];
    names.forEach(name => EmptyAccountList.push(getEmptyAccountList(name))
    );
    let AccountList = populateAccountList(EmptyAccountList, DataAndFormat);
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


function viewAccountList(AccountList) {
    const whichFunction = readlineSync.question('Would you like to list all total debts or the details for a single account?[A/S]   ');
    if (whichFunction === 'A') {
        listAll(AccountList);
        return;
    } else if (whichFunction === 'S') {
        listAccount(AccountList);
        return;
    } else {
        console.log('That is not a valid choice, please try again');
        viewAccountList();
        return;
    }
}


async function doTheJob() {
    logger.trace('=======START=======');
    console.log('======WELCOME=======')
    const DataAndFormat = await importer.getUnparsedTransactionList();
    const AccountList = await getAccountList(DataAndFormat);
    viewAccountList(AccountList);
    exportAccountList(AccountList);
    logger.trace('=======END=======');
    doTheJob()
}

doTheJob()