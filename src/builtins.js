module.exports = {
  // every function, builtins and CF functions, pops the amount of arguments it has
  // every function, builtins and CF functions, pushes their returned value to the parent's stack. for builtins, this is the value their JS function returns, and for CF functions the returned value is the last item in their stack after execution.
  // every builtin is passed two extra args before what they've really been passed: their context (parent, path, stack, vars) and whether or not the user is using Node.

  // Input / Output //////////////////////////////////////////////////////

  i: function input(ctx, isNode) {
    var str = isNode ? builtinlocals.promptSync('> ') : window.prompt();
    var res = []

    for(var i = 0; i < str.length; i++) {
      res.push(str.charCodeAt(i).toString(16));
    }

    return res
  },

  o: function output(ctx, isNode, str) {
    var res = '';
    if(typeof str === 'string') str = [str];

    for(var i = 0; i < str.length; i++) {
      res += String.fromCharCode(parseInt(str[i], 16));
    }

    console.log(res);
  },

  // Logic ///////////////////////////////////////////////////////////////

  x: function execute(ctx, isNode, fn) {
    fn.call();
  },

  '?': function if_(ctx, isNode, bool, fn) {
    if(bool !== '0') fn();
  },

  e: function if_else(ctx, isNode, bool, fn1, fn2) {
    if(bool === '0') fn1();
    else fn2();
  },

  '!': function not(ctx, isNode, bool) {
    return bool === '0' ? '1' : '0';
  },

  q: function quit(ctx, isNode) {
    if(isNode) process.exit();
    else throw 'terminate';
  },

  // Arithmetic //////////////////////////////////////////////////////////

  "+": function add(ctx, isNode, a, b) {
    return (parseInt(a, 16) + parseInt(b, 16)).toString(16);
  },

  "-": function subtract(ctx, isNode, a, b) {
    return (parseInt(a, 16) - parseInt(b, 16)).toString(16);
  },

  "*": function multiply(ctx, isNode, a, b) {
    return (parseInt(a, 16) * parseInt(b, 16)).toString(16);
  },

  "/": function divide(ctx, isNode, a, b) {
    return (parseInt(a, 16) / parseInt(b, 16)).toString(16);
  },

  "%": function modulo(ctx, isNode, a, b) {
    return (parseInt(a, 16) % parseInt(b, 16)).toString(16);
  },

  "|": function absolute(ctx, isNode, a) {
    return Math.abs(parseInt(a, 16)).toString(16);
  },

  f: function factorial(ctx, isNode, n) {
    var _n = parseInt(n, 16);
    var _p = 1;

    while(_n > 0) _p *= _n--;

    return _p.toString(16)
  },

  p: function prime(ctx, isNode, n) {
    var value = parseInt(n, 16)
    if(value > 2) {
      var i, q;
      do {
        i = 3;
        value += 2;
        q = Math.floor(Math.sqrt(value));
        while (i <= q && value % i) {
          i += 2;
        }
      } while (i <= q);

      return value.toString(16);
    }
    return value === 2 ? '3' : '2';
  },

  '(': function increment(ctx, isNode, n) {
    return (parseInt(n, 16) + 1).toString(16)
  },

  ')': function decrement(ctx, isNode, n) {
    return (parseInt(n, 16) - 1).toString(16)
  },

  ';': function halve(ctx, isNode, n) {
    return (parseInt(n, 16) / 2).toString(16)
  },

  ':': function double(ctx, isNode, n) {
    return (parseInt(n, 16) * 2).toString(16)
  },

  t: function sqrt(ctx, isNode, n) {
    return Math.sqrt(parseInt(n, 16)).toString(16)
  },

  ////////////////////////////////////////////////////////////////////////
  d: function duplicate(ctx, isNode, el) {
    ctx.stack.push(el)
    return el
  },

  s: function swap(ctx, isNode, a, b) {
    ctx.stack.push(b)
    return a
  },

  p: function pop(ctx, isNode, a) { },

  // manipulate entire stack /////////////////////////////////////////////

  ">": function rotateRight(ctx, isNode) {
    ctx.stack = bultinlocals.rotateArray(ctx.stack, -1)
  },

  "<": function rotateLeft(ctx, isNode) {
    ctx.stack = builtinlocals.rotateArray(ctx.stack, 1)
  },

  r: function reverse(ctx, isNode) {
    ctx.stack = ctx.stack.reverse()
  },

  d: function clear(ctx, isNode) {
    ctx.stack = []
  },
}
