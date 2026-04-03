const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
  try {
    const r = execSync(cmd).toString();
    console.log(`[${cmd}] success\n${r}`);
    return r;
  } catch (e) {
    console.log(`[${cmd}] failed\n${e.stdout ? e.stdout.toString() : e.toString()}`);
    return '';
  }
}

const out = [];
out.push(run('git add .'));
out.push(run('git status'));
out.push(run('git reset do_push.js do_git_commit.js')); // Ensure we don't commit our script
out.push(run('git commit -m "Add vercel.json for multi-service deployment"'));
out.push(run('git push origin main 2>&1'));

fs.writeFileSync('git_out_commit.txt', out.join('\n'), 'utf8');
