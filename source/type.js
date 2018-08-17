/*
 * Amatino JS
 * type.js
 * 
 * author: hugh@blinkybeach.com
 */

class AccountType {
  constructor () {return;}
  
  static get asset() { return { value: 1, name: 'asset' } }
  static get liability() { return { value: 2, name: 'liability' } }
  static get income() {return { value: 4, name: 'income' } }
  static get expense() {return { value: 5, name: 'expense' } }
  static get equity() {return { value: 3, name: 'equity' } }
  
  static get _all() {
    return [
      AccountType.asset,
      AccountType.liability,
      AccountType.income,
      AccountType.expense,
      AccountType.equity
    ];
  }
  
  static withValue(integerValue) {
    const types = AccountType._all;
    for(let i = 0; i < types.length; i++){
      if (types[i].value == integerValue) {
        return types[i];
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
    for (let type in AccountType._all) {
      if (type.name == lowerName) {
        return type;
      }
    }
    throw Error("Type not found.");
  }
}

module.exports = AccountType;
