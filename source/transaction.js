/*
 * Amatino JS
 * Transaction.js
 * 
 * author: hugh@blinkybeach.com
 */

"use strict";

const AmatinoTime = require('./_internal/am_time.js');
const Entry = require('./entry.js');
const _ApiRequest = require('./_internal/api_request.js');

const TX_REQUIRED_ARGS_MISSING = 'The session, entity, and completion' + 
	' parameters are required'

const TX_TRANSACTION_ID_CHOICES = 'The transactionId parameter is' +
	' required. Supply either an integer(when retreving an existing' +
	' Transaction), or null (when creating a new one)';

const TX_NEW_REQUIRED_ARGS = 'When creating a new Transaction, with' +
	' parameter transactionId supplied as null, parameters' +
	' transactionTime, description, globalUnit, customUnit, and' +
	' entries must be supplied.';

const TX_IMMUTABLE = 'Transaction instances are immutable. Use the' +
  ' .update() method on a Transaction instance to make changes'

/**
 * A Transaction is an exchange of value between two or more Accounts.
 * For example: the raising of an invoice; the incurring of a liability;
 * or the receipt of a payment. Many Transactions together, each
 * touching the same Account, form an Account Ledger, and the cumulative
 * sum of the Transactions form an Account Balance.
 * 
 * Transactions are composed of Entries, each of which include a debit
 * or a credit (the fundamental Sides). The sum of all the debits and
 * credits in all the Entries that compose a Transaction must always
 * equal zero.  
 * 
 */
class Transaction {
  
  static get PATH {
  }
  
	constructor(
		session,
		entity,
    transactionId,
		transactionTime,
    versionTime,
    version,
    authorId,
    active,
		description,
		globalUnitId,
		customUnitId,
		entries
	){

    this.id = transactionId;
    this._session = session;
    this._entity = entity;
    this._transactionTime = transactionTime;
    this._versionTime = versionTime;
    this._version = version;
    this._authorId = authorId;
    this._active = active;
    this._description = description;
    this._globalUnitId = globalUnitId;
    this._customUnitId = customUnitId;
    this._entries = entries;
		return;
	}
  
  get id() { return this._id }
  set id(x) { throw new Error(TX_IMMUTABLE) }
  get session() { return this._session }
  set session(x) { throw new Error(TX_IMMUTABLE) }
  get entity() { return this._entity }
  set entity(x) { throw new Error(TX_IMMUTABLE) }
  get transactionTime() { return this._transactionTime }
  set transactionTime(x) { throw new Error(TX_IMMUTABLE) }
  get versionTime() { return this._versionTime }
  set versionTime(x) { throw new Error(TX_IMMUTABLE) }
  get version() { return this._version }
  set version(x) { throw new Error(TX_IMMUTABLE) }
  get authorId() { return this._authorId }
  set authorId(x) { throw new Error(TX_IMMUTABLE) }
  get active() { return this._active }
  set active(x) { throw new Error(TX_IMMUTABLE) }
  get description() { return this._description }
  set description(x) { throw new Error(TX_IMMUTABLE) }
  get globalUnitId() { return this._globalUnitId }
  set globalUnitId(x) { throw new Error(TX_IMMUTABLE) }
  get customUnitId() { return this._customUnitId }
  set customUnitId(x) { throw new Error(TX_IMMUTABLE) }
  get entries() { return this._entries }
  set entries(x) { throw new Error(TX_IMMUTABLE) }
  
  static retrieve(
    session,
    entity,
    transactionId,
    callback
  ) {
    const _ = _ApiRequest(
      session,
      TRANSACTION_PATH,
      'GET',
      null,
      '?entity_id=' + entity.id + '&transaction_id' + transactionId,
      (error, jsonData) => {
        if (error != null) { callback(error, null); return }
        Transaction._decode(
          jsonData[0],
          callback,
          session,
          entity
        );
        return;
      }
    )
    
		return;
	}

	
	static create(
    session,
    entity,
    transactionTime,
    description,
    globalUnitId = null,
    customUnitId = null,
    entries,
    callback
  ) {
    
    const unitsValid = Transaction.validateUnits(
      globalUnitId,
      customUnitId
    );
    if ( unitsValid != "valid") {
      callback(unitsValid, null);
      return;
    }
    
    const txTime = AmatinoTime.encode(transactionTime);
    const arguments = {
      'transaction_time': txTime.encodedDate,
      'description': description,
      'global_unit_denomination': globalUnitId,
      'custom_unit_denomination': customUnitId,
      'entries': Entry.encodeMany(entries)
    }
    const _ = _ApiRequest(
      this.session,
      TRANSACTION_PATH,
      'POST',
      '?entity_id=' + this.entity.id,
      (error, jsonData) => {
        if (error != null) { callback(error, null); return }
        Transaction._decode(
          jsonData[0],
          callback,
          this.session,
          this.entity
        );
        return;
      }
    )
    
		return;
	}
  
	update(
    transactionTime,
    description,
    globalUnitId = null,
    customUnitId = null,
    entries,
    callback
  ) {
    
    const unitsValid = Transaction.validateUnits(
      globalUnitId,
      customUnitId
    );
    if ( unitsValid != "valid") {
      callback(unitsValid, null);
      return;
    }
    const txTime = AmatinoTime.encode(transactionTime);
    const arguments = {
      'transaction_id': this.id;
      'transaction_time': txTime.encodedDate,
      'description': description,
      'global_unit_denomination': globalUnitId,
      'custom_unit_denomination': customUnitId,
      'entries': Entry.encodeMany(entries)
    }
    const _ = _ApiRequest(
      this.session,
      TRANSACTION_PATH,
      'PUT',
      '?entity_id=' + this.entity.id,
      (error, jsonData) => {
        if (error != null) { callback(error, null); return }
        Transaction._decode(
          jsonData[0],
          callback,
          this.session,
          this.entity
        );
        return;
      }
    )
		return;
	}
	
	delete() {
    throw Error('Not Implemented');
		return;
	}
	
	restore() {
    throw Error('Not Implemented');
		return;
	}
  
  static _validateUnits(globalUnitId, customUnitId) {
    if (globalUnitId == null  && customUnitId == null) {
      return Error("Supply either Global or Custom unit ID");
    }
    if (globalUnitId != null && customUnitId != null) {
      return Error("Supply either Global or Custom unit ID, not both");
    }
    return "valid";
  }
  
  static _decode(jsonData, callback, session, entity) {
    try {
      const transactionTime = new AmatinoTime(
        jsonData['transaction_time']
      );
      const versionTime = new AmatinoTime(jsonData['version_time');
      const transaction = Transaction(
        session,
        entity,
        jsonData['transaction_time'],
        transactionTime.decodedDate,
        versionTime.decodedDate,
        jsonData['version'],
        jsonData['author_id'],
        jsonData['active'],
        jsonData['description'],
        jsonData['global_unit_denomination'],
        jsonData['custom_unit_denomination'],
        Entry.decodeMany(jsonData['entries'])
      );
      callback(null, transaction);
      return;
    } catch(error) {
      callback(error, null);
      return;
    }
  }
}

module.exports = Transaction;
