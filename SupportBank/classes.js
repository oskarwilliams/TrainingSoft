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

class Transaction{
    constructor(Date, FromAccount, ToAccount, Narrative, Amount) {
    this.Date = Date;
    this.FromAccount = FromAccount;
    this.ToAccount = ToAccount;
    this.Narrative = Narrative;
    this.Amount = Amount;
    }
}

class File{
    constructor(Name,Data,DateFormat) {
    this.Name = Name;
    this.Data = Data;
    this.DateFormat = DateFormat;
    }
}

exports.Person = Person;
exports.Transaction = Transaction;
exports.File = File;