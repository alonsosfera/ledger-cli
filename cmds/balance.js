const income  = require('../Income.ledger')
var fs = require('fs');

module.exports = (args) => {
  fs.readFile(income, 'utf8', function(err, contents) {
    console.log(contents);
  });
  console.log(args._[1]);
  //console.log('This is a balance')
  console.log(args);
  //console.log('\x1b[33m%s\x1b[0m', 'hi!')
}
