class Person {
    constructor(Name, Debt, Debtor, Transaction, Date, Narrative) {
        this.Name = Name;
        this.Debtor = Debtor;
        this.Transaction = Transaction;
        this.Date = Date;
        this.Narrative = Narrative;
    }

    get Debt() {
        return this.Transaction.reduce((accumulator, currentValue) => accumulator + currentValue);
    }
}

class UnparsedTransactionList{
    constructor() {
    this.Format = [];
    this.Data = [];
    this.DateFormat = '';
    }
}

class JSONmimic{
    constructor(Date, FromAccount, ToAccount, Narrative, Amount) {
    this.Date = Date;
    this.FromAccount = FromAccount;
    this.ToAccount = ToAccount;
    this.Narrative = Narrative;
    this.Amount = Amount;
    }
}

exports.Person = Person;
exports.UnparsedTransactionList = UnparsedTransactionList;
exports.JSONmimic = JSONmimic;