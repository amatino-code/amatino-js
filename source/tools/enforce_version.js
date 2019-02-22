const filesystem = require('fs');


const package = JSON.parse(filesystem.readFileSync(
  './package.json',
  'utf-8'
));
const version = package['engines']['node'];
const requiredVersion = version.split('=')[1]

const requiredMajor = Number(requiredVersion.split('.')[0]);
const requiredMinor = Number(requiredVersion.split('.')[1]);

const runningVersion = process.version.split('v')[1];

const runningMajor = Number(runningVersion.split('.')[0]);
const runningMinor = Number(runningVersion.split('.')[1]);

if (runningMajor > requiredMajor) {
  process.exit(0);
}
if (runningMajor == requiredMajor) {
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
