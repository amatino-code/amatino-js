/*
 * Amatino JS
 * entity.js
 * 
 * author: hugh@blinkybeach.com
 */
 
const Test = require('../test.js');
const AmatinoAlpha = require('../../source/amatino_alpha.js');

class TestAlphaCreateEntity extends Test {
  
  constructor() {
    super("Create an Entity with AmatinoAlpha");
    return
  }
  
  _createEntity(alpha, resolve) {
  
    let _ = alpha.request(
      '/entities',
      'POST',
      null,
      [{
        'name': 'My First Entity',
        'description': '',
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
    return new Promise(resolve => {
      try {
        let _ = AmatinoAlpha.createWithEmail(
          this.email,
          this.secret,
          (error, alpha) => {
            if (error != null) {
              this.fail('Error: ' + error);
              resolve();
              return;
            }
            this._createEntity(alpha, resolve);
            return;
          }
        );
      } catch(error) {
        self.fail(error);
        resolve();
        return;
      }
    });
    
    
  }
  
  
  
}

module.exports = TestAlphaCreateEntity
