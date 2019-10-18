//const income  = require('../Income.ledger')
var fs = require('fs');
var parser = require('../parser.js');


module.exports = (args) => {
  console.log('');
  let file = '';
  if(args.file){
    file = args.file
  }
  if (args.sort) {
    console.log(`Sorted Balance "${args.sort}"`);
  }
  if (args.price) {
    console.log('Price DB');
  }

  if(file == ''){
    ReadFile('income')
    ReadFile('expenses')
    ReadFile('payable')
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
     console.log(`Balance from "${file}"`)

     if(file_lenght > 0){
       let lines = contents.split('\n')
       let parsedFile = parser.parse(lines, file_lenght)
       Balance(parsedFile)
     }
   })
 }

 function Balance(pf){
   for(t in pf){
     console.log(pf[t])
   }
 }
