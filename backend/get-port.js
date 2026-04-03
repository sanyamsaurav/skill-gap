const { execSync } = require('child_process');
const fs = require('fs');
try {
  const stdout = execSync('netstat -ano | findstr :5002').toString();
  fs.writeFileSync('port.txt', stdout);
} catch (e) {
  fs.writeFileSync('port.txt', 'NOTHING OR ERR: ' + e.message);
}
