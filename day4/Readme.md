
# Day 4

## Node.js Architecture

learned about nodejs architecture

![App Screenshot](https://kinsta.com/wp-content/uploads/2021/03/Nodejs-Architecture-1024x576.png)


incomming request are queued in `event queue`.

then request are sent to `event loop` based on `FIFO`

if the request is non blocking it is processed and returns the response

if the request is blocking operation, then it is sent to thread pool, worker is assigned and request is processed and return response. 


synchronous operation
```
console.log('1')

fs.writeFileSync("test.txt", "something")


console.log('2')

console.log('3')
```

```
1
2
3
```

asynchronous operation
```
console.log('1');

fs.writeFile("test.txt", "somthing", (err) => {
    if (err) {
        console.log("err")
    } else {
        console.log("2");
    }
})

console.log("3")
```
output:
```
1
3
2
```