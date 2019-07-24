import React from "react"
import ReactDOMServer from "react-dom/server"
import AppRouter from "./AppRouter"
import { StaticRouterContext } from "react-router"
import { Request } from "express"

export default (context: StaticRouterContext, request: Request) =>
    ReactDOMServer.renderToString(<AppRouter context={context} request={request} />)
