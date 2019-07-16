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
    constructor(Format, Data) {
    this.Format = []
    this.Data = []
    }
}

exports.Person = Person;
exports.UnparsedTransactionList = UnparsedTransactionList;