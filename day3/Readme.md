# Day 3

## Node js fs


node js has built in module `fs` which can be used to read and write data from storage.

there are two models : `synchronous` and `asynchronous`. synchronous is blocking while asynchronous is non blocking

synchronous function doesnt use callback functions while asynchronous uses callback function which will be executed after the asynchronous operation is finished executing. that's how it is non blocking.


example:


```
// testng synchronous nature
console.log(fs.readFileSync("day3.txt", 'utf-8'));

console.log('this line is below the readfilesync so this wont be printed until readFileSync is done reading')


// testing asynchronous nature
fs.readFile("day3.txt", "utf-8", (err, mydata) => {
    if (err) {
        console.log("error", err);
    } else {
        console.log('data: ', mydata);
    }
})
console.log("this should not be blocked")

```

output:
```
day3 of nodejs
this line is below the readfilesync so this wont be printed until reafFileSync is done reading
this should not be blocked
data:  day3 of nodejs
```

fs module:

provides functionality to interact with the host machine file system


os module:

allows us to get the os and hardware informations

path module:

provides functionality to manupulate and parse the path of file and directories.