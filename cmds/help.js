const menus = {
  main: `
    Ledger [command] <options>

    balance ............ Show current balance
    register ........... Show register from transactions
    print .............. Print transactions
    version ............ Show package version
    help ............... Show help menu for a command
    `,

  balance: `
    ledger balance <options>

      --sort ..... Sort balance by <date | description>
      --file ..... Get balance from <file_name>
    `,
  register: `
    ledger register <options>

      --sort ..... Sort register by <date | description>
      --file ..... Get register from <file_name>
    `,
  print: `
    ledger print <options>

      --sort ..... Sort print by <date | description>
      --file ..... Print from <file_name>
    `,

}

module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}
