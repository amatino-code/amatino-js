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

  constructor() {
    super('Create, retrieve, update, and delete an Account');
    this._session = null;
    this._entity = null;
    this._createdAccount = null;
    return;
  }
  
    _createEntity() {
      const promise = new Promise((resolve, reject) => {
        try {
          Entity.create(
            this._session,
            'Test Entity',
            'Test description phrase',
            null,
            (error, entity) => {
              if (error != null) {
                reject(error); return;
              }
              this._entity = entity;
              resolve(); return;
            }
          );
        } catch(error) {
          reject(error); return;
        }
      });
      return promise;
    }
    
    _createSession() {
      const self = this;
      const promise = new Promise((resolve, reject) => {
        try {
          Session.createWithEmail(
            self.email,
            self.secret,
            (error, session) => {
              if (error != null) { reject(error); return; }
              self._session = session;
              resolve(); return;
            }
          );
        } catch (error) {
          reject(error); return;
        }
      });
      return promise;
    }
    
    _createAccount() {
      const self = this;
      const newName = 'Test Asset Account';
      const promise = new Promise((resolve, reject) => {
        try {
          Account.createWithGlobalUnitDenomination(
            self._session,
            self._entity,
            newName,
            AccountType.asset,
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
              resolve(); return;
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
            self._session,
            self._entity,
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
      const deleteId = this._createdAccount.id;
      const promise = new Promise((resolve, reject) => {
        try {
          self._createAccount()
            .then(() => {
                Account.delete(
                  this._createdAccount.id,
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
          self._createSession()
          .then(() => self._createEntity())
          .then(() => self._createAccount())
          .then(() => self._retrieveAccount())
          .then(() => self._updateAccount())
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
