
let transactions_all = [];

const transactionRgx = /\d{4}\/\d{1,2}\/\d{1,2} .+/,
      transactionDate = /\d{4}\/\d{1,2}\/\d{1,2}/,
      transactionDesc = /[^\d{4}\/\d{1,2}\/\d{1,2}]+/,
      accountDesc = /[^\-?\$?\d+\.?\d+$]+/,
      accountAction = /\-?\$?\d+\.?\d?.+/,
      accountAmount = /[\-.|\d]/,
      //accAmount = /\-?\$?\d+\.?\d+$/,
      accountCurren = /[a-zA-z]+/;

module.exports = {
  parse: function (lines, fl) {
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

      if (index == fl - 1){
        transactions_all.push(transaction)
      }
    })
    return transactions_all
  },
};
