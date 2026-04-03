try {
  require('./index.js');
} catch (err) {
  require('fs').writeFileSync('clean-error.txt', err.stack);
}
