import React from "react"
import ReactDOMServer from "react-dom/server"
import App from "./App"

export default (url: string, context: any) => ReactDOMServer.renderToString(<App location={url} context={context} />)
