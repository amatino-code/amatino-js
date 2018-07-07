/*
 * Amatino JS
 * session.js
 * 
 * author: hugh@amatino.io
 */
 
const CRYPTO = require('crypto');
const SESSION_PATH = '/session';
const SIGNATURE_HASH = 'sha512';

const ApiRequest = require('./_internal/api_request.js');

class Session {

  constructor(apiKey, sessionId, userId) {
    
    this._apiKey = apiKey;
    this._userId = userId;
    this._sessionId = sessionId;

		return;
	}
  
  static createWithEmail(email, secret, callback) {
    
    const body = this._generateBody(email, secret, null);
    
    let _ = new ApiRequest(
      null,
      SESSION_PATH,
      'POST',
      body,
      null,
      (error, response) => {
        if (error != null) {callback(error, null); return;}
        const session = new Session(
          response['api_key'],
          response['session_id'],
          response['user_id']
        );
        callback(null, Session);
        return;
      })
  }
  
  static _generateBody(email, secret, userId) {
    const body = {
      "secret": secret,
      "user_id": userId,
      "account_email": email
    }
    return body;
  }
  
  signature(bodyData, path) {
    
    const hmac = CRYPTO.createHmac(SIGNATURE_HASH, this._apiKey);
    bodyJson = JSON.stringify(bodyData);
    hmac.update(bodyJson);

    return hmac.digest('base64');
  }
	
}

module.exports = Session;
