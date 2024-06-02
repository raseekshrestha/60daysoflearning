# Day 2

## Node js modules


we can split our code into multiple files and use it as a module

module is available in nodejs only not js


we use `require` to import the code and `module.exports` to expor the functions and variable

export function like this;
```
// codes
function sum(a, b) {
    return a + b;
}

module.exports = sum;
```

import like this
```
const sum = require("./single");
console.log("sum", sum(1, 2));

```

multiple export
```
function multiply(a, b) {
    return a * b;
}

function division(a, b) {
    return a / b;
}

module.exports = { multiply, division };
```

multiple import:
```
const { multiply, division } = require("./multiple")

console.log("sum", sum(1, 2))

console.log("mul:", multiply(5, 6));
console.log("division: ", division(10, 2));
```


Note: single export is also called defalt export and we can import with any name ,but for multiple export also called naed export we have to import with the same name.
