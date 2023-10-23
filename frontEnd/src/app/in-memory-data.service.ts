import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const authorizations = [
      { id: 0, accountId: 1, tppId: 1, tppType: 'PISP'},
      { id: 1, accountId: 2, tppId: 1, tppType: 'PISP'}
    ];
    return {authorizations};
  }
}
