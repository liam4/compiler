const fs = require('fs')
const b = require('./builtins')

//////////////////////////////////////////////////////////////////////////

module.exports = function compile(tree) {
  let res = ''

  ////////////////////////////////////////////////////////////////////////

  console.dir(tree, { depth: null })

  let globalCtx = {
    p: null,
    o: new b.CFFunction(function output(str) {
      process.stdout.write(str)
    }, 1, null),
  }

  let ctx = globalCtx

  /*
  tree.forEach(line => {
    switch(line[0]) {
      case 'push-stack-string':
      let chars = line[1].split('')
      res += `e(stack);` + chars.map(char => {
        return `p(stack, ['${char}']);`
      }).join('')
      break;

      case 'call':
      res += `${line[1]}(stack);`
      break;
    }
  })
  */

  ////////////////////////////////////////////////////////////////////////

  return res
}
