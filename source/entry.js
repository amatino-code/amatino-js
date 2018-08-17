/*
 * Amatino JS
 * entry.js
 * 
 * author: hugh@blinkybeach.com
 */

const Side = require('./side.js');
const IMMUTABLE = 'Entry instances are immutable';

class Entry {
  constructor(
    side,
    description,
    account,
    amount,
    _accountId = null
  ) {
    this._side = side;
    this._description = description;
    if (_accountId != null) {
      this._accountId = _accountId;
    } else {
      this._accountId = account.id;
    }
    this._amount = amount;
    return;
  }

  get side() { return this._side }
  set side(x) { throw Error(IMMUTABLE) }
  get description() { return this._description }
  set description(x) { throw Error(IMMUTABLE) }
  get accountId() { return this._accountId }
  set accountId(x) { throw Error(IMMUTABLE) }
  get amount() { return this._amount }
  set amount(x) { throw Error(IMMUTABLE) }

  static decode(json) {
    let side = null;
    if (json['side'] == Side.debit.value) {
      side = Side.debit;
    } else {
      side = Side.credit;
    }
    const entry = new Entry(
      side,
      json['description'],
      null,
      json['amount'],
      json['account_id']
    );
    return entry;
  }

  static decodeMany(json) {
    let entries = new Array();
    for (let i = 0; i < json.length; i ++) {
      entries.push(Entry.decode(json[i]));
    }
    return entries;
  }
  
  encode() {
    const encodedEntry = {
      'side': this._side.value,
      'description': this._description,
      'account_id': this._accountId,
      'amount': this._amount
    }
    return encodedEntry;
  }
  
  static encodeMany(entries) {
    let encodedEntries = new Array();
    for (let i = 0; i < entries.length; i++) {
      encodedEntries.push(entries[i].encode());
    }
    return encodedEntries;
  }
  

}

module.exports = Entry;
