module.exports = {
  // every function, builtins and CF functions, pops the amount of arguments it has
  // every function, builtins and CF functions, pushes their returned value to the parent's stack. for builtins, this is the value their JS function returns, and for CF functions the returned value is the last item in their stack after execution.
  // every builtin is passed two extra args before what they've really been passed: their context (parent, path, stack, vars) and whether or not the user is using Node.

  // input/output ////////////////////////////////////////////////////////
  
  i: function input(ctx, isNode, str) {
    return isNode ?
      builtinlocals.promptSync(str).map(function(char) {
        return char.getCharCodeAt(0).toString(16);
      }) :
      window.prompt(str).map(function(char) {
        return char.getCharCodeAt(0).toString(16);
      });
  },

  o: function output(ctx, isNode, str) {
    str = str.map(function(char) {
      return String.fromCharCode(parseInt(char, 16));
    }).join('');

    console.log(str);
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

  // arithmetic //////////////////////////////////////////////////////////

  "+": function add(ctx, isNode, a, b) {
    return a + b
  },

  "-": function subtract(ctx, isNode, a, b) {
    return a - b
  },

  "*": function multiply(ctx, isNode, a, b) {
    return a * b
  },

  "/": function divide(ctx, isNode, a, b) {
    return a / b
  },
}
