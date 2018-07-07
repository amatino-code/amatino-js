/*
 * Amatino JS
 * account.js - Alpha Account Test
 * 
 * author: hugh@blinkybeach.com
 */

/*
 * Amatino JS
 * entity.js
 * 
 * author: hugh@blinkybeach.com
 */

const Test = require('../test.js');
const AmatinoAlpha = require('../../source/amatino_alpha.js');

class TestAlphaCreateAccount extends Test {
  
  constructor() {
    super("Create an Account with AmatinoAlpha");
    return
  }
  
  _createAccount(alpha, resolve) {
  
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
          this._createDummyAccount(alpha, resolve, newEntity);
          return;
        } catch {
          this.fail(error);
          resolve();
          return;
        }
        return;
      }
    )
  }
  
  _createDummyEntity(alpha, resolve) {
    
  }
  
  _createDummyAccount(alpha, resolve, entity) {
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
        try {
          const subscriptionAccount = responseData[0];
          const cashAccount = responseData[1];
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
  
  execute() {
    const self = this;
    return this.stage(this._createAccount.bind(self));
  }

}
module.exports = TestAlphaCreateAccount
