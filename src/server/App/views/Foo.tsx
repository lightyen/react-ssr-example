import React from "react"
import { Link } from "react-router-dom"

const Foo: React.FC = ({}) => {
    return (
        <div className="card">
            <div className="card-body">
                <Link className="btn btn-primary" to="/">
                    Foo
                </Link>
            </div>
        </div>
    )
}

export default Foo
