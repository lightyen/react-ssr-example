import express, { Request, Response } from "express"
import path from "path"
import App from "./App"
import { StaticRouterContext } from "react-router"
import fs from "fs"

const defaultPort = 3000

const app = express()

const cwd = process.cwd()

const hash = __webpack_hash__.slice(0, 8)

const styles = fs.readFileSync(`build/static/css/index.${hash}.css`, "utf8")
const jqueryBundle = fs.readFileSync(`node_modules/jquery/dist/jquery.slim.min.js`, "utf8")
const bootstrapBundle = fs.readFileSync(`node_modules/bootstrap/dist/js/bootstrap.bundle.min.js`, "utf8")

app.use("/", express.static(path.resolve(cwd, "build", "static")))

const middleware = (req: Request, res: Response) => {
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
        <link rel="shortcut icon" href="/assets/favicon.ico">
        <style>
        ${styles}
        </style>
    </head>
    <body>
        ${__html}
        ${
            req.url.startsWith("/404")
                ? ""
                : `<script type="text/javascript" src="/client/js/index.bundle.js"></script>
<script type="text/javascript" src="/client/js/vendor.bundle.chunk.js"></script>`
        }
    </body>
</html>`)
}

app.get("*", middleware)

app.listen(defaultPort, () => {
    console.log("\x1b[1;35m%s\x1b[0m", `Running on http://localhost:${defaultPort}/`)
})
