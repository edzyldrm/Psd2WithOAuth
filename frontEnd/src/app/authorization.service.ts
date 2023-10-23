import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {of} from 'rxjs/observable/of';
import {MessageService} from './message.service';
import {catchError, map, tap} from 'rxjs/operators';

import {Authorization} from './authorization';

@Injectable()
export class AuthorizationService {

  // Mock endpoint
  //private rootAuthorizationApiUrl = 'api/authorizations';  // URL to in-memory web api

//  Real invockation of API
  private rootAuthorizationApiUrl = 'https://api.us.apiconnect.ibmcloud.com/' +
  'group-4--developing-services-for-the-cloud-group4--space/sb/api/tppauthorizations';

  private httpOptions = {
  headers: new HttpHeaders({ 'accept': 'application/json',
      'x-ibm-client-id': '2720027f-e84e-488c-a117-be150494439d',
      'x-ibm-client-secret': 'V1wM5xW1bO3eS0vD5bJ3vM2lT6eO2dX2fV2xF7sV4mI2rC0lE0'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {}

  /** GET authorizations from the server  !!!! Uncomment the Http part once the API is ready */
  getAuthorizations(): Observable<Authorization[]> {
    return this.http.get<Authorization[]>(this.rootAuthorizationApiUrl, this.httpOptions)
      .pipe(
      tap(authorizations => this.log(`authorizations fetched`)),
      catchError(this.handleError('getAuthorizations', []))
    );
  }

  /** GET authorization by id. Will 404 if id not found */
  getAuthorization(id: string): Observable<Authorization> {
    const singleAuthorizationUrl = `${this.rootAuthorizationApiUrl}/${id}`;
    return this.http.get<Authorization>(singleAuthorizationUrl).pipe(
      tap(_ => this.log(`fetched authorization id= ${id}`)),
      catchError(this.handleError<Authorization>(`failed to getAuthorization id=${id}`))
    );
  }

  /** POST: add a new authorization to the server */
  addAuthorization (newAuthorization: Authorization): Observable<Authorization> {
    const rootAuthorizePostApiUrl = 'https://api.us.apiconnect.ibmcloud.com/group-4--developing'+
    		'-services-for-the-cloud-group4--space/sb/api/tppauthorizations/authorize';

    const httpOptionsPost = {
    		  headers: new HttpHeaders({ 'accept': 'application/json',
    			  'content-type': 'application/json',
    		      'x-ibm-client-id': '012da532-e718-4a6e-91d4-d42b27f6dc36',
    		      'x-ibm-client-secret': 'A7oH5wH2vV1wV7eN6jA0wC6xF7mM7aC3sY2oE0oN1kV2aY8hY1'})
    		  };
    return this.http.post<Authorization>(rootAuthorizePostApiUrl, newAuthorization, httpOptionsPost).pipe(
      tap((newAauthorization: Authorization) => this.log(`added authorization w/ id=${newAauthorization.id}`)),
      catchError(this.handleError<Authorization>('addAuthorization'))
    );
  }

// Infrastructural Methods

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('AuthorizationService: ' + message);
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
