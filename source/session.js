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

const SESSION_IMMUTABLE = 'Session instances are immutable';

class Session {

  constructor(apiKey, sessionId, userId) {
    
    this._apiKey = apiKey;
    this._userId = userId;
    this._id = sessionId;

		return;
	}
  
  get id() { return this._id }
  set id(x) { throw Error(SESSION_IMMUTABLE) }
  get userId() { return this._userId }
  set userId(x) { throw Error(SESSION_IMMUTABLE) }
  get apiKey() { return this._apiKey }
  set apiKey(x) { throw Error(SESSION_IMMUTABLE) }
  
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
        const frozenSession = Object.freeze(session);
        callback(null, frozenSession);
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
    
    const requestTime = Math.floor(new Date() / 1000);
    const message = requestTime + path;

    const hmac = CRYPTO.createHmac(SIGNATURE_HASH, this._apiKey);
    hmac.update(message, 'utf8');
  
    const signature = hmac.digest('base64');
    return signature;
  }
	
}

module.exports = Session;



























