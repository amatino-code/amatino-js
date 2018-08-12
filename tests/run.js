/*
 * Amatino JS
 * run.js - Test run marshall
 * 
 * author: hugh@blinkybeach.com
 **/

const TestAlphaInitialise = require('./alpha/initialise.js');
const TestAlphaCreateEntity = require('./alpha/entity.js');
const TestAlphaCreateAccount = require('./alpha/account.js');
const TestAlphaCreateTransaction = require('./alpha/transaction.js');
const TestEntityOperations = require('./primary/entity.js');

const testSequence = [
  new TestAlphaInitialise(),
  new TestAlphaCreateEntity(),
  new TestAlphaCreateAccount(),
  new TestAlphaCreateTransaction(),
  new TestEntityOperations()
]

async function run(sequenceIndex) {
  if (sequenceIndex > (testSequence.length - 1)) {
    return;
  }
  const test = testSequence[sequenceIndex];
  await test.execute().then( () => {
    console.log(test.report());
    run(sequenceIndex + 1);
  });
  
}
run(0);
