let builtins = {}

builtins.NAMES = {
  STRING: Symbol(0), NUMBER: Symbol(1), FUNCTION: Symbol(2), VARIABLE: Symbol(3)
}

builtins.CFString = class CFString {
  constructor(value) {
    this.type = builtins.NAMES.STRING

    this.setValue(value)
  }

  setValue(value) {
    if(!(value instanceof Array && value.every(item => item instanceof builtins.CFNumber)))
      throw new TypeError('builtins.CFString.setValue: arg 0 (value) must be Array of CFNumber, was ' + value)

    this.value = value
    this.length = value.length
    this.stringValue = this.value.map(char => String.fromCharCode(parseInt(char.value, 16))).join('')
  }

  asJSString() {
    return this.stringValue
  }
  asString() {
    return new builtins.CFString(this.value)
  }
}

builtins.CFNumber = class CFNumber {
  constructor(value) {
    this.type = builtins.NAMES.NUMBER

    this.setValue(value)
  }

  setValue(value) {
    if(!(value instanceof String || !isNaN(parseInt(value, 16))))
      throw new TypeError('builtins.CFNumber.setValue: arg 0 (value) must be (hexadecimal) String, was ' + value)

    this.value = value
  }
}

builtins.CFFunction = class CFFunction {
  constructor(body, argsamount, argnames) {
    this.type = builtins.NAMES.FUNCTION

    this.setBodyAndArgs(body, argsamount, argnames)
  }

  setBodyAndArgs(body, argsamount, argnames) {
    argsamount = (argsamount || Object.keys(argnames || {}).length) || 1
    if(!(body instanceof Array || body instanceof Function))
      throw new TypeError('builtins.CFFunction.setBodyAndArgs: arg 0 (body) must be Array or Function, was', body)
    if(typeof argsamount != 'number')
      throw new TypeError('builtins.CFFunction.setBodyAndArgs: arg 1 (argsamount) must be number, was', argsamount)
    if(!(argnames instanceof Array) && argnames !== null)
      throw new TypeError('builtins.CFFunction.setBodyAndArgs: arg 2 (argnames) must be Array or null, was', argnames)

    this.body = body
    this.argsamount = argsamount
    this.argnames = argnames
  }
}

builtins.CFVariable = class CFVariable {
  constructor(name) {
    this.type = builtins.NAMES.VARIABLE

    this.setName(name)
  }

  setName(name) {
    if(!(typeof name == 'string' && name.length == 1))
      throw new TypeError('builtins.CFVariable.setName: arg 0 (name) must be a single-digit string, was ' + name)

    this.name = name
  }
}

module.exports = builtins
