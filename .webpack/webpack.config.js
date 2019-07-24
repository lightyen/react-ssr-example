// @ts-check
const path = require("path")
const { spawn } = require("child_process")
const workingDirectory = process.cwd()

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
    target: "node",
    mode: "development",
    entry: {
        index: path.resolve(workingDirectory, "src", "index.jsx"),
    },
    output: {
        path: path.resolve(workingDirectory, "build"),
        filename: "index.js",
        libraryExport: "default",
        libraryTarget: "commonjs2",
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {},
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    babelrc: true,
                },
            },
        ],
    },
    plugins: [
        {
            apply: compiler => {
                // 這一個客製化的 plugin，功能是完成後啟動 server
                compiler.hooks.done.tap("CustomPlugin", compilation => {
                    const child = spawn("node", ["index.js"])
                    child.stdout.on("data", chunk => {
                        console.log(chunk.toString())
                    })
                    child.stderr.on("data", chunk => {
                        console.error(chunk.toString())
                    })
                })
            },
        },
    ],
}
