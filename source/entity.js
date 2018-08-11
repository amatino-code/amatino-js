/*
 * Amatino JS
 * Entity.js
 * 
 * author: hugh@blinkybeach.com
 */

"use strict";

const AmatinoTime = require('./_internal/am_time.js');
const _ApiRequest = require('./_internal/api_request.js');

const ENTITY_IMMUTABLE = 'Entity instances are immutable. Use' +
  ' the .update() method on an Entity instance to make changes'
  
const ENTITY_PATH = 'entities';

/**
* An Amatino entity is a economic body to be described by accounting
* information. Entities are described by Accounts, Transactions, and
* Entities.
* 
* Examples of potential Entities include: A legal company, a
* consolidated group of companies, a project, or a person.
*/
class Entity {

    constructor(
      session,
      id,
      ownerId,
      permissionsGraph,
      description,
      regionId,
      active
    ) {
      this._session = session;
      this._id = id;
      this._ownerId = ownerId;
      this._permissionsGraph = permissionsGraph;
      this._description = description;
      this._regionId = regionId;
      this._active = active;
      return;
    }
    
    get session() { return this._session }
    set session(x) { throw new Error(ENTITY_IMMUTABLE) }
    get id() { return this._id }
    set id(x) { throw new Error(ENTITY_IMMUTABLE) }
    get ownerId() { return this._ownerId }
    set ownerId(x) { throw new Error(ENTITY_IMMUTABLE) }
    get permissionsGraph() { return this._permissionsGraph }
    set permissionsGraph(x) { throw new Error(ENTITY_IMMUTABLE) }
    get description() { return this._description }
    set description(x) { throw new Error(ENTITY_IMMUTABLE) }
    get regionId() { return this._regionId }
    set regionId(x) { throw new Error(ENTITY_IMMUTABLE) }
    get active() { return this._active }
    set active(x) { throw new Error(ENTITY_IMMUTABLE) }

    static retrieve(
      session,
      entity,
      entityId,
      callback
    ) {
      const _ = _ApiRequest(
        session,
        ENTITY_PATH,
        'GET',
        null,
        '?entity_id=' + entityId,
        (error, jsonData) => {
          if error != null { callback(error, null); return }
          Entity._decode(
            jsonData[0],
            callback,
            session
          )
        }
      return;
    }
    
    static _decode(jsonData, callback, session) {
      try {
        const entity = new Entity(
          session,
          jsonData['entity_id'],
          jsonData['owner'],
          jsonData['permissions_graph'],
          jsonData['description'],
          jsonData['storage_region'],
          jsonData['active']
        )
        callback(null, entity);
        return;
      }
      catch(error) {
        callback(error, null);
        return;
      }
    }
}
