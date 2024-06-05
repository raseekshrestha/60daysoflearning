const http = require('http');
const url = require("url");

const server = http.createServer((req, res) => {
    if (req.url == "/favicon.ico") return res.end()
    console.log("request received success: ", req.url)
    const urlParsed = url.parse(req.url, true)
    // console.log(urlParsed)
    console.log(urlParsed.pathname)
    console.log(urlParsed.query)

    console.log("method: ", req.method)

    switch (urlParsed.pathname) {
        case "/":
            console.log("home page ma request")
            res.end("this is home page");
            break;
        case "/about":
            res.end("this is about page");
            break;
        case "/search":
            res.end("searching : " + urlParsed.query.q);
            break;
        default:
            res.end("404 nto found")
    }
})

server.listen(8000, () => {
    console.log("server running on port 8000 ")
})