const { execSync } = require('child_process');
const fs = require('fs');

try {
  let output = execSync('npm ls node-domexception').toString();
  fs.writeFileSync('npm_ls_output.txt', output, 'utf8');
} catch (e) {
  fs.writeFileSync('npm_ls_output.txt', e.stdout ? e.stdout.toString() : e.toString(), 'utf8');
}
