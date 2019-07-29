import React from "react"
import { Link } from "react-router-dom"

function Hello() {
    return (
        <div className="card m-3 border-0">
            <div className="card-header bg-dark">
                <Link className="btn btn-primary" to="/foo">
                    這是一個 Server Side 渲染的按鈕
                </Link>
            </div>
            <div className="card-body">
                <div id="app" />
            </div>
        </div>
    )
}

export default Hello
