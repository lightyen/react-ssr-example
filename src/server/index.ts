import express, { Request, Response } from "express"
import path from "path"
import App from "~/App"

const defaultPort = 3000

const app = express()

const cwd = process.cwd()

app.use("/", express.static(path.resolve(cwd, "build", "static")))

const reactMiddleware = (req: Request, res: Response) => {
    const { __html, context } = App(req.url)
    if (context.url) {
        res.redirect(302, context.url)
        return
    }
    res.send(`<!DOCTYPE html>${__html}`)
}

app.get("*", reactMiddleware)

app.listen(defaultPort, () => {
    console.log("\x1b[1;35m%s\x1b[0m", `Running on http://localhost:${defaultPort}/`)
})
