const TestAlphaInitialise = require('./alpha/initialise.js');
const TestAlphaCreateEntity = require('./alpha/entity.js');


const testAlphaInitialise = new TestAlphaInitialise();
const testAlphaCreateEntity = new TestAlphaCreateEntity();
const testSequence = [
  new TestAlphaInitialise(),
  new TestAlphaCreateEntity()
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
