/*
 * Amatino JS
 * session.js
 * 
 * author: hugh@amatino.io
 */
 
const CRYPTO = require('crypto');
const SESSION_PATH = '/sessions';
const SIGNATURE_HASH = 'sha512';

const ApiRequest = require('./_internal/api_request.js');

class Session {

  constructor(email, secret, userId, callback) {
    
    if (email === null && userId === null) {
      throw 'Supply either email or userId';
    }
    
    if (email != null && userId != null) {
      throw 'Supply either email or userId, but not both';
    }
    
    if (secret === null) {
      throw 'secret is required';
    }
    
    this._apiKey = null;
    this._userId = null;
    this._sessionId = null;
    this._callback = callback;
    
    const bodyData = {
      'user_id': userId,
      'secret': secret,
      'email': email
    }
    
    const self = this;
  
    const _ = ApiRequest(
      null,
      SESSION_PATH,
      'POST',
      bodyData,
      null,
      this._requestCallback.bind(self)
    );

		return;
	}

  _requestCallback(error, responseData) {
      
      if (error != null) {
        this._callback(error, null);
      }
      
      this._apiKey = responseData['api_key'];
      this._userId = responseData['user_id'];
      this._sessionId = responseData['session_id'];
      
      this._callback(null, this);
      
      return;
  }
  
  signature(bodyData, path) {
    
    const hmac = CRYPTO.createHmac(SIGNATURE_HASH, this._apiKey);
    bodyJson = JSON.stringify(bodyData);
    hmac.update(bodyJson);

    return hmac.digest('base64');
  }
	
}

module.exports = Session;
