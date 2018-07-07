/*
 * Amatino JS
 * _api_request.js
 * 
 * author: hugh@blinkybeach.com
 */
 
const VALID_METHODS = ['GET', 'PUT', 'PATCH', 'DELETE', 'POST'];
const HTTPS = require('http');
const API_HOSTNAME = "api.amatino.io"
const USER_AGENT = 'Amatino Node.js Library';
const HEADER_SIGNATURE_KEY = 'X-Signature';
const HEADER_SESSION_KEY = 'X-Session-ID';
const TIMEOUT_MILLISECONDS = 1000;
const QUOTE_EXPRESSION = new RegExp(
  /(?<!")(?<!-)(?<!:)(?<!\.)(\b\d+\b)(?!")(?!:)(?!-)/g
); // https://regex101.com/r/qVQYA7/2

class _ApiRequest {

  constructor(
    session,
    path,
    method,
    bodyData,
    urlParameters,
    callback
  ) {

    this._callback = callback;
    
    let fullPathCalc = null;
    if (urlParameters === null) {
      fullPathCalc = path;
    } else {
      fullPathCalc = path + urlParameters;
    }
    const fullPath = fullPathCalc;
    const headers = this._buildHeaders(session, bodyData, path);
    const requestOptions = {
      'hostname': API_HOSTNAME,
      'method': method,
      'path': fullPath,
      'headers': headers,
      'timeout': TIMEOUT_MILLISECONDS
    }
    
    const request = HTTPS.request(requestOptions, (response) => {
      response.setEncoding('utf8');
      let responseBody = '';
      response.on('data', (chunk) => {
        responseBody += chunk;
      });
      response.on('end', () => {
        if (response.statusCode != 200) {
            const code = response.statusCode;
            const errorDescription = 'Code: ' + code + ', data: ';
            const error = Error(errorDescription + responseBody);
            this._callback(error, null);
            return;
        }
        let responseJson = null;
        try {
          /* 
           * While all moneytary amounts are transmitted as strings, the
           * Amatino API makes liberal use of 64-bit integers as
           * identifiers. For example, User ID's and Session ID's. 
           * Because JavaScript has no native 64-bit integer support,
           * these ID's get truncated on JSON parse. No arithmetic is
           * performed on these identifers so we will convert them to
           * strings before parsing.
           * */
          const quotedBody = responseBody.replace(
            QUOTE_EXPRESSION,
            '\"$&\"'
          );
          responseJson = JSON.parse(quotedBody);
        } catch (error) {
          const errorDescription = 'JSON parse failed. Body: ';
          const amError = Error(errorDescription + responseBody);
          this._callback(amError, null);
          return;
        }
        this._callback(null, responseJson);
      });
    });
    
    request.on('timeout', () => {
      request.abort();
      this._callback(new Error("Api request timeout"), null);
      return;
    });
    
    request.on('error', (error) => {
      this._callback(error, null);
      return;
    });
    request.write(JSON.stringify(bodyData));
    request.end();
    
    return;
  }

  _buildHeaders(session, bodyData, path) {
      
    let headers = {'User-Agent': USER_AGENT};
    
    if (session) {
      headers[HEADER_SIGNATURE_KEY] = session.signature(bodyData, path);
      headers[HEADER_SESSION_KEY] = session.id();
    }
    
    if (bodyData === null) {
      return headers;
    }
    
    const contentLength = Buffer.byteLength(JSON.stringify(bodyData));
    headers['Content-Length'] = contentLength;
    headers['Content-Type'] = 'application/json';
    
    return headers;
    
  }

}

module.exports = _ApiRequest
