const filesystem = require('fs');


const package = JSON.parse(filesystem.readFileSync(
  './package.json',
  'utf-8'
));
const version = package['engines']['node'];
const requiredVersion = version.split('=')[1]

const requiredMajor = requiredVersion.split('.')[0];
const requiredMinor = requiredVersion.split('.')[1];

const runningVersion = process.version.split('v')[1];

const runningMajor = runningVersion.split('.')[0];
const runningMinor = runningVersion.split('.')[1];

if (runningMajor >= requiredMajor) {
  if (runningMinor >= requiredMinor) {
    process.exit(0);
  }
}

console.log(
  'Your installed Node.js version is not compatible with Amatino JS. \
You are running version ' + process.version + ' but Amatino JS needs \
at least ' + 'v' + requiredVersion + '.'
);

process.exit(1);
