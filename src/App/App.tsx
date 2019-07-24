import React from "react"
import { StaticRouterProps } from "react-router"
import { StaticRouter, Switch, Route } from "react-router-dom"
import AppLayout from "./AppLayout"
import NotFound from "./views/NotFound"

const App: React.FC<StaticRouterProps> = ({ location, context }) => {
    return (
        <StaticRouter location={location} context={context}>
            <Switch>
                <Route path="/404" render={props => <NotFound {...props} />} />
                <Route path="/" render={props => <AppLayout {...props} />} />
            </Switch>
        </StaticRouter>
    )
}

export default App
