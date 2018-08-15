/*
 * Amatino JS
 * account.js
 * 
 * author: hugh@blinkybeach.com
 */

"use strict";

const AccountType = require('./type.js');
const _ApiRequest = require('./_internal/api_request.js');

const AC_IMMUTABLE = 'Account instances are immutable. Use the' +
  ' .update() method on an Account instance to make changes'

class Account {
  
  static get PATH { return '/accounts' }
  
  constructor(
    session,
    entity,
    accountId,
    name,
    type,
    parentAccountId,
    globalUnitId,
    customUnitId,
    counterPartyEntityId,
    description,
    colour
  ) {
    
    this._session = session;
    this._entity = entity;
    this._id = accountId;
    this._name = name;
    this._type = type;
    this._parentAccountId;
    this._globalUnitId = globalUnitId;
    this._customUnitId = customUnitId;
    this._counterPartyEntityId = counterPartyEntityId;
    this._description = description;
    this._colour = colour;
    return;
  }
  
  get id() { return this._id }
  set id(x) { throw new Error(AC_IMMUTABLE) }
  get session() { return this._session }
  set session(x) { throw new Error(AC_IMMUTABLE) }
  get entity() { return this._entity }
  set entity(x) { throw new Error(AC_IMMUTABLE) }
  get name() { return this._name }
  set name(x) { throw new Error(AC_IMMUTABLE) }
  get type() { return this._type }
  set type(x) { throw new Error(AC_IMMUTABLE) }
  get parentAccountId() { return this._parentAccountId }
  set parentAccountId(x) { throw new Error(AC_IMMUTABLE) }
  get globalUnitId() { return this._globalUnitId }
  set globalUnitId(x) { throw new Error(AC_IMMUTABLE) }
  get customUnitId() { return this._customUnitId }
  set customUnitId(x) { throw new Error(AC_IMMUTABLE) }
  get counterPartyEntityId() { return this._counterPartyEntityId }
  set counterPartyEntityId(x)  { throw new Error(AC_IMMUTABLE) }
  get description() { return this._description }
  set description(x) { throw new Error(AC_IMMUTABLE) }
  get colour() { return this._colour }
  set colour(x) { throw new Error(AC_IMMUTABLE) }
  
  static retrieve(
    session,
    entity,
    accountId,
    callback
  ) {
    try {
      const _ = _ApiRequest(
        session,
        Transaction.PATH,
        'GET',
        null,
        '?entity_id=' + entity.id + '&account_id=' + accountId,
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
      );
    } catch(error) {
      callback(error, null);
      return;
    }
    return;
  }
  
  static createWithGlobalUnitDenomination(
    session,
    entity,
    name,
    type,
    parent,
    globalUnitId,
    counterPartyEntity,
    description,
    colour,
    callback
  ) {
   Account.create(
    session,
    entity,
    name,
    type,
    parent,
    globalUnitId,
    null,
    counterPartyEntity,
    description,
    colour,
    callback
   );
   return; 
  }
  
  static createWithCustomUnitDenomination(
    session,
    entity,
    name,
    type,
    parent,
    customUnitId,
    counterPartyEntity,
    description,
    colour,
    callback
  ) {
   Account.create(
    session,
    entity,
    name,
    type,
    parent,
    null,
    customUnitId,
    counterPartyEntity,
    description,
    colour,
    callback
   );
   return; 
  }
  
  static _create(
    session,
    entity,
    name,
    type,
    parent,
    globalUnitId,
    customUnitId,
    counterPartyEntity,
    description,
    colour,
    callback
  ) {
    try {
      
      jsonData = [{
        'name': name,
        'description': description,
        'type': type.value,
        'parent_account_id': parent.id,
        'global_unit_id': globalUnitId,
        'custom_unit_id': customUnitId,
        'counterparty_entity_id': counterPartyEntity.id,
        'color': colour
        
      }]
      const _ = _ApiRequest(
        session,
        Account.PATH,
        'POST',
        jsonData,
        null,
        (error, jsonData) => {
          if (error != null) { callback(error, null); return }
          Account._decode(jsonData[0], callback, session, entity);
          return;
        }
        
      );
    } catch(error) {
      callback(error, null); return;
    }
  }
  
  update(
    name,
    type,
    parentAccountId,
    globalUnitId,
    customUnitId,
    counterPartyEntityId,
    description,
    colour,
    callback
  ) {
    try {
      jsonData = [{
        'account_id': this.id,
        'name': name,
        'type': type.value,
        'parent_account_id': parent.id,
        'global_unit_id': globalUnitId,
        'custom_unit_id': customUnitId,
        'counterparty_entity_id': counterPartyEntityId,
        'description': description,
        'color': colour
      }]
      const _ = _ApiRequest(
        this.session,
        Account.PATH,
        'PUT',
        null,
        '?entity_id=' + this.entity.id,
        (error, jsonData) => {
          if (error != null) { callback(error, null); return; }
          Account._decode(
            jsonData[0],
            callback,
            session,
            entity
          );
        }
      );
    } catch(error) {
      callback(error, null); return;
    }
    
    return;
  }
  
  delete(
    entryReplacementAccount,
    deleteChildren,
    newChildParentAccount,
    callback
  ) {
    try {
      let newChildParent = null;
      if (newChildParentAccount) {
        newChildParent = newChildParentAccount.id;
      }
      jsonData = [{
        "target_account_id": this.id,
        "entry_replacement_account_id": entryReplacementAccount.id,
        "new_child_parent_account_id": newChildParent,
        "delete_children": deleteChildren
      }]
      const _ = _ApiRequest(
        this.session,
        Account.PATH,
        'DELETE',
        jsonData,
        '?entity_id=' + this.entity.id,
        (error, jsonData) => {
          if (error != null) { callback(error, null); return }
          callback(null, jsonData);
          return;
        }
      )
    } catch (error) {
      callback(error, null);
    }
  }

  static _decode(jsonData, callback, session, entity) {
    try {
      const account = new Account(
       session,
       entity,
       jsonData['account_id'],
       jsonData['name'],
       AccountType.withValue(jsonData['type']),
       jsonData['parent_account_id'],
       jsonData['global_account_id'],
       jsonData['custom_account_id'],
       jsonData['counterparty_entity_id'],
       jsonData['description'],
       jsonData['color']
      )
      callback(null, account);
      return;
    } catch(error) {
      callback(error, null); return;
    }
  }
}
