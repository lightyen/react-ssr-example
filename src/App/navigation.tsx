import React from "react"
import { RouteConfig } from "react-router-config"
import Hello from "./views/Hello"
import Foo from "./views/Foo"

export const routes: RouteConfig[] = [{ path: "/", exact: true, component: Hello }, { path: "/foo", component: Foo }]
