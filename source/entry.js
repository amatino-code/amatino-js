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
    accountId,
    amount
  ) {
    this._side = side;
    this._description = description;
    this._accountId = accountId;
    this._amount = amount;
    return;
  }

  get side { return this._side }
  set side { throw Error(IMMUTABLE) }
  get description { return this._description }
  set description { throw Error(IMMUTABLE) }
  get accountId { return this._accountId }
  set accountId { throw Error(IMMUTABLE) }
  get amount { return this._amount }
  set amount { throw Error(IMMUTABLE }

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
      json['account_id'],
      json['amount']
    );
    return entry;
  }

  static decodeMany(json) {
    let entries = new Array();
    for (let rawEntry in json) {
      entries.push(Entry.decode(rawEntry));
    }
    return entries;
  }

}

module.exports = Entry;
