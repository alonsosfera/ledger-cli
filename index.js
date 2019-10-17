const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2))

   let cmd = args._[0] || 'help'

   if (cmd == 'b' || cmd == 'bal') {
     cmd = 'balance'
   }

   if (cmd == 'p') {
     cmd = 'print'
   }

   if (cmd == 'r' || cmd == 'reg') {
     cmd = 'register'
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

     case 'print':
       require('./cmds/print')(args)
       break

     case 'register':
       require('./cmds/register')(args)
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
