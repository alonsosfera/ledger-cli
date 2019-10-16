const { income } = require('../Income.ledger')

module.exports = (args) => {
  console.log('This is your income')
  console.log(args);
  for(i in income){
    console.log(i);
  }
}
