/*
 * Amatino JS
 * entity.js - Entity Test
 * 
 * author: hugh@blinkybeach.com
 */

const Test = require('../test.js');
const Entity = require('../../source/entity.js');
const Session = require('../../source/session.js');

class TestEntityOperations extends Test {  
    constructor() {
      super("Create & retrieve an Entity");
      this._createdEntity = null;
      return;
    }
    
    _createEntity(session, resolve) {
      const promise = new Promise(resolve => {
        try {
          Entity.create(
            session,
            'Test Entity',
            'Test description phrase',
            null,
            (error, entity) => {
              if (error != null) {
                const rvError = Error('On entity creation: ' + error);
                resolve({'error': rvError, 'entity': null});
                return;
              }
              if (entity != null && entity.name == 'Test Entity') {
                resolve({'error': null, 'entity': entity});
                return;
              }
              const rvError = Error('Entity not in expected form');
              resolve({'error': rvError, 'entity': null});
              return;
            }
          );
        } catch(error) {
          resolve({'error': error, 'entity': null});
          return;
        }
      });
      return promise;
    }

    _retrieveEntity(session, entityToRetrieve) {
      const promise = new Promise(resolve => {
        try {
          Entity.retrieve(
            session,
            entityToRetrieve.id,
            (error, entity) => {
              if (error != null) {
                const rvError = Error('On entity retrieval: ' + error)
                resolve({'error': rvError, 'entity': null});
                return;
              }
              if (entity != null && entity.name == 'Test Entity') {
                resolve({'error': null, 'entity': entity});
                return;
              }
              const rvError = Error('Entity not in expected form');
              resolve({'error': rvError, 'entity': null});
              return;
            }
          );
        } catch(error) {
          resolve({'error': error, 'entity': null});
          return;
        }
      });
      return promise;
    }
    
    execute() {
      const self = this;
      const promise = new Promise(resolve => {
        try {
          Session.createWithEmail(
            self.email,
            self.secret,
            (error, session) => {
              if (error != null) {
                self.fail('Did not create Session: ' + error);
                resolve();
                return;
              }
              self._createEntity(session)
                .then(function(result) {
                  const error = result['error'];
                  const entity = result['entity'];
                  if (error != null) {
                    self.fail(error);
                    resolve();
                    return;
                  }
                  return self._retrieveEntity(session, entity);
                }).then(function(result) {
                  if (result['error'] != null) {
                    self.fail(error);
                  } else {
                    self.pass();
                  }
                  resolve();
                  return;
                });
            }
          )
        } catch(error) {
          self.fail(error);
          resolve();
          return;
        }
      });
      return promise;
    }
}

module.exports = TestEntityOperations;
