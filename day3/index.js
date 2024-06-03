const fs = require("fs");
const os = require("os");
const path = require("path");


const data = "day3 of nodejs";



// write file synchronously
fs.writeFileSync('./day3.txt', data);


// writes file asynchronously
// fs.writeFile("./day3.txt", data + " asynchronously", (err) => {
//     if (err) {
//         console.log("error writing to file");
//     }
//     else {
//         console.log("written to day3.txt")
//     }
// })


// reads synchronouslyt
// const mydata = fs.readFileSync("day3.txt", "utf-8")
// console.log(mydata);


// fs.readFile("day3.txt", "utf-8", (err, mydata) => {
//     if (err) {
//         console.log("err reading file", err);
//     } else {
//         console.log(mydata);
//     }
// })



// // testng synchronous nature
// console.log(fs.readFileSync("day3.txt", 'utf-8'));

// console.log('this line is below the readfilesync so this wont be printed until readFileSync is done reading')


// // testing asynchronous nature
// fs.readFile("day3.txt", "utf-8", (err, mydata) => {
//     if (err) {
//         console.log("error", err);
//     } else {
//         console.log('data: ', mydata);
//     }
// })
// console.log("this should not be blocked")


// addend to the current file
// fs.appendFileSync("day3.txt", " appended data")

// delete file
// fs.unlinkSync("a.jpg")

// creater folder
// fs.mkdirSync("testfolder")

// stats
// const stat = fs.statSync("testfolder")
// console.log(stat) //print stats
// console.log(stat.isDirectory()) //true
// console.log(stat.isFile()) //false


// os module
// console.log(os.cpus()) // cpu core details
// console.log(os.cpus().length) //total cores
// console.log(os.hostname()) // pc name 
// console.log(os.homedir()) // /home/raseek
// console.log(os.arch()) //archicture of cpu
// console.log((os.totalmem() / (1024 ** 3)).toFixed(2), "GB total ram")
// console.log((os.freemem() / (1024 ** 3)).toFixed(2), "GB free ram")


// path module
console.log(path.basename("/home/raseek/file.txt"))
console.log(path.dirname("/home/raseek/file.txt"))

console.log(path.join("/home/this/that", "a.png"))

console.log(path.extname("awesome.pdf"))

console.log("curr dir: ", path.dirname(__filename))

function isImage(file) {
    const ext = path.extname(file).slice(1)
    const imgext = ['png', 'jpg', 'webp', 'gif', 'bmp'];
    if (imgext.includes(ext)) {
        return true;
    } else {
        return false;
    }

}

console.log("a.png is image ? ", isImage("a.png"))
console.log("a.pdf is iamge ? ", isImage("a.pdf"))