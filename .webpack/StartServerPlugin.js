// @ts-check
const path = require("path")
const fs = require("fs")
const { spawn } = require("child_process")
const ps = require("ps-node")

/** @typedef {{ workingDirectory?: string }} MyOption */

/**
 * @class
 * @implements {import("webpack").Plugin}
 * @param {?MyOption} option
 * @description 這一個隨便寫寫的 plugin，主要功能是檔案打包後重啟動 web server，並接上 stdio
 */
function CustomPlugin(option) {
    option = option || {}
    CustomPlugin["workingDirectory"] = option.workingDirectory || process.cwd()
    CustomPlugin["hash"] = ""
}

/** @param {import("webpack").Compiler} compiler */
CustomPlugin.prototype.apply = compiler => {
    compiler.hooks.done.tapAsync("CustomPlugin", (compilation, callback) => {
        if (CustomPlugin["hash"] === compilation.hash || compilation.hasErrors()) {
            callback()
            return
        }
        CustomPlugin["hash"] = compilation.hash
        // @ts-ignore
        ps.lookup(
            {
                command: "node",
                arguments: "build",
            },
            (err, resultList) => {
                if (err) {
                    throw new Error(err)
                }
                resultList.forEach(p => {
                    if (p) {
                        process.kill(p.pid)
                    }
                })
                const child = spawn("node", ["build"], {
                    stdio: [process.stdin, process.stdout, process.stderr],
                })
                callback()
            },
        )
        const workingDirectory = CustomPlugin["workingDirectory"]
        const src = path.resolve(workingDirectory, "src/assets/favicon.ico")
        const des = path.resolve(workingDirectory, "build", "favicon.ico")
        fs.createReadStream(src).pipe(fs.createWriteStream(des))
    })
}

module.exports = CustomPlugin
