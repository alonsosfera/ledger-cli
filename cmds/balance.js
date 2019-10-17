//const income  = require('../Income.ledger')
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var outstream = new stream();
var instream;

const transactionRgx = /\d{4}\/\d{1,2}\/\d{1,2} .+/,
      transactionDate = /\d{4}\/\d{1,2}\/\d{1,2}/,
      transactionDesc = /[^\d{4}\/\d{1,2}\/\d{1,2}]+/,
      accDesc = /[^\-?\$?\d+\.?\d+$]+/,
      accAction = /\-?\$?\d+\.?\d?.+/,
      accAmount = /[\-.|\d]/,
      accCurren = /[a-zA-z]+/;

module.exports = (args) => {
  console.log('');
  if(args.file){
    console.log(`Balance from "${args.file}"`);
    ReadFile(args.file);
  }
  else if (args.sort) {
    console.log(`Sorted Balance "${args.sort}"`);
  }
  else if (args.price) {
    console.log('Price DB');
  }
  else{
    ReadFile('income');
    ReadFile('expenses');
    ReadFile('payable');
    ReadFile('bitcoin');
  }

 function ReadFile(f){
    instream = fs.createReadStream(f +'.ledger')
    var rl = readline.createInterface(instream, outstream);
    let ban = false;
    let

    rl.on('line', function(line){
      if(line.startsWith(";")) return;

      if(ban){

      }

      if(line.match(transactionDate)){
        ban = true;


      }

      var date = line.match(transactionDate);
      date = (date == null) ? '' : date
      var description = line.match(transactionDesc);
      var amount = line.match(/\-?\$?\d+\.?\d+$/);
      if(amount){
        console.log(date+ description.toString().replace('$','') +"$"+amount.toString().replace('$',''));
      }else{
        console.log(date+ description.toString().replace('$',''));
      }
    })
  }

  //console.log(args._[1]);
  //console.log('This is a balance')
  //console.log('\x1b[33m%s\x1b[0m', 'hi!')
}
