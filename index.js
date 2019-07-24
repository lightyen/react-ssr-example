// @ts-check
const express = require("express")
const app = express()
const SSR = require("./build")

app.get("*", (req, res, next) => {
    const __html = SSR(req.url)
    res.send(`<!DOCTYPE html>
<html lang="en">
    <head>
        <title>SSR</title>
        </head>
    <body>${__html}</body>
</html>`)
})

app.listen(3000, () => {
    console.log("Running on http://localhost:3000/")
})
