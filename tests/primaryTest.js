/*
 * Amatino JS
 * primaryTest.js
 * 
 * author: hugh@blinkybeach.com
 */

const Test = require('../test.js');
const Session = require('../../source/session.js');
const Entity = require('../../source/entity.js');

class PrimaryTest extends Test {
  /*
   * A Test providing convenient .entity and .session properties
   * for use by test procedures.
   */
  
  constructor(description) {
    super(description);
    this._entity = null;
    this._session = null;
    return;
  }
  
  get session() { return this._session }
  get entity() { return this._entity }

  procedure() {
    throw Error('Not implemented');
    return;
  }

  async _createSession() {
    const promise = new Promise(resolve => {
      Session.createWithEmail(
        this.email;
        this.secret;
        (error, session) => {
          if (error != null) {
            this._session = session;
          }
          resolve();
          return;
        };
      );
    });
    return promise;
  }

  async _createEntity() {
    const promise = new Promise(resolve => {
      Entity.create(
        this.session,
        'Test Entity',
        null,
        null,
        (error, entity) => {
          if (error != null) {
            this._entity = entity;
          }
          resolve();
          return;
        }
      )
    });
    return promise;
  }

  stage(procedure) {
    const promise = new Promise(resolve => {
      this._createSession()
        .then(this._createEntity)
        .then(procedure(resolve))
    });
    return promise;
  }
  
}
