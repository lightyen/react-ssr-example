// @ts-check
const express = require("express")
const app = express()

app.get("*", (req, res) => {
    const SSR = require("./build")
    const __html = SSR()
    res.send(`<!DOCTYPE html>
<html lang="en">
    <head>
        <title>SSR</title>
        </head>
    <body>
        ${__html}
    </body>
</html>`)
})

app.listen(3000, () => {
    console.log("Running on http://localhost:3000/")
})
