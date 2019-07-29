import React from "react"
import { StaticRouterProps } from "react-router"
import { StaticRouter } from "react-router-dom"
import AppRouter from "./AppRouter"

import fs from "fs"
import path from "path"
const hash = __webpack_hash__.slice(0, 8)

const styles = fs.readFileSync(`build/static/css/index.${hash}.css`, "utf8")
const files = fs.readdirSync(path.join(path.resolve(process.cwd(), "build", "static"), "client", "js"), {
    encoding: "utf-8",
})

const App: React.FC<StaticRouterProps> = props => {
    return (
        <html lang="en">
            <head>
                <title>SSR</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="description" content="Test SSR" />
                <link rel="shortcut icon" href="/assets/favicon.ico" />
                <style>${styles}</style>
                <style>{`
                body {
                    background: #fae6e6;
                }
            `}</style>
            </head>
            <body>
                <StaticRouter {...props}>
                    <AppRouter />
                </StaticRouter>
                {props.location !== "/404" &&
                    files.map((f, i) => <script key={i} type="text/javascript" src={"/client/js/" + f} />)}
            </body>
        </html>
    )
}

export default App
