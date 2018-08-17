/*
 * Amatino JS
 * initialise.js
 * 
 * author: hugh@blinkybeach.com
 */

const Test = require('../test.js');
const AmatinoAlpha = require('../../source/amatino_alpha.js');

class TestAlphaInitialise extends Test {
  
  constructor() {
    super("Initialise AmatinoAlpha");
    return
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
            if (!alpha) {
              this.fail('Alpha is falsey: ' + alpha);
              resolve();
              return;
            }
            if (!alpha.request) {
              this.fail('Alpha missing expected attributes');
              resolve();
              return;
            }
            this.pass();
            resolve();
            return;
          }
        );
      } catch(error) {
        this.fail(error);
        resolve();
        return;
      }
    });
    
    
  }
  
  
  
}

module.exports = TestAlphaInitialise
