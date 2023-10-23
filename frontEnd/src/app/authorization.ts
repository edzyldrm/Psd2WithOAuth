export class Authorization {
  static seqId: number; // This is used only for mock purposes.

  id: number;
  accountId: string;
  tppId: string;
  authorizedAccountId: string;

  constructor(id: number, accountId: string, tppId: string, authorizedAccountId: string) {

    this.id = Authorization.seqId; // This is used only for mock purposes.
    this.tppId = tppId;
    this.accountId = accountId;
    this.authorizedAccountId = authorizedAccountId;

    Authorization.seqId++; // This is used only for mock purposes.
  }

}
