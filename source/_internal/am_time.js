/*
 * Amatino JS
 * am_time.js
 * 
 * author: hugh@blinkybeach.com
 */

// Amatino API returns / expects dates in the form:
// "2017-01-07_17:22:16.51245"

class AmatinoTime {
  constructor(rawDateTimeString=null, dateObject=null) {
    if (rawDateTimeString == null) {
      this._dateObject = dateObject;
      this._string = this._encode(dateObject);
    } else {
      this._string = rawDateTimeString;
      this._dateObject = this._decode(rawDateTimeString);
    }
    return;
  }
  
  get encodedDate() { return this._string }
  set encodedDate(x) { throw Error("Immutable") }
  get decodedDate() { return this._dateObject }
  set decodedDate(x) { throw Error("Immutable") }
  
  _encode(date) {
    
    function padZero(integer) {
      if (integer >= 10) { return integer }
      return '0' + integer;
    }
    
    let dateString = '' + date.getUTCFullYear() + '-';
    dateString += padZero(date.getUTCMonth()) + '-';
    dateString += padZero(date.getUTCDate()) + '_';
    dateString += padZero(date.getUTCHour()) + ':';
    dateString += padZero(date.getUTCMinutes()) + ':';
    dateString += padZero(date.getUTCSeconds()) + '.';
    dateString += date.getUTCMilliseconds + '00';
    return dateString;
  }
  
  _decode(dateString) {
    const splitString = dateString.split('_');
    const datePart = splitString[0];
    const dateSplit = datePart.split('-');
    const year = dateSplit[0];
    const month = dateSplit[1] - 1;
    const day = dateSplit[2];
    const timePart = splitString[1];
    const timeSplit = timePart.split(':');
    const hour = timeSplit[1];
    const minute = timeSplit[2];
    const secondSplit = timeSplit[3].split('.');
    const second = secondSplit[0];
    const millisecond = secondSplit[1].substring(0,3);
    const date = new Date(Date.UTC(
      year, month, day, hour, minute, second, millisecond
    ));
    return date;
  }
  
  static encode(date) {
    return new AmatinoTime(null, date);
  }
  
  static decode(dateString) {
    return new AmatinoTime(date, null);
  }
    
}


module.exports = AmatinoTime;
