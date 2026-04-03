const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 
})
.then(() => {
  fs.writeFileSync('mongo-result.txt', 'SUCCESS!');
  process.exit(0);
})
.catch(err => {
  fs.writeFileSync('mongo-result.txt', 'ERROR: ' + err.message + '\n' + err.stack);
  process.exit(1);
});
