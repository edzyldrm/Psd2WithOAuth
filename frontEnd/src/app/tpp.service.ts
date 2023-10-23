import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {of} from 'rxjs/observable/of';
import {MessageService} from './message.service';
import {catchError, map, tap} from 'rxjs/operators';

import {Tpp} from './tpp';

@Injectable()
export class TppService {

  private rootTppApiUrl = 'https://api.us.apiconnect.ibmcloud.com/' +
  'group-4--developing-services-for-the-cloud-group4--space/sb/api/tpps';

  private httpOptions = {
  headers: new HttpHeaders({ 'accept': 'application/json',
      'x-ibm-client-id': '99241f55-d1d7-4816-b25c-71c91676aeeb',
      'x-ibm-client-secret': 'X3bA0gI7aT8lR7cG0rH2hL0iE2eO0gW4kR1eN8lA3aF0bG8vH2'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {}

  /** GET tpps from the server  !!!! Uncomment the Http part once the API is ready */
  getTpps(): Observable<Tpp[]> {
    return this.http.get<Tpp[]>(this.rootTppApiUrl, this.httpOptions)
      .pipe(
      tap(tpps => this.log(`tpps fetched`)),
      catchError(this.handleError('getTpps', []))
    );

//    let mockTpps: Tpp[];
//    mockTpps = [
//    {id: 1,
//     name: 'Facebook',
//     type: 'PISP',
//     destAccount: 'Account_Facebook1'
//    },
//    {id: 2,
//     name: 'Google',
//     type: 'AISP',
//     destAccount: 'Account_Google1'
//    }
//    ];
//
//    return Observable.create((observer: Subscriber<any>) => {
//      observer.next(mockTpps);
//      observer.complete();
//    });
  }

  /** GET tpp by id. Will 404 if id not found */
  getTpp(id: string): Observable<Tpp> {
    const singleTppUrl = `${this.rootTppApiUrl}/${id}`;
    return this.http.get<Tpp>(singleTppUrl).pipe(
      tap(_ => this.log(`fetched tpp id=${id}`)),
      catchError(this.handleError<Tpp>(`failed to getTpp id=${id}`))
    );
  }

  /** POST: add a new tpp to the server */
  addTpp (newTpp: Tpp): Observable<Tpp> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Tpp>(this.rootTppApiUrl, newTpp, httpOptions).pipe(
      tap((newCtpp: Tpp) => this.log(`added tpp w/ id=${newTpp.id}`)),
      catchError(this.handleError<Tpp>('addTpp'))
    );
  }

// Infrastructural Methods

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('TppService: ' + message);
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

