// @ts-check
const { spawn } = require("child_process")

/**
 * @class StartServerPlugin
 * @implements {import("webpack").Plugin}
 * @typedef {{ dist?: string }} MyOption
 * @param {MyOption?} option
 * @this StartServerPlugin
 */
const StartServerPlugin = function(option) {
    option = option || {}
    /**
     * distination
     * @type {string}
     */
    this.dist = option.dist || "dist"
    /**
     * hash
     * @type {string}
     */
    this.hash = ""
    /**
     * process instance
     * @type {import("child_process").ChildProcess}
     */
    this.child = null
}

/** @param {import("webpack").Compiler} compiler */
StartServerPlugin.prototype.apply = function(compiler) {
    compiler.hooks.emit.tap("start-server-plugin", (compilation, callback) => {
        if (this.hash === compilation.hash || compilation.errors.length > 0) {
            return
        }
        this.hash = compilation.hash
        /** @type {import("child_process").ChildProcess} */
        if (this.child) {
            process.kill(this.child.pid)
        }
        this.child = spawn("node", [this.dist], {
            stdio: [process.stdin, process.stdout, process.stderr],
        })
    })
}

module.exports = StartServerPlugin
