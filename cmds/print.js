//const income  = require('../Income.ledger')
var fs = require('fs');
const chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf
const parser = require('../parser.js');


module.exports = (args) => {
  console.log('');
  let file = '';
  if(args.file){
    file = args.file
  }
  if (args.sort) {
    console.log(`Sorted Print "${args.sort}"`);
  }
  if (args.price) {
    console.log('Price DB');
  }

  if(file == ''){
    Print('income')
    Print('expenses')
    Print('payable')
    Print('bitcoin')
  }else {
    Print(file)
  }
}

function Print(f){
   let file = f +'.ledger'

   fs.readFile(file, 'utf8', (err, contents) =>{
     if (contents != null) {
       file_lenght = (contents.split('\n').length-1 )
     }else {
       console.log('Error en el archivo...\n')
       return
     }
     console.log(chalk.green(`Print from "${file}"\n`))

     if(file_lenght > 0){
       let lines = contents.split('\n')
       var parsedFile = parser.parse(lines, file_lenght)
       FormatPrint(parsedFile)
     }
   })
 }

 function FormatPrint(pf){
   let beforeAmount = 45;

   for(t in pf){
     console.group(`${pf[t].date} ${pf[t].description}`)
     for(acc in pf[t].accounts){
       let space = beforeAmount - pf[t].accounts[acc].description.length - pf[t].accounts[acc].amount.toString().length
       console.log(`${pf[t].accounts[acc].description}${sprintf(`%${space}.1s`, '')}${parseFloat(pf[t].accounts[acc].amount)}`);
     }
     console.groupEnd();
     console.log();

     //console.log(pf[t])
   }
 }
