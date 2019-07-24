import express from "express"
import path from "path"
import App from "~/App"
import { StaticRouterContext } from "react-router"

const app = express()

const hash = __webpack_hash__.slice(0, 8)

app.get("*", (req, res, next) => {
    if (req.url.startsWith("/favicon")) {
        res.sendFile(path.resolve("build", "favicon.ico"))
        return
    }

    if (req.url.startsWith(`/index.${hash}.css`)) {
        res.sendFile(path.resolve("build", "static/css", `index.${hash}.css`))
        return
    }

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
        <link rel="stylesheet" href="/index.${hash}.css">
    </head>
    <body>
        ${__html}
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    </body>
</html>`)
})

app.listen(3000, () => {
    console.log("Running on http://localhost:3000/")
})
