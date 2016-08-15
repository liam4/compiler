const fs = require('fs')

//////////////////////////////////////////////////////////////////////////

module.exports = function compile(tree) {
  let res = ''
  let stack = []

  ////////////////////////////////////////////////////////////////////////

  console.dir(tree, { depth: null })

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
