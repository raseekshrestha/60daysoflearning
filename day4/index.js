const fs = require("fs");


// console.log('1')

// // synchronous
// fs.writeFileSync("test.txt", "something")


// console.log('2')

// console.log('3')

fs.writeFile("test.txt", "somthing", (err) => {
    if (err) {
        console.log("err")
    } else {
        console.log("2");
    }
})

console.log("3")