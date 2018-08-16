/*
 * Amatino JS
 * account.js - Transaction Test
 * 
 * author: hugh@blinkybeach.com
 */

const Test = require('../test.js');
const Entity = require('../../source/entity.js');
const Session = require('../../source/session.js');
const Account = require('../../source/account.js');
const AccountType = require('../../source/type.js');
const Transaction = require('../../source/transaction.js');
const Entry = require('../../source/entry.js');
const Side = require('../../source/side.js');
const TestAccountOperations = require('./account.js');

class TestTransactionOperations extends TestAccountOperations {
  
  constructor() {
    super('Create, retrieve, update, and delete a Transaction');
    this._assetAccount = null;
    this._revenueAccount = null;
    this._createdTransaction = null;
    return;
  }
  
  createAccounts() {
    const self = this;
    const promise = new Promise((resolve, reject) => {
      try {
        const asset = new Promise(resolve => {
          self.createAccount().then((assetAccount) => {
            self._assetAccount = assetAccount;
            resolve(); return;
          }).catch(error => {reject(error)});
        });
        const revenue = new Promise(resolve => {
          self.createAccount().then((revenueAccount) => {
            self._revenueAccount = revenueAccount;
            resolve(); return;
          }).catch(error => {reject(error)});
        });
        Promise.all([asset, revenue]).then(resolve);
        return;
      } catch(error) {
        reject(error); return;
      }
    });
    return promise;
  }
  
  _createTransaction() {
    const self = this;
    const txDesc = "Test transaction created in Amatino JS test suite";
    const promise = new Promise((resolve, reject) => {
      try {
        Transaction.create(
          self.session,
          self.entity,
          (new Date(new Date().getTime() - 60*24*60000)),
          txDesc,
          5,
          null,
          [
            new Entry(Side.debit, '', self._assetAccount, "420"),
            new Entry(Side.credit, '', self._revenueAccount, "420")
          ],
          (error, transaction) => {
            if (error != null) { reject(error); return; }
            if (transaction.description != txDesc) {
              let errorText = "Unexpected TX description: ";
              errorText += transaction.description;
              reject(Error(errorText));
              return;
            }
            if (transaction.entries[0].amount != "420.00") {
              let errorText = "Unexpected TX entry amount: ";
              errorText += transaction.entries[0].amount;
              reject(Error(errorText));
              return;
            }
            if (!transaction.session) {
              reject(Error("Transaction session missing")); return;
            }
            if (!transaction.entity) {
              reject(Error("Transaction entity missing")); return;
            }
            if (!transaction.authorId) {
              reject(Error("Author id missing")); return;
            }
            self._createdTransaction = transaction;
            resolve(); return;
        });
      } catch(error) {
        reject(error); return;
      }
    });
    return promise;
  }
  
  execute() {
    const self = this;
    const promise = new Promise(resolve => {
      try {
        self.createSession()
        .then(() => self.createEntity())
        .then(() => self.createAccounts())
        .then(() => self._createTransaction())
        .catch(error => {self.fail(error); return;})
        .then(() => self.passIfNotFailed())
        .then(resolve);
      } catch(error) {
        self.fail(error);
        resolve(); return;
      }
    });
    return promise;
  }
}

module.exports = TestTransactionOperations;
