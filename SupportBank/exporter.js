const fs = require('fs');
const readlineSync = require('readline-sync');
const moment = require('moment')

const classes = require('./classes');
const File = classes.File;

function getExportFileSetup(AccountList) {
    const ExportFileSetup = new File;
    ExportFileSetup.Name = readlineSync.question('What is the desired filename?    ');
    ExportFileSetup.Name.replace(/\s/g, "");
    ExportFileSetup.Data = AccountList; 
    ExportFileSetup.DateFormat = readlineSync.question('What is the desired Date format? (Will default to moment format if empty)    ');
    ExportFileSetup.Data = ExportFileSetup.Data.map(Account => {
        Account.Date = Account.Date.map(date => moment(date).format(ExportFileSetup.DateFormat))
        return Account;
    }
    )
    return ExportFileSetup;
}

function exportAccountList(AccountList) {
    const ExportFileSetup = getExportFileSetup(AccountList);
    const jsonExport = JSON.stringify(ExportFileSetup.Data);
    fs.writeFileSync('Outputs/' + ExportFileSetup.Name + '.json', jsonExport);
}


exports.exportAccountList = exportAccountList;