const menus = {
  main: `
    ledger [command] <options>

    balance ............ show current balance
    income ............. show current income balance
    expenses ........... show current expense balance
    payable ............ show current payable balance
    receivable ......... show current receivable balance
    version ............ show package version
    help ............... show help menu for a command
    `,

  balance: `
    ledger balance <options>

    --account, -a ..... the account to check
    `,

}

module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}
