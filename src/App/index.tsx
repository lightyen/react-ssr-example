import React from "react"
import ReactDOMServer from "react-dom/server"
import App from "./App"
import { StaticRouterContext } from "react-router"
import { Request } from "express"

export default (context: StaticRouterContext, request: Request) =>
    ReactDOMServer.renderToString(<App context={context} request={request} />)
