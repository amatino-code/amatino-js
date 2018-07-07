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
 * Thin wrapper around HTTP requests to the Amatino API. Abstracts
 * away HMAC calculation. Initialise with Amatino account credentials
 * and then utilise the .request() method per Amatino's HTTP 
 * documentation.
 */
class AmatinoAlpha {

	constructor(session) {
    
    this._session = session;
  
    return;
  
	}
  
  static createWithEmail(email, secret, callback) {
    if (!email || !secret) {throw 'Missing email or secret'}
    let _ = Session.createWithEmail(
      email,
      secret,
      (error, session) => {
        if (error != null) {callback(error, null); return;}
        const alpha = new AmatinoAlpha(session);
        callback(null, alpha);
        return;
      })
  }
  
	
	request(
    path,
		method,
		queryString,
		body,
    callback
	) {
    
    let urlParameters = null;
    if (queryString) {
      urlParameters = queryString;
    }

    const _ = new ApiRequest(
      this._session,
      path,
      method,
      body,
      urlParameters,
      (error, responseData) => {
        callback(error, responseData);
      }
    );

    return;
	}

}

module.exports = AmatinoAlpha;
