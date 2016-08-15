const parse = require('./parser')
const compile = require('./compile')

//////////////////////////////////////////////////////////////////////////

const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin
})

rl.on('line', line => {
  let code = compile(parse(line))
  fs.writeFileSync('out.js', code, 'utf8')

  process.exit()
})