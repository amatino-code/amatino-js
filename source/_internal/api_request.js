/*
 * Amatino JS
 * _api_request.js
 * 
 * author: hugh@blinkybeach.com
 */
 
 const HTTPS = require('https');
 const NO_SESSION_PATHS = ['sessions];
 const VALID_METHODS = ['GET', 'PUT', 'PATCH', 'DELETE', 'POST'];
 const HTTPS = require('https');
 const API_HOSTNAME = 'api.amatino.io';
 const USER_AGENT = 'Amatino Node.js Library';
 const HEADER_SIGNATURE_KEY = 'X-Signature';
 const HEADER_SESSION_KEY = 'X-Session-ID';
 const TIMEOUT_MILLISECONDS = 3000;
 
 class _ApiRequest() {
  
  constructor(
    session,
    path,
    method,
    bodyData,
    urlParameters,
    callback
  ) {
    this._callback = callback;
    
    if (
      session === null
      && NO_SESSION_PATHS.indexOf(path) >= 0
    ) {
      throw 'Requests to ' + path + ' require a Session.';
    }
    
    if !(VALID_METHODS.indexOf(method) >= 0) {
      throw 'Method ' + method + ' invalid or not supported';
    }
    
    if (urlParameters === null) {
      const fullPath = path;
    } else {
      const fullPath = path + urlParameters.queryString();
    }

    const headers = this._buildHeaders(session, bodyData, path);
    
    const requestOptions = {
      'hostname': API_HOSTNAME
      ,'method': method,
      ,'path': path + urlParameters
      ,'headers': headers
      ,'timeout': TIMEOUT_MILLISECONDS
    }
    
    const request = HTTPS.request(requestOptions, (response) => {
      response.setEncoding('utf8');
      let responseBody = '';
      response.on('data', (chunk) => {
        responseBody += chunk;
      });
      response.on('end', () => {
        const responseJson = JSON.parse(responseBody);
        this._callback(null, responseJson);
      });
    });
    
    request.on('error', (error) => {
      this._callback(error, null);
    }
    
    request.write(JSON.stringify(bodyData));
    request.end();
    
    return;
  }
  
  _buildHeaders(session, bodyData, path) {
      
    let headers = {'User-Agent': USER_AGENT};
    if (session === null) {
      return headers
    }
    
    headers[HEADER_SIGNATURE_KEY] = session.signature(bodyData, path);
    headers[HEADER_SESSION_KEY] = session.id();
    
    if (bodyData === null) {
      return headers;
    }
    
    headers['Content-Type'] = 'application/json';
    const contentLength = Buffer.byteLength(JSON.stringify(postData));
    headers['Content-Length'] = contentLength;
    
    return headers;
    
  }

 }
