//const { income } = require('../Income.ledger')

module.exports = (args) => {
  //args._[1]
  if(args.file){
    console.log(`Print from "${args.file}"`);
  }else {
    console.log('This is your income')
  }
  console.log(args);
}
