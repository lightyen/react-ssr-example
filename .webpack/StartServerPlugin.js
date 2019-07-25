// @ts-check
const { spawn } = require("child_process")

/**
 * @implements {import("webpack").Plugin}
 * @description 這一個隨便寫寫的 plugin，主要功能是檔案打包後重啟動 web server，並接上 stdio
 */
module.exports = class StartServerPlugin {
    /** @type {string} */
    dist

    /** @type {string} */
    hash

    /** @type {import("child_process").ChildProcess} */
    child

    /**
     * @typedef {{ dist?: string }} MyOption
     * @param {MyOption?}option
     */
    constructor(option) {
        option = option || {}
        this.dist = option.dist || "dist"
        this.hash = ""
    }

    /** @param {import("webpack").Compiler} compiler */
    apply(compiler) {
        compiler.hooks.emit.tap("start-server-plugin", (compilation, callback) => {
            if (this.hash === compilation.hash || compilation.errors.length > 0) {
                return
            }
            this.hash = compilation.hash
            if (this.child) {
                process.kill(this.child.pid)
            }
            this.child = spawn("node", [this.dist], {
                stdio: [process.stdin, process.stdout, process.stderr],
            })
        })
    }
}
