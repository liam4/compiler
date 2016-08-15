const fs = require('fs')
const serialize = require('serialize-javascript')

//////////////////////////////////////////////////////////////////////////

const builtins = require('./builtins')
const b = require('./grammarbuiltins')

Object.values = obj => Object.keys(obj).map(k => obj[k])

//////////////////////////////////////////////////////////////////////////

module.exports = function(main) {
  console.dir(main, { depth: null })

  // global context
  let ctx = {
    parent: [],
    variables: builtins,
    stack: []
  }

  let res = ''

  res += `var F = function(p, fn) {
  this.g = {
    parent: p,
    variables: {},
    stack: []
  };

  this.call = fn;
};

F.prototype.push = function(k) { this.g.stack.push(k); };
F.prototype.pop = function(k) { this.g.stack.pop(k); };
`

  res += `\n(new F({}, function() {\n  this.g.variables = ${serialize(builtins)};\n`
  res = compile('  ', res, {
    body: [
      [
        b.NAMES.FUNCTION,
        main
      ]
    ]
  }, ctx, [])
  res += '}));'

  return res
}

function compile(indent, res, fn, G, path) {
  let origin = G, originString = 'this.g'

  function dfnVar(name, path) {
    evalPath(path).variables[name] = "EXISTS OMG"
    res += indent + `${parsePath(['G', ...path, 'variables', name])} = undefined;\n`
  }

  ////////////////////////////////////////////////////////////////////////

  fn.body.forEach(([type, v]) => {
    if(type === b.NAMES.STRING) {
      res += indent
      v.value.forEach(char => {
        res += `this.push(${serialize(char.value)}); `
      })

      res += `// "${v.stringValue}"\n`
    }

    if(type === b.NAMES.VARIABLE) {
      let where = find(v.name, origin, path)

      if(where === null) {
        throw 'Variable ' + v.name + ' is undefined'
      } else {
        console.log(where)
      }
    }

    if(type === b.NAMES.FUNCTION) {
      res += indent + 'this.+(new F(' + parsePath([originString, ...path]) + ', function() {\n'
      res = compile(indent + '  ', res, v, {
        parent: G,
        variables: {},
        stack: []
      }, path)
      res += indent + '}));\n'
    }
  })

  return res
}


// A path is an array of strings describing how to navigate from the variable `ctx` to get somewhere. For example, `ctx.variables.a.stack[0]` as a path would be `['variables', 'a', 'stack', '0']`.
// find takes one of these as it's second argument and returns one, parsePath returns a string representation of a path and evalPath evaluates a path and returns the value after travelling that path.

function find(what, origin, path) {
  let evaledPath = evalPath(origin, path)
  console.log(path)

  if(!evaledPath.parent)
    return null
  if(Object.keys(evaledPath.variables).indexOf(what) > -1)
    return [...path, 'variables', what]

  return find(what, evaledPath.parent)
}

function parsePath(path) {
  path = path || []

  let res = path[0]
  path.slice(1).forEach(v => res += '[' + serialize(v) + ']')

  return res
}

function evalPath(origin, path) {
  path = path || []

  console.log('origin:', origin)

  let res = origin
  path.forEach(v => {
    res = res[v]
  })

  return res
}
