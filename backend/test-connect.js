const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sanyamsaurav283_db_user:SFUxa72SRXpBbYuc@cluster0.e9whpsa.mongodb.net/skillgap?retryWrites=true&w=majority&appName=Cluster0').then(() => {
  console.log('SUCCESS');
  process.exit(0);
}).catch(err => {
  console.log('FAIL:', err.message);
  process.exit(1);
});
