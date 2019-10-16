//const income  = require('../Income.ledger')
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var outstream = new stream();
var instream;

module.exports = (args) => {
  var f = args._[1];
  if(f != null){
    ReadFile(f);
  }else{

  }

 function ReadFile(f){
    instream = fs.createReadStream(f +'.ledger')
    var rl = readline.createInterface(instream, outstream);
    rl.on('line', function(line){
      var date = line.match(/\d{4}\/\d{1,2}\/\d{1,2}/);
      date = date == null ? '' : date
      var description = line.match(/[^\d{4}\/\d{1,2}\/\d{1,2}]+/);
      var ammount = line.match(/\-?\$?\d+\.?\d+$/);
      if(ammount){
        console.log(date+ description +ammount.toString().replace('$',''));
      }else{
        console.log(date+ description);
      }
    })
  }

  //console.log(args._[1]);
  //console.log('This is a balance')
  //console.log('\x1b[33m%s\x1b[0m', 'hi!')
}
