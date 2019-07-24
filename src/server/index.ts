import express from "express"
import SSR from "../App"

const app = express()

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
