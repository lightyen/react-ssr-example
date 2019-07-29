import React from "react"
import ReactDOMServer from "react-dom/server"
import { StaticRouterContext } from "react-router"
import App from "./App"

import "./scss/styles.scss"

export default (url: string) => {
    const context: StaticRouterContext = {}
    const __html = ReactDOMServer.renderToString(<App context={context} location={url} />)
    return {
        __html,
        context,
    }
}
