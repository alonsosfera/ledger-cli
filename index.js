const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2))

  let cmd = args._[0] || 'help'

   if (cmd == 'b' || cmd == 'bal') {
     cmd = 'balance'
   }

   if (args.version || args.v) {
     cmd = 'version'
   }

   if (args.help || args.h) {
     cmd = 'help'
   }

   switch (cmd) {
     case 'balance':
       require('./cmds/balance')(args)
       break

     case 'expenses':
       require('./cmds/expenses')(args)
       break

     case 'income':
       require('./cmds/income')(args)
       break

     case 'payable':
       require('./cmds/payable')(args)
       break

     case 'receivable':
       require('./cmds/receivable')(args)
       break

     case 'version':
       require('./cmds/version')(args)
       break

     case 'help':
       require('./cmds/help')(args)
       break

     default:
       console.error(`"${cmd}" is not a valid command!`)
       break
   }
}
