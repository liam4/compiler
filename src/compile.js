const fs = require('fs')
const b = require('./grammarbuiltins')

//////////////////////////////////////////////////////////////////////////

Object.values = obj => Object.keys(obj).map(k => obj[k])

//////////////////////////////////////////////////////////////////////////

module.exports = function(tree) {
  console.dir(tree, { depth: null })
  console.log() // wat

  // global context
  let ctx = {
    parent: null,
    variables: {
      // TODO
    },
    stack: []
  }

  let res = ''

  // define ctx (G)
  res += `var G = ${JSON.stringify(ctx)};\n`
  // push() to ctx.stack
  res += `var + = function(v) { G.stack.push(v); }\n`
  // pop() from ctx.stack
  res += `var - = function(v) { G.stack.pop(v); }\n`

  return compile('', res, tree, ctx)
}

function compile(indent, res, fn, G) {
  let path = []
  let origin = G, originString = 'G'

  function dfnVar(name, path) {
    evalPath(path).variables[name] = "EXISTS OMG"
    res += indent + `${parsePath(['G', ...path, 'variables', name])} = undefined;\n`
  }

  ////////////////////////////////////////////////////////////////////////

  fn.body.forEach(([type, v]) => {
    if(type === b.NAMES.STRING) {
      res += indent
      v.value.forEach(char => {
        res += `+(${JSON.stringify(char.value)}); `
      })

      res += `// "${v.stringValue}"\n`
    }

    if(type === b.NAMES.VARIABLE) {
      let where = find(v.name, origin, path)

      if(where === null) {
        throw 'Variable ' + v.name + ' is undefined'
      } else {

      }
    }

    if(type === b.NAMES.FUNCTION) {
      res += indent + '+(function() {\n'
      res = compile(indent + '  ', res, v, {
        parent: G,
        variables: {
          // TODO
        },
        stack: []
      })
      res += '});\n'
    }
  })

  return res
}


// A path is an array of strings describing how to navigate from the variable `ctx` to get somewhere. For example, `ctx.variables.a.stack[0]` as a path would be `['variables', 'a', 'stack', '0']`.
// find takes one of these as it's second argument and returns one, parsePath returns a string representation of a path and evalPath evaluates a path and returns the value after travelling that path.

function find(what, origin, path) {
  let evaledPath = evalPath(origin, path)

  if(evaledPath.parent == null)
    return null
  if(Object.keys(evaledPath.variables).indexOf(what) > -1)
    return [...path, 'variables', what]

  return find(what, path.slice(0, path.length - 2))
}

function parsePath(path) {
  path = path || []

  let res = path[0]
  path.slice(1).forEach(v => res += '[' + JSON.stringify(v) + ']')

  return res
}

function evalPath(origin, path) {
  path = path || []

  let res = origin
  path.forEach(v => {
    res = res[v]
  })

  return res
}
