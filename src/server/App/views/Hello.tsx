import React from "react"
import { Link } from "react-router-dom"

function Hello() {
    return (
        <div className="card">
            <div className="card-body">
                <Link className="btn btn-primary" to="/foo">
                    這是一個 Server Side 渲染的按鈕
                </Link>
            </div>
        </div>
    )
}

export default Hello
