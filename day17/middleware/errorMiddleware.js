
const notFound = (req, res, next) => {
    const error = new Error(`Tapaile hit garnu vayeko api endpoint vetiyena, kripiya yo endpoint pheri hit na garnu hola. The endpoint that you hit is NOT FOUND, Please do not hit this endpoint again ;)  ${req.originalUrl}`)
    res.status(400)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    // res.send("handling error")
    // console.log(err)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}

export { notFound, errorHandler }