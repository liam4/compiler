const fs = require('fs')
const b = require('./builtins')

//////////////////////////////////////////////////////////////////////////

module.exports = function(tree) {
  console.dir(tree, { depth: null })
  console.log()

  // global context
  let ctx = {
    parent: null,
    variables: {
      // TODO
    },
    stack: []
  }

  return compile('', '', tree, ctx)
}

// recursion? whaaaat?
function find(what, ctx) {
  let inCtx = ctx.variables[what]

  if(inCtx) return inCtx
  else if(ctx.parent === null) return null
  else return find(what, ctx.parent)
}

// moar recursion? whaaaaaaaaat?
function compile(indent, res, fn, ctx) {
  let id = require('uniqid')('_')

  // define ctx
  let ctxWithoutParent = {}
  Object.assign(ctxWithoutParent, ctx, { parent: null })
  res += indent + `var ${id} = ${JSON.stringify(ctxWithoutParent)};\n`

  // push() to ctx.stack
  res += indent + `var ${id}_push = function(v) { ${id}.stack.push(v); }\n`

  // pop() from ctx.stack
  res += indent + `var ${id}_pop = function(v) { ${id}.stack.pop(v); }\n`

  ////////////////////////////////////////////////////////////////////////

  res += indent + `\n`

  fn.body.forEach(([type, v]) => {
    if(type === b.NAMES.STRING) {
      v.value.forEach(char => {
        res += indent + `${id}_push(${JSON.stringify(char.value)});`
      })

      res += indent + `\n`
    }

    if(type === b.NAMES.VARIABLE) {
      let where = find(v.name, ctx)
      console.log(`Found ${v.name}: ${where}`)
    }
  })

  return res
}
