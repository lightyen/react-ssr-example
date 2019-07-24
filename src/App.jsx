import React from "react"
import { StaticRouter, Switch, Route } from "react-router-dom"

function Hello() {
    return (
        <div>
            <button>這是一個 Server Side 渲染的按鈕</button>
        </div>
    )
}

function Foo() {
    return (
        <div>
            <button>Foo</button>
        </div>
    )
}

function App({ url }) {
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
