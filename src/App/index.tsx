import React from "react"
import ReactDOMServer from "react-dom/server"
import App from "./App"
export default (url: string) => ReactDOMServer.renderToString(<App url={url} />)
