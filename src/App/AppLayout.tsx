import React from "react"
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom"

import Hello from "~/App/views/Hello"
import Foo from "~/App/views/Foo"

const AppLayout: React.FC<RouteComponentProps> = () => {
    return (
        <Switch>
            <Route path="/" exact component={Hello} />
            <Route path="/foo" exact component={Foo} />
            <Redirect to="/404" />
        </Switch>
    )
}

export default AppLayout
