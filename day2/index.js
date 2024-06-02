const suma = require("./single")

const { multiply, division } = require("./multiple")

console.log("sum", suma(1, 2))

console.log("mul:", multiply(5, 6));
console.log("division: ", division(10, 2));
