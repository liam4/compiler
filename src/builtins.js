module.exports = {
  // every builtin `pop()`s the amount of arguments it has
  // and every element of the array it returns is `push()`ed
  // to the stack

  // if a function takes exactly ZERO (...stack) then it will
  // be passed the entire stack (!!!)

  // input/output ////////////////////////////////////////////////////////

  i: function input(str) {
    return [require('prompt-sync')('? ').map(char => char.charCodeAt(0).toString(16))]
  },

  o: function output(str) {
    process.stdout.write(str)
    return []
  },

  ////////////////////////////////////////////////////////////////////////

  d: function duplicate(el) {
    return [el, el]
  },

  s: function swap(a, b) {
    return [b, a]
  },

  p: function pop(a) {
    return []
  },

  // manipulate entire stack /////////////////////////////////////////////

  ">": function rotateRight(...stack) {
    return require('rotate-array')(stack, -1)
  },

  "<": function rotateLeft(...stack) {
    return require('rotate-array')(stack, 1)
  },

  r: function reverse(...stack) {
    return stack.reverse()
  },

  d: function deleteAll(...stack) {
    return []
  },

  // arithmetic //////////////////////////////////////////////////////////

  "+": function add(a, b) {
    return [a + b]
  },

  "-": function subtract(a, b) {
    return [a - b]
  },

  "*": function multiply(a, b) {
    return [a * b]
  },

  "/": function divide(a, b) {
    return [a / b]
  },
}
