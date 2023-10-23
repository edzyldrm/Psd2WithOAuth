import { Component, OnInit, Input } from '@angular/core';
import { Payment } from '../payment';
import { Account } from '../account';
import { Tpp } from '../tpp';
import { AccountService } from '../account.service';
import { TppService } from '../tpp.service';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  accounts: Account[];
  tpps: Tpp[];
  payments: Payment[];
  paymentsOneAccount: Payment[];

  id: string;
  sourceAccount: string;
  destinationAccount: string;
  @Input() amount: number;
  date: number;
  
  tppId: string;

  constructor(private paymentService: PaymentService, private accountService: AccountService, private tppService: TppService) { }

  ngOnInit() {
	this.getAccounts();
	this.getTpps();
    this.getPayments();
  }

  getAccounts(): void {
	    this.accountService.getAccounts()
	    .subscribe(accounts => this.accounts = accounts);
	  }
  
  getTpps(): void {
	    this.tppService.getTpps()
	    .subscribe(tpps => this.tpps = tpps);
	  }
  
  getPayments(): void {
    this.paymentService.getPayments()
    .subscribe(payments => this.payments = payments);
  }
  
  getPaymentsFromAccount(): void {
//		accountId = '5740020270891008';
//		tppId = '6b60b4533ef4bf722d562c24c780817f';
//		periodInMonth = '1';
//	    this.paymentService.getPaymentsFromAccount(accountId, tppId, periodInMonth)
//	    .subscribe(payments => this.payments = payments);
	  }
  
  add(): void {

    let newPayment: Payment;

    newPayment = {
     id: null,
     sourceaccountid: this.sourceAccount,
     destinationaccountid: this.destinationAccount,
     amount: this.amount,
     date: Date.now(),
     description: null
     };

    this.paymentService.addPayment(newPayment)
      .subscribe(payment => {
        this.payments.push(payment);
        });

  }

  updateTpp(selectedTpp: Tpp) {
  this.tppId = selectedTpp.id;
}

  updateAccountId(accountId: string) {
  this.sourceAccount = accountId;
}
  
  updateDestinationAccountId(destinationAccount: string) {
  this.destinationAccount = destinationAccount;
}

}
