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

  return compile('', '', tree, ctx)
}

/*
// recursion? whaaaat?
function find(what, ctx) {
  let inCtx = ctx.variables[what]

  if(inCtx) return inCtx
  else if(ctx.parent === null) return null
  else return find(what, ctx.parent)
}
*/

// moar recursion? whaaaaaaaaat?
function compile(indent, res, fn, G) {
  //let id = require('uniqid')('_')
  
  let path = []
  let origin = G, originString = 'G'
  
  function dfnVar(name, path) {
    evalPath(path).variables[name] = "EXISTS OMG"
    res += indent + `${parsePath(['G', ...path, 'variables', name])} = undefined;\n`
  }
  
  // define ctx
  let GWithoutParent = {} // ?
  Object.assign(GWithoutParent, G, { parent: null })
  res += indent + `var G = {"parent":null,"variables":new Object(),"stack":new Array()}`
  // push() to ctx.stack
  res += indent + `var + = function(v) { G.stack.push(v); }\n`
  // pop() from ctx.stack
  res += indent + `var - = function(v) { G.stack.pop(v); }\n`
  
  ////////////////////////////////////////////////////////////////////////

  res += /* indent + */ `\n`

  fn.body.forEach(([type, v]) => {
    if(type === b.NAMES.STRING) {
      v.value.forEach(char => {
        res += indent + `+(${JSON.stringify(char.value)});`
      })

      res += indent + `\n`
    }

    if(type === b.NAMES.VARIABLE) {
      let where = find(v.name, origin, path)
      console.log(`Found ${v.name}: ${where}`)
    }
  })

  return res
}


// A path is an array of strings describing how to navigate from the variable `ctx` to get somewhere. For example, `ctx.variables.a.stack[0]` as a path would be `['variables', 'a', 'stack', '0']`.
// find takes one of these as it's second argument and returns one, parsePath returns a string representation of a path and evalPath evaluates a path and returns the value after travelling that path.

function find(what, origin, path) {
  let evaledPath = evalPath(origin, path)
  console.log('evaledPath:', evaledPath)
  if(Object.keys(evaledPath.variables).indexOf(what) > -1)
    return [...path, 'variables', what]
  if(evaledPath.parent == null)
    return []
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