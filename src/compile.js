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
    parentObj: undefined, parentPath: [],
    variables: builtins,
    stack: []
  }

  let res = ''

  res += `var F = function(p, ppath, fn) {
  this.g = {
    parentPath: ppath, parentObj: p,
    variables: {},
    stack: []
  };

  this.call = fn;
};

F.prototype.push = function(k) { this.g.stack.push(k); };
F.prototype.pop = function(k) { this.g.stack.pop(k); };

function call(fn, args, stack) {
  var res = (stack === true ? fn : fn.call).apply(null, args);
  var rep = stack === true ? args : stack;
  
  res.forEach(function(r) {
    rep.push(r);
  });
}
`

  res += `\nnew F(undefined, [], function() {\n  this.g.variables = ${serialize(builtins)};\n  G = this;\n`
  res = compile('  ', res, {
    body: [
      [
        b.NAMES.FUNCTION,
        main
      ]
    ]
  }, ctx, [])
  res += `}).call();`

  return res
}

function compile(indent, res, fn, G, path) {
  let origin = G

  function dfnVar(name, path) {
    evalPath(path).variables[name] = true
    res += indent + `${parsePath(['this.g', ...path, 'variables', name])} = undefined;\n`
  }

  ////////////////////////////////////////////////////////////////////////

  fn.body.forEach(([type, v]) => {
    if(type === b.NAMES.STRING) {
      res += indent + 'this.push(['
      res += v.value.map(char => serialize(char.value)).join(', ')
      res += ']);\n'
    }

    if(type === b.NAMES.VARIABLE) {
      let where = find(v.name, origin, path)

      if(where === null) {
        throw 'Variable ' + v.name + ' is undefined'
      } else {
        let realPath = (new Array(where.recursions).fill('parentObj')).concat(where.path)
        let fn = evalPath(G, realPath)

        let pops = 'pop(),'.repeat(fn.length)
        pops = '[' + pops.slice(0, pops.length - 1) + ']'

        if(builtins.includes(fn) && fn.length === 0) {
          // it's a builtin that takes the entire stack :O
          res += indent + `call(${ parsePath(['this.g', ...realPath]) }, this.g.stack, true);\n`
        } else {
          res += indent + `call(${ parsePath(['this.g', ...realPath]) }, ${pops}, this.g.stack);\n`
        }
      }
    }

    if(type === b.NAMES.FUNCTION) {
      res += indent + 'this.push(new F(' + parsePath(['this.g', ...path]) + ', ' + JSON.stringify(path) + ', function() {\n'
      res = compile(indent + '  ', res, v, {
        parentPath: [...path], parentObj: G,
        variables: {},
        stack: []
      }, [], G)
      res += indent + `  call(G.o, [this.pop()], this.g.stack);\n`
      res += indent + '}));\n'
    }
  })

  return res
}


// A path is an array of strings describing how to navigate from the variable `ctx` to get somewhere. For example, `ctx.variables.a.stack[0]` as a path would be `['variables', 'a', 'stack', '0']`.
// find takes one of these as it's second argument and returns one, parsePath returns a string representation of a path and evalPath evaluates a path and returns the value after travelling that path.

function find(what, origin, path, recursions) {
  // console.log('Checking path ', path, ' from origin ', origin, ' for variable ', what, '.')

  let evaledPath = evalPath(origin, path)

  if(Object.keys(evaledPath.variables).indexOf(what) > -1)
    return { path: [...path, 'variables', what], recursions }
  if(!evaledPath.parentObj)
    return { path: null, recursions }

  return find(what, evaledPath.parentObj, evaledPath.parentPath, (recursions || 0) + 1)
}

function parsePath(path) {
  path = path || []

  let res = path[0]
  path.slice(1).forEach(v => res += '[' + serialize(v) + ']')

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
