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
  
  static get PATH() { return '/transactions' }
  
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

    this._id = transactionId;
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
    const requestData = [{
      "transaction_id": transactionId,
      "global_unit_denomination": null,
      "custom_unit_denomination": null,
      "version": null
    }]
    const _ = new _ApiRequest(
      session,
      Transaction.PATH,
      'GET',
      requestData,
      '?entity_id=' + entity.id,
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
  
	static createWithGlobalUnit(
    session,
    entity,
    transactionTime,
    description,
    globalUnitId,
    entries,
    callback
  ) {
    
    Transaction._create(
      session,
      entity,
      transactionTime,
      description,
      globalUnitId,
      null,
      entries,
      callback
    )

		return;
	}
  
	static createWithCustomUnit(
    session,
    entity,
    transactionTime,
    description,
    customUnitId,
    entries,
    callback
  ) {
    
    Transaction._create(
      session,
      entity,
      transactionTime,
      description,
      null,
      customUnitId,
      entries,
      callback
    )

		return;
	}
	
	static _create(
    session,
    entity,
    transactionTime,
    description,
    globalUnitId = null,
    customUnitId = null,
    entries,
    callback
  ) {
    
    const unitsValid = Transaction._validateUnits(
      globalUnitId,
      customUnitId
    );
    if ( unitsValid != "valid") {
      callback(unitsValid, null);
      return;
    }
    
    const txTime = AmatinoTime.encode(transactionTime);
    const requestData = [{
      'transaction_time': txTime.encodedDate,
      'description': description,
      'global_unit_denomination': globalUnitId,
      'custom_unit_denomination': customUnitId,
      'entries': Entry.encodeMany(entries)
    }]
    const _ = new _ApiRequest(
      session,
      Transaction.PATH,
      'POST',
      requestData,
      '?entity_id=' + entity.id,
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
  
	update(
    transactionTime,
    description,
    globalUnitId = null,
    customUnitId = null,
    entries,
    callback
  ) {
    
    const unitsValid = Transaction._validateUnits(
      globalUnitId,
      customUnitId
    );
    if ( unitsValid != "valid") {
      callback(unitsValid, null);
      return;
    }
    const txTime = AmatinoTime.encode(transactionTime);
    const requestData = [{
      'transaction_id': this.id,
      'transaction_time': txTime.encodedDate,
      'description': description,
      'global_unit_denomination': globalUnitId,
      'custom_unit_denomination': customUnitId,
      'entries': Entry.encodeMany(entries)
    }]
    const _ = new _ApiRequest(
      this.session,
      Transaction.PATH,
      'PUT',
      requestData,
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
	
  /* Thought: `delete` is a reserved word, but it seems to be fine to
   * use it as a method name. */
	delete(callback) {
    let urlParameters =  '?entity_id=' + this.entity.id;
    urlParameters += '&transaction_id=' + this.id;
    const _ = new _ApiRequest(
      this.session,
      Transaction.PATH,
      'DELETE',
      null,
      urlParameters,
      (error, jsonData) => {
        if (error != null) { callback(error, null); return }
        Transaction._decode(
          jsonData[0],
          callback,
          this.session,
          this.entity
        );
      }
    )
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
      const versionTime = new AmatinoTime(jsonData['version_time']);
      let guid = jsonData['global_unit_denomination'];
      if (guid != null) { guid = parseInt(guid) };
      let cuid = jsonData['custom_unit_denomination'];
      if (cuid != null) { cuid = parseInt(cuid) };
      const transaction = new Transaction(
        session,
        entity,
        parseInt(jsonData['transaction_id']),
        transactionTime.decodedDate,
        versionTime.decodedDate,
        parseInt(jsonData['version']),
        /* We don't parseInt the author ID as this is assuredly a
         * 64 bit integer */
        jsonData['author'],
        jsonData['active'],
        jsonData['description'],
        guid,
        cuid,
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
