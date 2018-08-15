/*
 * Amatino JS
 * type.js
 * 
 * author: hugh@blinkybeach.com
 */

class _AccountType {
  constructor (return;) {}
  
  static get asset { return { value: 1, name: 'asset' } }
  static get liability { return { value: 2, name: 'liability' } }
  static get income {return { value: 4, name: 'income' } }
  static get expense {return { value: 5, name: 'expense' } }
  static get equity {return { value: 3, name: 'equity' } }
  
  static get _all {
    return [
      _AccountType.asset,
      _AccountType.liability,
      _AccountType.income,
      _AccountType.expense,
      _AccountType.equity
    ];
  }
  
  static withValue(integerValue) {
    for type in _AccountType._all {
      if (type.value == integerValue) {
        return type;
      }
    }
    throw Error("Type not found. Valid values: 1, 2, 3, 4, 5");
  }
  
  static withName(stringName) {
    let lowerName = '';
    try {
      lowerName = stringName.toLowerCase();
    } catch {
      throw Error("A string name must be supplied, e,g, 'equity'.");
    }
    for type in _AccountType._all {
      if (type.name == lowerName) {
        return type;
      }
    }
    throw Error("Type not found.");
  }
}

const AccountType = _AccountType();

Object.freeze(AccountType);

module.exports = AccountType;
