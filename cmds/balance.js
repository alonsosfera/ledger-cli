//const income  = require('../Income.ledger')
var fs = require('fs');
const chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf
const parser = require('../parser.js');

let sort = "", i = 1
let transactions_all = []


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
    i = 5
    ReadFile(file)
  }
}

function ReadFile(f){
   let file = f +'.ledger'
   //let transactions_all = []

   fs.readFile(file, 'utf8', (err, contents) =>{
     if (contents != null) {
       file_lenght = (contents.split('\n').length-1 )
     }else {
       console.log('Error en el archivo...\n')
       return
     }
     //console.log(chalk.green(`Balance from "${file}"`))
     //sort != '' ? console.log(chalk.grey('Sorted by: ' +sort+'\n')) : console.log('');

     if(file_lenght > 0){
       let lines = contents.split('\n')
       var parsedFile = parser.parse(lines, file_lenght, transactions_all, true)
       if(i == 5){
         Balance(parsedFile)
       }
       i++
     }
   })
 }

 function Balance(pf){
   console.log(pf);
   console.log(pf[0]);
   console.log(pf[1]);
   console.log(pf[2]);
   console.log(pf[3]);
   console.log(pf[4]);
   let final = []
   /*for (t in pf){
     for (acc in pf[t].accounts){
      final[pf[t].accounts[acc].description] ?
     }
   }*/

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
   let beforeAmount = 20
   let money = 0, bitcoin = 0

   for(t in pf){
     //console.group(`${pf[t].date} ${pf[t].description}`)
     for(acc in pf[t].accounts){
       let accCurrency = '', accDesc = pf[t].accounts[acc].description, accAmount = parseFloat(pf[t].accounts[acc].amount)
       let space = beforeAmount - pf[t].accounts[acc].amount.toString().length
       //let space = beforeAmount -  accAmount.toFixed(2).toString().length

       if(pf[t].accounts[acc].currency == "BTC"){
         accCurrency = pf[t].accounts[acc].currency
         space -= accCurrency.length
         bitcoin += accAmount
       }else {
         money += accAmount
       }
       let sign = accCurrency != "BTC" ? '$' : ''
       console.log(`${sprintf(`%${space}.1s`, '')}${accCurrency == 'BTC' ? accAmount + ' BTC' : '$'+accAmount} ${accDesc}`);
     }
   }
   let sp
   sp = beforeAmount -  money.toFixed(2).toString().length
   console.log('---------------------');
   console.log(`${sprintf(`%${sp}.1s`, '')}${money < 0 ? chalk.red('$'+money.toFixed(2)) : chalk.green('$'+money.toFixed(2))}`);
   sp = beforeAmount -  bitcoin.toFixed(2).toString().length - 3
   bitcoin != 0 ? console.log(`${sprintf(`%${sp}.1s`, '')}${bitcoin < 0 ? chalk.red(bitcoin.toFixed(2)+' BTC') : chalk.green(bitcoin.toFixed(2)+' BTC')}`) : null

 }
