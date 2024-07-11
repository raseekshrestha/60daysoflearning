
// for (let i = 0; i < 3; i++) {
//     setTimeout(() => {
//         console.log('val of i is', i);
//         console.log(i)
//     }, 10)
// }


// for (var i = 0; i < 3; i++) {
//     setTimeout(() => {
//         console.log('val of i is', i);
//         console.log(i)
//     }, 10)
// }





// closure
// function outer() {
//     const a = 10;
//     const b = 20;
//     const c = 30;
//     function inner() {
//         console.log(a)
//         console.log(b)
//         console.log(c)

//     }
//     return inner
// }

// func = outer()

// func()



// call
const person = { name: "ram" }
function sayHi(say) {
    console.log(say, this.name)
}

sayHi.call(person, "oi")
sayHi.apply(person, ["oi cunt"])
// func()


class Awesome {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}
awe = new Awesome(1, 2)

// const a = 1233;
const obj = {
    a: 12,
    test: function tester() {
        // const a = 123;
        // console.log(a)
        console.log(this.a)
    }
}


obj.test.call(awe)
const newfunc = obj.test.bind({ a: "bind" })
newfunc()
