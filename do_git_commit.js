const { execSync } = require('child_process');
const fs = require('fs');

try {
  let output = execSync('git add .').toString();
  output += execSync('git commit -m "Commit recent changes"').toString();
  output += execSync('git pull --rebase origin main').toString();
  output += execSync('git push origin main 2>&1').toString();
  fs.writeFileSync('git_commit_log.txt', output, 'utf8');
} catch (e) {
  fs.writeFileSync('git_commit_log.txt', e.stdout ? e.stdout.toString() : e.toString(), 'utf8');
}
