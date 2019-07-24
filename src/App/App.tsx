import React from "react"
import { StaticRouter, Switch, Route } from "react-router-dom"

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

interface Props {
    url: string
}

const App: React.FC<Props> = ({ url }) => {
    return (
        <StaticRouter location={url}>
            <Switch>
                <Route path="/" exact component={Hello} />
                <Route path="/foo" exact component={Foo} />
            </Switch>
        </StaticRouter>
    )
}

export default App
