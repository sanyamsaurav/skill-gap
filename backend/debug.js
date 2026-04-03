const { execSync } = require('child_process');
try {
  const out = execSync('node index.js', { encoding: 'utf-8' });
  console.log('OUT:', out);
} catch (err) {
  console.log('ERR HAS TIMEOUT OR CRASH');
  console.log('STDOUT:', err.stdout);
  console.log('STDERR:', err.stderr);
}
