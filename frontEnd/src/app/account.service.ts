import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {MessageService} from './message.service';
import {catchError, map, tap} from 'rxjs/operators';

import {Account} from './account';

@Injectable()
export class AccountService {

  private rootAccountApiUrl = 'https://api.us.apiconnect.ibmcloud.com/' +
  'group-4--developing-services-for-the-cloud-group4--space/sb/api/accounts';

  private httpOptions = {
  headers: new HttpHeaders({ 'accept': 'application/json',
      'x-ibm-client-id': '99241f55-d1d7-4816-b25c-71c91676aeeb',
      'x-ibm-client-secret': 'X3bA0gI7aT8lR7cG0rH2hL0iE2eO0gW4kR1eN8lA3aF0bG8vH2'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {}

  /** GET accounts from the server */
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.rootAccountApiUrl, this.httpOptions)
      .pipe(
      tap(accounts => this.log(`accounts fetched`)),
      catchError(this.handleError('getAccounts', []))
    );
  }

  /** GET account by id. Will 404 if id not found */
  getAccount(id: string): Observable<Account> {
    const singleAccountUrl = `${this.rootAccountApiUrl}/${id}`;
    return this.http.get<Account>(singleAccountUrl).pipe(
      tap(_ => this.log(`fetched account id=${id}`)),
      catchError(this.handleError<Account>(`failed to getAccount id=${id}`))
    );
  }

  /** POST: add a new account to the server */
  addCustomer (newAccount: Account): Observable<Account> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Account>(this.rootAccountApiUrl, newAccount, httpOptions).pipe(
      tap((newAaccount: Account) => this.log(`added account w/ id=${newAccount.id}`)),
      catchError(this.handleError<Account>('addAccount'))
    );
  }

// Infrastructural Methods

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('AccountService: ' + message);
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
