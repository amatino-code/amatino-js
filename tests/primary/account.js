/*
 * Amatino JS
 * account.js - Account Test
 * 
 * author: hugh@blinkybeach.com
 */

const Test = require('../test.js');
const Entity = require('../../source/entity.js');
const Session = require('../../source/session.js');
const Account = require('../../source/account.js');
const AccountType = require('../../source/type.js');

class TestAccountOperations extends Test {

  constructor(description=null) {
    let name = 'Create, retrieve, update, and delete an Account';
    if (description != null) {
      name = description;
    }
    super(name);
    this.session = null;
    this.entity = null;
    this._createdAccount = null;
    return;
  }
  
    createEntity() {
      const promise = new Promise((resolve, reject) => {
        try {
          Entity.create(
            this.session,
            'Test Entity',
            'Test description phrase',
            null,
            (error, entity) => {
              if (error != null) {
                reject(error); return;
              }
              this.entity = entity;
              resolve(); return;
            }
          );
        } catch(error) {
          reject(error); return;
        }
      });
      return promise;
    }
    
    createSession() {
      const self = this;
      const promise = new Promise((resolve, reject) => {
        try {
          Session.createWithEmail(
            self.email,
            self.secret,
            (error, session) => {
              if (error != null) { reject(error); return; }
              self.session = session;
              resolve(); return;
            }
          );
        } catch (error) {
          reject(error); return;
        }
      });
      return promise;
    }
    
    createAccount(name='Test Asset Account', acType=AccountType.asset) {
      const self = this;
      const newName = name;
      const promise = new Promise((resolve, reject) => {
        try {
          Account.createWithGlobalUnit(
            self.session,
            self.entity,
            newName,
            acType,
            null,
            5,
            null,
            'Created by Node.JS test program',
            null,
            (error, account) => {
              if (error != null) { reject(error); return; }
              if (account.name != newName) {
                reject(Error("Unexpected account form")); return;
              }
              if (!account.globalUnitId && !account.customUnitId) {
                reject(Error("Denomination missing")); return;
              }
              if (!account.colour) {
                reject(Error("Colour missing")); return;
              }
              self._createdAccount = account;
              resolve(account); return;
            }
          );
        } catch(error) {
          reject(error); return;
        }
      });
      return promise;
    }
    
    _retrieveAccount() {
      const self = this;
      const promise = new Promise((resolve, reject) => {
        try {
          Account.retrieve(
            self.session,
            self.entity,
            self._createdAccount.id,
            (error, account) => {
              if (error != null) { reject(error); return; }
              if (account.name != 'Test Asset Account') {
                reject(Error("Unexpected account form")); return;
              }
              resolve(); return;
            }
          );
        } catch(error) {
          reject(error); return;
        }
      });
      return promise;
    }
    
    _updateAccount() {
      const self = this;
      const newName = 'Updated test';
      const newDescription = 'Updated test description for asset acc.';
      const promise = new Promise((resolve, reject) => {
        try {
          self._createdAccount.update(
            newName,
            self._createdAccount.type,
            self._createdAccount.parentAccountId,
            self._createdAccount.globalUnitId,
            self._createdAccount.customUnitId,
            self._createdAccount.counterPartyEntityId,
            newDescription,
            self._createdAccount.colour,
            (error, account) => {
              if(error != null) { reject(error); return; }
              if (account.name != newName) {
                reject(Error('Name not updated')); return;
              }
              if (account.description != newDescription) {
                reject(Error('description not updated')); return;
              }
              resolve(); return;
            }
          );
        } catch(error) {
          reject(error); return;
        }
      });
      return promise;
    }
    
    _deleteAccount() {
      const self = this;
      const oldAccount = self._createdAccount;
      const promise = new Promise((resolve, reject) => {
        try {
          self.createAccount()
            .then((newAccount) => {
                newAccount.delete(
                  oldAccount,
                  false,
                  null,
                  (error, deletionList) => {
                    if (error != null) {
                      reject(error); return;
                    }
                    resolve(); return;
                  }
                );
            })
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
          .then(() => self.createAccount())
          .then(() => self._retrieveAccount())
          .then(() => self._updateAccount())
          .then(() => self._deleteAccount())
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

module.exports = TestAccountOperations;
