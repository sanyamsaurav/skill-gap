process.on('exit', (code) => {
  require('fs').writeFileSync('exit-reason.txt', `Exited with code ${code}\n${new Error().stack}`);
});
const oldExit = process.exit;
process.exit = function(code) {
  require('fs').writeFileSync('exit-call.txt', `process.exit called with ${code}\n${new Error().stack}`);
  oldExit.apply(process, arguments);
};

require('./index.js');
