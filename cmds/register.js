
var fs = require('fs');
const chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf
const parser = require('../parser.js');
let transactions_all = []

let sort = "", i = 1


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

  fs.readFile(file, 'utf8', (err, contents) =>{
    if (contents != null) {
      file_lenght = (contents.split('\n').length-1 )
    }else {
      console.log('Error en el archivo...\n')
      return
    }
    //console.log(chalk.green(`Register from "${file.split('.')[0]}"`))
    //sort != '' ? console.log(chalk.grey('Sorted by: ' +sort+'\n')) : console.log('');

    if(file_lenght > 0){
      let lines = contents.split('\n')
      var parsedFile = parser.parse(lines, file_lenght, transactions_all, false)
      if(i == 5){
        Register(parsedFile)
      }
      i++
    }
  })
 }

function Register(pf){
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
  let beforeAmount = 35
  let money = 0, bitcoin = 0

  for(t in pf){
    let traDescription = pf[t].description.length > 30 ? pf[t].description.substring(0,27) +'...' : pf[t].description
    let traDate = pf[t].date
    let blankspace = 41
    let i = 0
    for(acc in pf[t].accounts){
      let space = beforeAmount - pf[t].accounts[acc].description.length - pf[t].accounts[acc].amount.toString().length
      let accCurrency = '', accDesc = pf[t].accounts[acc].description, accAmount = parseFloat(pf[t].accounts[acc].amount)
      let afterT = traDescription.length == 30 ? 1 + (10 - traDate.length) : 41 - traDescription.length - traDate.length

      if(pf[t].accounts[acc].currency == "BTC"){
        accCurrency = pf[t].accounts[acc].currency
        space -= accCurrency.length
        bitcoin += accAmount
      }else {
        money += accAmount
      }
      let sign = accCurrency != "BTC" ? '$' : ''
      if (i == 0){
        i++
        console.group(`${traDate} ${traDescription}${sprintf(`%${afterT}.1s`,'')} ${chalk.blue(accDesc)}${sprintf(`%${space}.1s`, '')}${accAmount < 0 ? chalk.red(sign) : sign}${accAmount < 0 ? chalk.red(accAmount) : accAmount} ${accAmount < 0 ? chalk.red(accCurrency) : accCurrency}${sprintf(`%${accCurrency != 'BTC' ? 19 - money.toFixed(2).toString().length : 17 - bitcoin.toString().length}.1s`, '')}${accCurrency != 'BTC' ? money < 0 ? chalk.red('$'+money.toFixed(2)) : '$'+money.toFixed(2) : bitcoin < 0 ? chalk.red(bitcoin+' BTC') : bitcoin +' BTC'}`)
      }else{
        console.log(`${sprintf(`%${blankspace}.1s`,'')}${chalk.blue(accDesc)}${sprintf(`%${space}.1s`, '')}${accAmount < 0 ? chalk.red(sign) : sign}${accAmount < 0 ? chalk.red(accAmount) : accAmount} ${accAmount < 0 ? chalk.red(accCurrency) : accCurrency}${sprintf(`%${accCurrency != 'BTC' ? 19 - money.toFixed(2).toString().length : 17 - bitcoin.toString().length}.1s`, '')}${accCurrency != 'BTC' ? money < 0 ? chalk.red('$'+money.toFixed(2)) : '$'+money.toFixed(2) : bitcoin < 0 ? chalk.red(bitcoin+' BTC') : bitcoin +' BTC'}`);
        bitcoin > 0 ? console.log(`${sprintf(`%${97 - bitcoin.toString().length - 3}.1s`, '')}${bitcoin} BTC`) : null
      }
    }
    console.groupEnd();
    console.log();
  }
}
