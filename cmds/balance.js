//const income  = require('../Income.ledger')
var fs = require('fs');
const chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf
const parser = require('../parser.js');

let sort = ""


module.exports = (args) => {
  console.log('');
  let file = '';
  if(args.file){
    file = args.file
  }
  if (args.sort) {
    sort = args.sort
  }
  if (args.price) {
    console.log('Price DB');
  }

  if(file == ''){
    ReadFile('income')
    ReadFile('expenses')
    ReadFile('payable')
    ReadFile('receivable')
    ReadFile('bitcoin')
  }else {
    ReadFile(file)
  }
}

function ReadFile(f){
   let file = f +'.ledger'

   fs.readFile(file, 'utf8', (err, contents) =>{
     if (contents != null) {
       file_lenght = (contents.split('\n').length-1 )
     }else {
       console.log('Error en el archivo...\n')
       return
     }
     console.log(chalk.green(`Balance from "${file}"`))
     sort != '' ? console.log(chalk.grey('Sorted by: ' +sort+'\n')) : console.log('');

     if(file_lenght > 0){
       let lines = contents.split('\n')
       let parsedFile = parser.parse(lines, file_lenght)
       Balance(parsedFile)
     }
   })
 }

 function Balance(pf){
   if(sort != ''){
     if (sort == 'd' || sort == 'date' ){
        pf.sort(function(a,b) {
          var d1 = new Date(a.date)
          var d2 = new Date(b.date)
          return d1 - d2
        });
      }else if(sort == 'desc' || sort == 'description' ){
        pf.sort(function(a,b) {
          var x = a.description.toLowerCase()
          var y = b.description.toLowerCase()
          return x < y ? -1 : x > y ? 1 : 0;
        });
      }
   }
   let beforeAmount = 45;

   for(t in pf){
     console.group(`${pf[t].date} ${pf[t].description}`)
     for(acc in pf[t].accounts){
       let space = beforeAmount - pf[t].accounts[acc].description.length - pf[t].accounts[acc].amount.toString().length
       console.log(`${pf[t].accounts[acc].description}${sprintf(`%${space}.1s`, '')}${parseFloat(pf[t].accounts[acc].amount)} ${pf[t].accounts[acc].currency}`);
     }
     console.groupEnd();
     console.log();

     //console.log(pf[t])
   }
 }
