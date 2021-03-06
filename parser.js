
//let transactions_all = []

const transactionRgx = /\d{4}\/\d{1,2}\/\d{1,2} .+/,
      transactionDate = /\d{4}\/\d{1,2}\/\d{1,2}/,
      transactionDesc = /[^\d{4}\/\d{1,2}\/\d{1,2}]+/,
      accountDesc = /[^\-?\$?\d+\.?\d+$]+/,
      accountAction = /\-?\$?\d+\.?\d?.+/,
      accountAmount = /[\-.|\d]/,
      accountCurren = /[a-zA-z]+/;

module.exports = {
  parse: function (lines, fl, transactions_all, flag) {
    let ban = false
    let transaction = {}
    let account = {}
    let amount_sum = 0.0
    let lastCurrency = ''
    if(!flag){
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
          let currency = action ? action[0].match(accountCurren) : lastCurrency

          account['description'] = line.match(accountDesc).toString().trim()
          account['amount'] = amount ? parseFloat(amount) : -amount_sum
          account['currency'] = currency ? currency[0] : null
          transaction['accounts'].push(account)
          amount_sum += account['amount']
          account = {}
          lastCurrency = currency
        }

        if (index == fl - 1){
          transactions_all.push(transaction)
        }
      })
      return transactions_all
    }else{
      let accountFather = {}
      let subaccounts = {}
      let amount_sum = 0.0
      let f = false

      lines.forEach(function (line, index){
        if(line.startsWith(";") || line.length == 0) return

        if(line.match(transactionDate)){
          if (ban){
            amount_sum = 0.0
            //transactions_all.push(accountFather)
          }
          ban = true
          return
        }
        accountFather = { subaccounts: [] }

        let action = line.match(accountAction)
        let amount = action ? action.toString().replace('$','') : null
        let currency = action ? action[0].match(accountCurren) : lastCurrency
        let acc = line.match(accountDesc).toString().trim()
        let master = acc.substr(0,acc.indexOf(':'))
        if(ban){
          //console.log(master);

          accountFather['name'] = master
          accountFather['amount'] = amount ? parseFloat(amount) : -amount_sum
          accountFather['currency'] = currency ? currency[0] : null

          subaccounts['name'] = acc.substr(acc.indexOf(':')+1)
          subaccounts['amount'] = amount ? parseFloat(amount) : -amount_sum
          subaccounts['currency'] = currency ? currency[0] : null
          accountFather['subaccounts'].push(subaccounts)
          amount_sum += subaccounts['amount']
          //console.log('M - '+transactions_all);
          for (var i=0; i < transactions_all.length; i++) {
            if (transactions_all[i].name === master) {
              //console.log('same --- '+master);
              transactions_all[i].subaccounts.push(subaccounts)
              transactions_all[i].amount += subaccounts['amount']
              f = true
            }
          }
          subaccounts = {}
          lastCurrency = currency
          if(f == false){
            //console.log(master);
            transactions_all.push(accountFather)
          }else{
            f = false
          }
        }

        //transactions_all.push(accountFather)

      })
      return transactions_all
    }
  },
};
