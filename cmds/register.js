var fs = require('fs');
var parser = require('../parser.js');

let transactions_all = [];
let file_lenght = 0;

const transactionRgx = /\d{4}\/\d{1,2}\/\d{1,2} .+/,
      transactionDate = /\d{4}\/\d{1,2}\/\d{1,2}/,
      transactionDesc = /[^\d{4}\/\d{1,2}\/\d{1,2}]+/,
      accountDesc = /[^\-?\$?\d+\.?\d+$]+/,
      accountAction = /\-?\$?\d+\.?\d?.+/,
      accountAmount = /[\-.|\d]/,
      //accAmount = /\-?\$?\d+\.?\d+$/,
      accountCurren = /[a-zA-z]+/;

module.exports = (args) => {
  //args._[1]
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
     let file = f +'.ledger';
     instream = fs.createReadStream(f +'.ledger')

     fs.readFile(file, 'utf8', (err, contents) =>{
       if (contents != null) {
         file_lenght = (contents.split('\n').length-1 );
       }

       if(file_lenght > 0){
         let lines = contents.split('\n')
         console.log(parser.parse(lines, file_lenght));
         //Parser(lines)
       }
     })
   }


   function Parser(lines){
     let ban = false
     let transaction = {}
     let account = {}
     let amount_sum = 0.0
     lines.forEach(function (line, index){
       if(line.startsWith(";") || line.length == 0) return

       if(line.match(transactionDate)){
         if (ban){
           transactions_all.push(transaction)
           amount_sum = 0.0
         }

         ban = true
         transaction = { accounts: [] }
         transaction['date'] = line.match(transactionDate).toString()
         transaction['description'] = line.match(transactionDesc).toString().trim()
         //console.log(transaction);
         return
       }

       if(ban){
         let action = line.match(accountAction)
         let amount = action ? action.toString().replace('$','') : null
         let currency = action ? action[accountCurren] : "USD"

         account['description'] = line.match(accountDesc).toString().trim()
         account['amount'] = amount ? parseFloat(amount) : -amount_sum
         account['currency'] = currency ? currency : 'USD'
         transaction['accounts'].push(account)
         amount_sum += account['amount']
         account = {}
       }

       if (index == file_lenght - 1){
         transactions_all.push(transaction)
       }
     })
     Register(transactions_all)
   }


   function Register(transactions){
     console.log(transactions_all);
   }
}
