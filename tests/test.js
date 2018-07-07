/*
 * Amatino JS
 * test.js
 * 
 * author: hugh@blinkybeach.com
 */

const DEFAULT_TIMEOUT = 1000 * 4;

const AmatinoAlpha = require('../source/amatino_alpha.js');

class Test {
  /*
   * Base class for Amatino JS testing
   */
  
  constructor(description) {
    this._description = description;
    this._didPass = null;
    this._hint = null;
    
    this._secret = this._loadSecret();
    this._email = this._loadEmail();
    this._timeout = DEFAULT_TIMEOUT;

    return;
  }
  
  execute() {
    throw 'Not implemented!';
  }
  
  _loadSecret() {
    const key = process.env.AMATINO_TEST_SECRET;
    if (key === undefined) {
      throw 'Missing AMATINO_TEST_SECRET environment variable'
    }
    return key;
  }
  
  _loadEmail() {
    const email = process.env.AMATINO_TEST_EMAIL;
    if (email === undefined) {
      throw 'Missing AMATINO_TEST_EMAIL environment variable'
    }
    return email;
  }
  
  secret() {return this._secret;}
  userId() {return this._userId;}
  email() {return this._email;}
  
  didFinish() {
    if (this._didPass == null) {
      return false
    }
    return true;
  }

  pass(hint=null) {
    if (this._didPass != null) {throw 'Test already passed/failed'}
    this._didPass = true;
    this._hint = hint;
    return;
  }
  
  fail(hint) {
    if (this._didPass != null) {throw 'Test already passed/failed'}
    this._didPass = false;
    this._hint = hint;
    return;
  }

  report() {
    if (this._didPass == null) {throw 'Test never passed or failed'};
    let report = '';
    if (this._didPass == true) {
      report += '[PASS] ';
    } else {
      report += '[FAIL] '
    }
    report += this._description;
    if (this._hint == null) {return report};
    report += '\n       ' + this._hint;
    return report;
  }
  
  stage(executionFunction) {
    return new Promise(resolve => {
      let _ = AmatinoAlpha.createWithEmail(
        this.email(),
        this.secret(),
        (error, alpha) => {
          if (error != null) {
            this.fail('Error: ' + error);
            resolve();
            return;
          }
          executionFunction(alpha, resolve);
          return;
        }
      );
    });
  }
}

module.exports = Test;
