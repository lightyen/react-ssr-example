import React from "react"
import { StaticRouterProps } from "react-router"
import { StaticRouter, Switch, Route } from "react-router-dom"
import AppLayout from "./AppLayout"
import NotFound from "./views/NotFound"
import { Request } from "express"

interface Props extends StaticRouterProps {
    request: Request
}

const App: React.FC<Props> = ({ request, context }) => {
    return (
        <StaticRouter location={request.url} context={context}>
            <Switch>
                <Route path="/404" render={props => <NotFound {...props} />} />
                <Route path="/" render={props => <AppLayout {...props} />} />
            </Switch>
        </StaticRouter>
    )
}

export default App
