declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production"
        VERSION: string
    }
}

declare const __webpack_hash__: string
