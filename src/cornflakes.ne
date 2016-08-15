@{%

function removeNull(obj) {
  const isArray = obj instanceof Array

  for(let k in obj) {
    if(obj[k] === null) isArray ? obj.splice(k, 1) : delete obj[k]
    else if(typeof obj[k] == "object") removeNull(obj[k])
    if(isArray && obj.length == k) removeNull(obj)
  }

  return obj
}

const builtins = require('./builtins')

%}

@builtin "string.ne"
@builtin "whitespace.ne"

main    -> _ program:* _    {% d => removeNull(d[1]||[]).map(k => k[0]) %}
program -> comment
         | string
         | variable
         | "{" program "}" (argsDefinition | num:?) {% d => console.log(d) /*[builtins.NAMES.FUNCTION, new builtins.CFFunction()]*/ %}

argsDefinition -> num               {% d => [num] %}
                | "(" varchar:+ ")" {% d => [d[1].length, d[1]] %}

string   -> dqstring        {% d => [builtins.NAMES.STRING, new builtins.CFString(d[0].split('').map(char => new builtins.CFNumber(char.charCodeAt(0).toString('16'))))] %}

variable -> varchar         {% d => [builtins.NAMES.VARIABLE, new builtins.CFVariable(d[0][0])] %}
varchar  -> [a-z]
num      -> [A-Z0-9]
          | "#" [A-Z0-9]:+  {% d => d[1] %}

comment  -> "--" .:*        {% d => null %}
