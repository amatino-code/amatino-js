/*
 * Amatino JS
 * transaction.js - Alpha Transaction Test
 * 
 * author: hugh@blinkybeach.com
 */

const Test = require('../test.js');
const AmatinoAlpha = require('../../source/amatino_alpha.js');

class TestAlphaCreateTransaction extends Test {
  
  constructor() {
    super("Create a Transaction with AmatinoAlpha");
    return
  }
  
  _createTransactions(alpha, resolve) {
  
    let _ = alpha.request(
      '/entities',
      'POST',
      null,
      [{
        'name': 'My First Entity',
        'description': null,
        'region_id': null
      }],
      (error, responseData) => {
        if (error) {
          this.fail(error);
          resolve();
          return;
        }
        try {
          const newEntity = responseData[0];
          this._createDummyAccounts(alpha, resolve, newEntity);
          return;
        } catch {
          this.fail('Caught responseData index error: ' + error);
          resolve();
          return;
        }
        return;
      }
    )
  }
  
  _createDummyTransactions(alpha, resolve, entity, accounts) {
    
    let _ = alpha.request(
      '/transactions',
      'POST',
      '?entity_id=' + entity['entity_id'],
      [{
        'transaction_time': '2017-01-17_17:22:16.51245',
        'description': 'receipt of some dosh',
        'global_unit_denomination': 5,
        'custom_unit_denomination': null,
        'entries': [{
          'account_id': Number(accounts['incomeAccount']['account_id']),
          'description': '',
          'side': 1,
          'amount': '42.01'
        }, {
          'account_id': Number(accounts['cashAccount']['account_id']),
          'description': '',
          'side': 0,
          'amount': '42.01'
        }]
      }], 
      (error, responseData) => {
        if (error) {
          this.fail(error);
          resolve();
          return;
        }
        try {
          const transaction = responseData[0];
        } catch {
          this.fail(error);
          resolve();
          return;
        }
        this.pass();
        resolve();
        return;
      }
    )
  }
  
  _createDummyAccounts(alpha, resolve, entity) {

    let _ = alpha.request(
      '/accounts',
      'POST',
      '?entity_id=' + entity['entity_id'],
      [{
        'name': 'Subscription income',
        'type': 4, // Income
        'parent_account_id': null,
        'global_unit_id': 5,
        'custom_unit_id': null,
        'counterparty_entity_id': null,
        'description': 'Sweet loot',
        'colour': null
      }, {
        'name': 'Cash',
        'type': 1,
        'parent_account_id': null,
        'global_unit_id': 5,
        'custom_unit_id': null,
        'counterparty_entity_id': null,
        'description': 'Stacks of Benjamins',
        'colour': null
      }], 
      (error, responseData) => {
        if (error) {
          this.fail(error);
          resolve();
          return;
        }
        let accounts = {};
        try {
          const incomeAccount = responseData[0];
          const cashAccount = responseData[1];
          accounts['incomeAccount'] = incomeAccount;
          accounts['cashAccount'] = cashAccount;
        } catch {
          this.fail(error);
          resolve();
          return;
        }

        this._createDummyTransactions(alpha, resolve, entity, accounts);
        return;
      }
    )
  }
  
  execute() {

    const self = this;
    return this.stage(this._createTransactions.bind(self));
  }

}
module.exports = TestAlphaCreateTransaction
