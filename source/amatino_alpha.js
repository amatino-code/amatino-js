/*
 * Amatino JS
 * amatino_alpha.js
 * 
 * author: hugh@blinkybeach.com
 */

"use strict";
const Session = require('./session.js');
const ApiRequest = require('./_internal/api_request.js');

/*
 * 
 * 
 */
class AmatinoAlpha {

	constructor(email, secret, callback) {
    
    this._sessionCallback = callback;
    this._session = null;
    this._requestCallbacks = {};
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
    if (error === null) {
      this._sessionCallback(null, this);
    } else {
      this._sessionCallback(error, null);
    }
    
    return;
  }
  
  _loadResponse(requestTime, error, responseData) {
    
    const callback = this._requestCallbacks[requestTime];
    const _ = callback(error, responseData);
  
    return;
  }
	
	request(
    path,
		method,
		queryString,
		body,
    callback
	) {
		
    const requestTime = new Date().getTime();
    const self = this;
    this._requestCallbacks[requestTime] = callback;
    
    const _ = new ApiRequest(
      this._session,
      path,
      method,
      queryString,
      body,
      this._loadResponse.bind(self, requestTime)
    );

    return;
	}

}
