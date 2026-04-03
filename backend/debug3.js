const child = require('child_process').spawnSync('node', ['index.js']);
require('fs').writeFileSync('debug-out.txt', 'STDOUT:\n' + child.stdout.toString() + '\nSTDERR:\n' + child.stderr.toString());
