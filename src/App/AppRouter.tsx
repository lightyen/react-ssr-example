import React from "react"
import { Switch, Route } from "react-router-dom"

import AppLayout from "./AppLayout"
import NotFound from "./views/NotFound"

const AppRouter: React.FC = () => {
    return (
        <Switch>
            <Route path="/404" render={props => <NotFound {...props} />} />
            <Route path="/" render={props => <AppLayout {...props} />} />
        </Switch>
    )
}

export default AppRouter
