import React from "react"
import { Link } from "react-router-dom"

const Foo: React.FC = ({}) => {
    return (
        <div className="card m-3 border-0">
            <div className="card-header bg-dark">
                <Link className="btn btn-primary" to="/">
                    Foo
                </Link>
            </div>
            <div className="card-body">
                <div id="app" />
            </div>
        </div>
    )
}

export default Foo
