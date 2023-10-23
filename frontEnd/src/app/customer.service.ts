import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {MessageService} from './message.service';
import {catchError, map, tap} from 'rxjs/operators';

import {Customer} from './customer';

@Injectable()
export class CustomerService {

  private rootCustomerApiUrl = 'https://api.us.apiconnect.ibmcloud.com/' +
  'group-4--developing-services-for-the-cloud-group4--space/sb/api/customers';

  private httpOptions = {
  headers: new HttpHeaders({ 'accept': 'application/json',
      'x-ibm-client-id': '99241f55-d1d7-4816-b25c-71c91676aeeb',
      'x-ibm-client-secret': 'X3bA0gI7aT8lR7cG0rH2hL0iE2eO0gW4kR1eN8lA3aF0bG8vH2'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {}

  /** GET customers from the server */
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.rootCustomerApiUrl, this.httpOptions)
      .pipe(
      tap(customers => this.log(`customers fetched`)),
      catchError(this.handleError('getCustomers', []))
    );
  }

  /** GET customer by id. Will 404 if id not found */
  getCustomer(id: string): Observable<Customer> {
    const singleCustomerUrl = `${this.rootCustomerApiUrl}/${id}`;
    return this.http.get<Customer>(singleCustomerUrl).pipe(
      tap(_ => this.log(`fetched customer id=${id}`)),
      catchError(this.handleError<Customer>(`failed to getCustomer id=${id}`))
    );
  }

  /** POST: add a new customer to the server */
  addCustomer (newCustomer: Customer): Observable<Customer> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Customer>(this.rootCustomerApiUrl, newCustomer, httpOptions).pipe(
      tap((newCcustomer: Customer) => this.log(`added customer w/ id=${newCustomer.id}`)),
      catchError(this.handleError<Customer>('addCustomer'))
    );
  }

// Infrastructural Methods

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('CustomerService: ' + message);
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

