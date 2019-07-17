class Person {
    constructor(Name, Debt, Debtor, Transaction, Date, Narrative) {
        this.Name = Name;
        this.Debtor = Debtor;
        this.Transaction = Transaction;
        this.Date = Date;
        this.Narrative = Narrative;
    }

    get Debt() {
        return this.calcDebt();
    }

    calcDebt() {
        return this.Transaction.reduce((accumulator, currentValue) => accumulator + currentValue);
    }
}

class UnparsedTransactionList{
    constructor(Format, Data, DateFormat) {
    this.Format = [];
    this.Data = [];
    this.DateFormat = '';
    }
}

class JSONmimic{
    constructor(Date, FromAccount, ToAccount, Narrative, Amount) {
    this.Date = Date;
    this.FromAccount = '';
    this.ToAccount = '';
    this.Narrative = '';
    this.Amount = '';
    }
}

exports.Person = Person;
exports.UnparsedTransactionList = UnparsedTransactionList;
exports.JSONmimic = JSONmimic;