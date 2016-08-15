const parse = require('./parser')
const compile = require('./compile')
const uglify = require('uglify-js').minify

//////////////////////////////////////////////////////////////////////////

const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin
})

rl.on('line', line => {
  let code = `/* compiled from \`${line}\` */\n\n` + compile(parse(line))
  fs.writeFileSync('out.js', code, 'utf8')
  
  let uglified = uglify(code, {
    fromString: true
  })

  fs.writeFileSync('out.min.js', uglified.code, 'utf8')

  process.exit()
})
