import { Component, OnInit } from '@angular/core';
import { Authorization } from '../authorization';
import { Account } from '../account';
import { Tpp } from '../tpp';
import { AccountService } from '../account.service';
import { TppService } from '../tpp.service';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-authorizations',
  templateUrl: './authorizations.component.html',
  styleUrls: ['./authorizations.component.css']
})
export class AuthorizationsComponent implements OnInit {

  accounts: Account[];
  tpps: Tpp[];
  authorizations: Authorization[];

  id: string;
  tppId: string;
  accountId: string;
  authorizedAccountId: string;

  constructor(private authorizationService: AuthorizationService, private accountService: AccountService, private tppService: TppService) { }

  ngOnInit() {
	this.getAccounts();
	this.getTpps();
    this.getAuthorizations();
    //this.id = 2;
  }

  getAccounts(): void {
	    this.accountService.getAccounts()
	    .subscribe(accounts => this.accounts = accounts);
	  }
  
  getTpps(): void {
	    this.tppService.getTpps()
	    .subscribe(tpps => this.tpps = tpps);
	  }
  
  getAuthorizations(): void {
    this.authorizationService.getAuthorizations()
    .subscribe(authorizations => this.authorizations = authorizations);
  }
  
  add(): void {

    let newAuthorization: Authorization;

    newAuthorization = {
     id: null,
     tppId: this.tppId,
     accountId: this.accountId,
     authorizedAccountId: this.authorizedAccountId
     };

    this.authorizationService.addAuthorization(newAuthorization)
      .subscribe(authorization => {
        this.authorizations.push(authorization);
        });

  }

  updateTpp(selectedTpp: Tpp) {
  this.tppId = selectedTpp.id;
}

  updateAccountId(accountId: string) {
  this.accountId = accountId;
}
  
  updateDestinationAccountId(authorizedAccountId: string) {
  this.authorizedAccountId = authorizedAccountId;
}

}
