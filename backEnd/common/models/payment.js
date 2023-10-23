'use strict';
var app = require('../../server/server');
var async = require('async');

var PISP_TYPE = "PISP";
var AISP_TYPE = "AISP";

var ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

module.exports = function(Payment) {
  Payment.execute = function(requestObj, cb) {
    console.log("Request obj ", requestObj);
    var sourceAccountId = requestObj.sourceAccountId;
    var tppId = requestObj.tppId;
    var destinationAccountId = requestObj.destinationAccountId;
    var amount =  parseFloat(requestObj.amount);

    if (!isNaN(amount)) {
        console.log("Amount is a number ", amount);
    } else {
      console.log("Not number");
    }

    if (sourceAccountId == null ||
        tppId == null ||
        destinationAccountId == null ||
        amount == null || amount <= 0 || isNaN(amount) ||
        sourceAccountId == destinationAccountId
      ) {

          var error = new Error();
          error.status = 400;
          error.message = "Invalid parameters";
          return cb(error)
    }

    console.log("Source account ", sourceAccountId, "Destination account ", destinationAccountId, ", is amount ", isNaN(amount));
    async.parallel({
      isTppAuthorized: isTppAuthorized.bind(null, sourceAccountId, tppId, destinationAccountId),
      sourceAccount: findAccount.bind(null, sourceAccountId),
      destinationAccount: findAccount.bind(null, destinationAccountId)
    }, function(err, results) {
      if (err) {
        console.log(err);
        var error = new Error();
        error.status = 500;
        error.message = err.message;
        return cb(error)
      }

      if (!results.isTppAuthorized) {
        var error = new Error();
        error.status = 400;
        error.message = "Tpp has not been authorized to make payment yet";
        return cb(error)
      }

      if (results.sourceAccount == null) {
        var error = new Error();
        error.status = 400;
        error.message = "Source account id hasn't existed yet";
        return cb(error)
      }

      if (results.destinationAccount == null) {
        var error = new Error();
        error.status = 400;
        error.message = "Destination account id hasn't existed yet";
        return cb(error)
      }

      console.log("Source balance ", results.sourceAccount.balance);
      if (results.sourceAccount.balance < amount) {
        var error = new Error();
        error.status = 400;
        error.message = "Source account balance is not enough";
        return cb(error)
      }

      var currentDate = new Date();
      var currentDateStr = currentDate.toString();
      var transactionObj = {
                            "amount": amount,
                            "date": currentDateStr,
                            "sourceaccountid": sourceAccountId,
                            "destinationaccountId": destinationAccountId
                          }
      async.parallel({
                      updatedSourceAccount: updateAccountBalance.bind(null, results.sourceAccount, -amount),
                      updatedDesAccount: updateAccountBalance.bind(null, results.destinationAccount, amount),
                      newTransaction: saveTransaction.bind(null, transactionObj)
                      }, function (err, results) {

                        if (results.updatedSourceAccount == null ||
                          results.updatedDesAccount == null ||
                          (results.newTransaction == null)) {

                          var error = new Error();
                          error.status = 500;
                          error.message = "Process transaction from account to acount error";
                          return cb(error);
                        }

                        return cb(null, transactionObj);
                      });
   });
  }

  Payment.remoteMethod(
    'execute',
    {
      http: {path: '/execute', verb: 'post'},
      accepts: {arg: 'request', type: 'object', description: '{"sourceAccountId": "1", "tppId": "3", "destinationAccountId": "68", "amount": 3}', http: { source: 'body' }},
      returns: {arg: 'response', type: 'string'}
    }
  );

 Payment.getAccountTransactions = function(accountId, tppId, periodInMonth, cb) {
   if (accountId == null || tppId == null || periodInMonth == null) {

         var error = new Error();
         error.status = 400;
         error.message = "Invalid parameters";
         return cb(error)
   }

   async.parallel({
     currentTpp: findOneTpp.bind(null, tppId),
     isTppAuthorized: isTppAuthorized.bind(null, accountId, tppId, null),
     transactions: getAllTransactionsFromAndTo.bind(null, accountId, periodInMonth)
   }, function(err, results) {
     if (err) {
       console.log(err);
       var error = new Error();
       error.status = 500;
       error.message = err.message;
       return cb(error)
     }

     var error = new Error();
     error.status = 400;
     if (results.currentTpp.type != AISP_TYPE) {
       error.message = "Only AISP can be authorized to get transactions from an account";
       return cb(error);
     }

     if (!results.isTppAuthorized) {
       var error = new Error();
       error.status = 400;
       error.message = "Tpp has not been authorized to get transactions yet";
       return cb(error)
     }

     var transactions =  results.transactions;
     return cb(null, transactions)
   })
 }

 Payment.remoteMethod(
   'getAccountTransactions',
   {
     http: {path: '/getAccountTransactions', verb: 'get'},
     accepts: [
                {arg: 'accountId', type: 'string'},
                {arg: 'tppId', type: 'string'},
                {arg: 'periodInMonth', type: 'number'}
              ],
     returns: {arg: 'response', type: 'array'}
   }
 );

  /*
  * Check whether tpp is authorized to transfer money from source account to destination account
  */
  function isTppAuthorized(sourceAccountId, tppId, destinationAccountId, cb) {
    // cb(null, true)
    if (destinationAccountId == null) {
      // Authorize tpp to get information instead of transfering money
      app.models.Tppauthorization.findOne({where: {accountId: sourceAccountId, tppId: tppId}}, function (err, tppAuthorization) {
        if (err || tppAuthorization == null) {
          console.log("Can't find tpp authorization", err);
          cb(null, false)
        } else {
          cb(null, true)
        }
      });
    } else {
      app.models.Tppauthorization.findOne({where: {accountId: sourceAccountId, tppId: tppId, authorizedAccountId: destinationAccountId}}, function (err, tppAuthorization) {
        if (err || tppAuthorization == null) {
          console.log("Can't find tpp authorization", err);
          cb(null, false)
        } else {
          cb(null, true)
        }
      });
    }
  }

  function findAccount(accountId, cb) {
    app.models.Account.findById(accountId, function (err, account) {
      if (err || account == null) {
        console.log("Can't find account", err);
      }

      cb(null, account);
    })
  }

  function findOneTpp(tppId, cb) {
    app.models.Tpp.findById(tppId, function (err, tpp) {

      if (err || tpp == null) {
        console.log(err);
        cb(null, tpp)
      } else {
        cb(null, tpp)
      }
    });
  }

  function updateAccountBalance(account, changedAmount, cb) {
    var newBalance = account.balance + changedAmount;
    console.log("Account ", account.id, "; balance: ", newBalance);

    app.models.Account.upsertWithWhere({id:account.id}, {balance: newBalance}, function(err, updatedAccount) {
        if (err || updatedAccount == null) {
          console.log("Can't update balance to account: ", account.id);
        }

        cb(null, updatedAccount);
    });
  }

  function saveTransaction(transactionObj, cb) {
      Payment.create(transactionObj, function(err, createdTransaction) {
        if (err || createdTransaction == null) {
          console.log("Can't save transaction: ", transactionObj);
        }

        cb(null, createdTransaction);
      });
  }

  function getAllTransactionsFromAndTo(accountId, periodInMonth, cb) {
    var periodInMilli = periodInMonth * ONE_MONTH;
    Payment.find({where: {date: {gt: Date.now() - periodInMilli},
                          or: [
                            {'sourceaccountid':accountId},
                            {'destinationaccountId':accountId}
                          ]
                         }
                }, function(err, payments) {
                  if (err || payments == null) {
                    console.log("Can't find any payment related to account id ", accountId);
                  }

                  cb(null, payments);
                })
  }
};
