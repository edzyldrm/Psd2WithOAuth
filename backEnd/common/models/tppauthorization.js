'use strict';

var app = require('../../server/server');
var async = require('async');

var PISP_TYPE = "PISP";
var AISP_TYPE = "AISP";

module.exports = function(Tppauthorization) {

  /**
    * An account authorizes TPPs to transfer to authorized account
    * Params:
      - accountId: Source account id
      - tppId: Authorized tpp
      - authorizedAccountId: authorizedAccountId that accepted to transfer money
    * Returns:
      - Response including parameters and date time of authorization
  **/
  Tppauthorization.authorize = function(requestObj, cb) {
    var accountId = requestObj.accountId;
    var tppId = requestObj.tppId;
    var authorizedAccountId = requestObj.authorizedAccountId;

    if (accountId == null ||
        tppId == null ||
        accountId == authorizedAccountId) {

          var error = new Error();
          error.status = 400;
          error.message = "Invalid parameters";
          return cb(error)
    }

    if (authorizedAccountId == null) {
      // Hand request to authorize AISP
      handleRequestForAISP(accountId, tppId, cb);
    } else {
      // hand request to authorize PISP
      handleRequestForPISP(accountId, tppId, authorizedAccountId, cb);
    }

  }

  Tppauthorization.remoteMethod(
    'authorize',
    {
      http: {path: '/authorize', verb: 'post'},
      accepts: {arg: 'request', type: 'object', description: '{"accountId": "1", "tppId": "3", "authorizedAccountId": "68"}', http: { source: 'body' }},
      returns: {arg: 'response', type: 'string'}
    }
  );

  function handleRequestForPISP(sourceAccountId, tppId, destinationAccountId, cb) {
    async.parallel({
      isSourceAccountExisted: isAccountExist.bind(null, sourceAccountId),
      isDestinationAccountExisted: isAccountExist.bind(null, destinationAccountId),
      currentTpp: findOneTpp.bind(null, tppId)
    }, function(err, results) {

      if (err) {
        var error = new Error();
        error.status = 500;
        error.message = err.message;
        return cb(error)
      }

      var error = new Error();
      error.status = 400;

      if (!results.isSourceAccountExisted) {
        error.message = "Source id is not existed";
        return cb(error);
      }

      if (!results.isDestinationAccountExisted) {
        error.message = "Destination id is not existed";
        return cb(error);
      }

      if (results.currentTpp == null) {
        error.message = "Tpp id is not existed";
        return cb(error);
      }

      if (results.currentTpp.type != PISP_TYPE) {
        error.message = "Only PISP can be authorized to make payments";
        return cb(error);
      }

      var currentDate = new Date();
      var currentDateStr = currentDate.toString();

      var tppAuthorizationObj = {
          "date": currentDateStr,
          "authorizedAccountId": destinationAccountId,
          "accountId": sourceAccountId,
          "tppId": tppId
      }

      Tppauthorization.create(tppAuthorizationObj);
      return cb(null, tppAuthorizationObj);
   });

  }

  function handleRequestForAISP(sourceAccountId, tppId, cb) {
    async.parallel({
      isSourceAccountExisted: isAccountExist.bind(null, sourceAccountId),
      currentTpp: findOneTpp.bind(null, tppId)
    }, function(err, results) {
      if (err) {
        var error = new Error();
        error.status = 500;
        error.message = err.message;
        return cb(error)
      }

      var error = new Error();
      error.status = 400;

      if (!results.isSourceAccountExisted) {
        error.message = "Source id is not existed";
        return cb(error);
      }

      if (results.currentTpp == null) {
        error.message = "Tpp id is not existed";
        return cb(error);
      }

      if (results.currentTpp.type != AISP_TYPE) {
        error.message = "Only AISP can be authorized to get transactions from an account";
        return cb(error);
      }

      var currentDate = new Date();
      var currentDateStr = currentDate.toString();

      var tppAuthorizationObj = {
          "date": currentDateStr,
          "accountId": sourceAccountId,
          "tppId": tppId
      }

      Tppauthorization.create(tppAuthorizationObj);
      return cb(null, tppAuthorizationObj);
    })
  }

  function isAccountExist(accountId, cb) {
    //Check whether accountId and authorizedAccountId existed
    app.models.Account.findById(accountId, function (err, account) {

      if (err || account == null) {
        console.log(err);
        cb(null, false)
      } else {
        cb(null, true)
      }

    });
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
};
