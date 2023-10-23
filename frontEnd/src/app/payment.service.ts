import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {of} from 'rxjs/observable/of';
import {MessageService} from './message.service';
import {catchError, map, tap} from 'rxjs/operators';

import {Payment} from './payment';

@Injectable()
export class PaymentService {

  // Mock endpoint
  //private rootPaymentApiUrl = 'api/payments';  // URL to in-memory web api

//  Real invockation of API
  private rootPaymentApiUrl = 'https://api.us.apiconnect.ibmcloud.com/' +
  'group-4--developing-services-for-the-cloud-group4--space/sb/api/payments';

  private httpOptions = {
  headers: new HttpHeaders({ 'accept': 'application/json',
      'x-ibm-client-id': '2720027f-e84e-488c-a117-be150494439d',
      'x-ibm-client-secret': 'V1wM5xW1bO3eS0vD5bJ3vM2lT6eO2dX2fV2xF7sV4mI2rC0lE0'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {}

  /** GET payments from the server  !!!! Uncomment the Http part once the API is ready */
  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.rootPaymentApiUrl, this.httpOptions)
      .pipe(
      tap(payments => this.log(`payments fetched`)),
      catchError(this.handleError('getPayments', []))
    );
  }
  
  /** GET payments from the server  !!!! Uncomment the Http part once the API is ready */
  getPaymentsFromAccount(accountId: string, tppId: string, periodInMonth: string): Observable<Payment[]> {
    const rootPaymentFromAccountIdApiUrl = 'https://api.us.apiconnect.ibmcloud.com/' +
		    'group-4--developing-services-for-the-cloud-group4--space/sb/api/payments/getAccountTransactions/${accountId}/${tppId}/${periodInMonth}';
    return this.http.get<Payment[]>(this.rootPaymentApiUrl, this.httpOptions)
      .pipe(
      tap(payments => this.log(`payments fetched`)),
      catchError(this.handleError('getPayments', []))
    );
  }

  /** GET payment by id. Will 404 if id not found */
  getPayment(id: string): Observable<Payment> {
    const singlePaymentUrl = `${this.rootPaymentApiUrl}/${id}`;
    return this.http.get<Payment>(singlePaymentUrl).pipe(
      tap(_ => this.log(`fetched payment id= ${id}`)),
      catchError(this.handleError<Payment>(`failed to getPayment id=${id}`))
    );
  }

  /** POST: add a new payment to the server */
  addPayment (newPayment: Payment): Observable<Payment> {
    const httpOptionsPost = {
    		  headers: new HttpHeaders({ 'accept': 'application/json',
    			  'content-type': 'application/json',
    		      'x-ibm-client-id': '2720027f-e84e-488c-a117-be150494439d',
    		      'x-ibm-client-secret': 'V1wM5xW1bO3eS0vD5bJ3vM2lT6eO2dX2fV2xF7sV4mI2rC0lE0'})
    		  };
    return this.http.post<Payment>(this.rootPaymentApiUrl, newPayment, httpOptionsPost).pipe(
      tap((newPpayment: Payment) => this.log(`added payment w/ id=${newPpayment.id}`)),
      catchError(this.handleError<Payment>('addPayment'))
    );
  }

// Infrastructural Methods

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('PaymentService: ' + message);
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
