/*
 * Amatino JS
 * Transaction.js
 * 
 * author: hugh@blinkybeach.com
 */

"use strict";

const TX_REQUIRED_ARGS_MISSING = 'The session, entity, and completion' + 
	' parameters are required'

const TX_TRANSACTION_ID_CHOICES = 'The transactionId parameter is' +
	' required. Supply either an integer(when retreving an existing' +
	' Transaction), or null (when creating a new one)';

const TX_NEW_REQUIRED_ARGS = 'When creating a new Transaction, with' +
	' parameter transactionId supplied as null, parameters' +
	' transactionTime, description, globalUnit, customUnit, and' +
	' entries must be supplied.';


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
 * You may initialise a Transaction object in one of two ways:
 * 
 * 1. Retrieve an existing Transaction. Supply the following parameters:
 *	 	- session
 * 		- entity
 * 		- completion
 * 		- transactionId
 * 
 * 2. Create a new Transaction. Supply the following parameters:
 * 		- session
 * 		- entity
 * 		- completion
 * 		- transactionId (supply null)
 * 		- transactionTime
 * 		- description
 * 		- globalUnit
 * 		- customUnit
 * 		- entries
 * 
 */
class Transaction {
	constructor(
		session,
		entity,
		completion,
		transactionId,
		transactionTime,
		description,
		globalUnit,
		customUnit,
		entries
	){

		if (
			session == null
			|| session == undefined
			|| entity == null
			|| entity == undefined
			|| completion == null
			|| completion == undefined
		) {
			throw Error(TX_REQUIRED_ARGS_MISSING);
		}
		
		if (
			transactionId == undefined
		) {
			throw Error(TX_TRANSACTION_ID_CHOICES);
		}
		
		if (
			transaction_id == null
			&& (
				transactionTime == undefined
				|| transactionTime == null
				|| description == undefined
				|| description == null
				|| globalUnit == undefined
				|| customUnit == null
				|| entries == undefined
				|| entries == null
			) 
		) {
			throw Error(TX_NEW_REQUIRED_ARGS);
		}
		
		if (transaction_id == null) {
			this._new_tx_args = new _NewTransactionArguments(
				transactionTime,
				description,
				globalUnit,
				customUnit,
				entries
			)
			this._id = null;
		} else {
			this._new_tx_args == null;
			this._id = transaction_id;
		}
	}
}
