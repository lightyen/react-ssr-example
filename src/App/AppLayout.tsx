import React from "react"
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom"

function Hello() {
    return (
        <div className="card">
            <div className="card-body">
                <button className="btn btn-primary">這是一個 Server Side 渲染的按鈕</button>
            </div>
        </div>
    )
}

function Foo() {
    return (
        <div className="card">
            <div className="card-body">
                <button className="btn btn-primary">Foo</button>
            </div>
        </div>
    )
}

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
