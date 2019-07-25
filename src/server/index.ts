import express from "express"
import path from "path"
import App from "~/App"
import { StaticRouterContext } from "react-router"

const defaultPort = 3000

const app = express()

const cwd = process.cwd()

const hash = __webpack_hash__.slice(0, 8)

app.use("/", express.static(path.resolve(cwd, "build")))

app.get("*", (req, res, next) => {
    const context: StaticRouterContext = {}
    const __html = App(context, req)
    if (context.url) {
        res.redirect(302, context.url)
        return
    }

    res.send(`<!DOCTYPE html>
<html lang="en">
    <head>
        <title>SSR</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="Test SSR">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="stylesheet" href="/static/css/index.${hash}.css">
    </head>
    <body>
        ${__html}
        <script src="/static/js/jquery.slim.min.js"></script>
        <script src="/static/js/bootstrap.bundle.min.js"></script>
    </body>
</html>`)
})

app.listen(defaultPort, () => {
    console.log("\x1b[1;35m%s\x1b[0m", `Running on http://localhost:${defaultPort}/`)
})
