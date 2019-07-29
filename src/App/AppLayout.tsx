import React from "react"
import { Switch, RouteComponentProps, Redirect, Route } from "react-router-dom"

import { routes } from "./navigation"

const AppLayout: React.FC<RouteComponentProps> = () => {
    return (
        <Switch>
            {routes.map(({ ...rest }, i) => (
                <Route key={i} {...rest} />
            ))}
            <Redirect to="/404" />
        </Switch>
    )
}

export default AppLayout
