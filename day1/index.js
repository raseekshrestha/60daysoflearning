

console.log("Hello nodejs")

function saySomething(message) {
    console.log(`Said : ${message}`)
}

saySomething("awesome")


// nodejs doesnt have some functionalities like window object and DOM manupulation
// alert("hello alering") //alert is not defined

function sum(a, b) {
    return a + b;
}


console.log(sum(1, 2))


const arr = [1, 2, 34, 5];
console.log(arr)
for (let i of arr) {
    console.log(i)
}

console.log("arr slice", arr.slice(0, 3))

// console.log()
const a = arr.splice(0, 2)
console.log(a)
console.log(arr)