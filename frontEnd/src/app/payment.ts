export class Payment {

  id: string;
  amount: number;
  date: number;
  description: string;
  sourceaccountid: string;
  destinationaccountid: string;


  constructor(id: string, amount: number, date: number, description: string, sourceaccountid: string, destinationaccountid: string ) {

    this.id = id; // This is used only for mock purposes.
    this.amount = amount;
    this.date = date;
    this.description = description;
    this.sourceaccountid = sourceaccountid;
    this.destinationaccountid = destinationaccountid;   

  }

}
