import React from "react"
import ReactDOMServer from "react-dom/server"
import App from "./App"
export default url => ReactDOMServer.renderToString(<App url={url} />)
