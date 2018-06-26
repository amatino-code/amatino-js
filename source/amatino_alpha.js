/*
 * Amatino JS
 * amatino_alpha.js
 * 
 * author: hugh@blinkybeach.com
 */

"use strict";
const Session = require('./session.js');

/*
 * 
 * 
 */
class AmatinoAlpha {

	constructor(email, secret, callback) {
    
    this._readyCallback = callback;
    this._session = null;
    const self = this;
    _ = Session(
      email,
      secret,
      this._loadSession.bind(self)
    );
    return;
  
	}
  
  _loadSession(error, session) {
    
    this._session = session;
    this._readyCallback(error, this);
    
    return;
  }
	
	request(
    path,
		method,
		queryString,
		body,
    callback
	) {
		
    
    
    return;
	}

}
