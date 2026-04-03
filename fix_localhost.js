const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'd:\\project\\skill gap\\frontend\\src\\context\\AuthContext.jsx',
  'd:\\project\\skill gap\\frontend\\src\\components\\UploadResume.jsx',
  'd:\\project\\skill gap\\frontend\\src\\components\\GoPro.jsx',
  'd:\\project\\skill gap\\frontend\\src\\components\\Dashboard.jsx',
  'd:\\project\\skill gap\\frontend\\src\\components\\Chatboard.jsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace 'http://localhost:5002' with (import.meta.env.VITE_API_URL || 'http://localhost:5002')
    // We only want to replace instances inside quotes if they exist, but since it's just a string lit it varies.
    // E.g. 'http://localhost:5002/api...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api...`
    
    // Using a regex to find 'http://localhost:5002...' or "http://localhost:5002..."
    content = content.replace(/['"]http:\/\/localhost:5002([^'"]*)['"]/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}$1`");

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
