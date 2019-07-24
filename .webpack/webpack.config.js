// @ts-check

const path = require("path")
const { spawn } = require("child_process")
const ps = require("ps-node")
const workingDirectory = process.cwd()

// Plugins
const { TsConfigPathsPlugin } = require("awesome-typescript-loader")
const Webpackbar = require("webpackbar")

/**
 * @type {import("webpack").Loader}
 */
const tsxLoader = {
    loader: "awesome-typescript-loader",
    options: {
        configFileName: path.join(workingDirectory, "tsconfig.json"),
        silent: true,
        useBabel: true,
        useCache: true,
        babelCore: "@babel/core",
        babelOptions: {
            babelrc: true,
        },
    },
}

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
    target: "node",
    mode: "development",
    performance: false,
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    devtool: "source-map",
    stats: {
        all: false,
        colors: true,
        builtAt: true,
        errors: true,
        cached: true,
        cachedAssets: true,
        warnings: true,
    },
    entry: {
        index: path.resolve(workingDirectory, "src", "server", "index.ts"),
    },
    output: {
        path: path.resolve(workingDirectory, "build"),
        filename: "index.js",
        libraryExport: "default",
        libraryTarget: "commonjs2",
    },
    externals: ["express"],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        plugins: [
            new TsConfigPathsPlugin({
                configFileName: path.join(workingDirectory, "tsconfig.json"),
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules|\.test.tsx?$/,
                use: tsxLoader,
            },
        ],
    },
    plugins: [
        new Webpackbar({ name: "React SSR", color: "blue" }),
        {
            // 這一個客製化的 plugin，功能是修改檔案後重啟動 web server，並接上 stdio
            apply: compiler => {
                compiler.hooks.done.tap("CustomPlugin", function callback(compilation) {
                    if (callback["hash"] === compilation.hash || compilation.hasErrors()) {
                        return
                    }
                    callback["hash"] = compilation.hash
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
                        },
                    )
                    const child = spawn("node", ["build"], {
                        stdio: [process.stdin, process.stdout, process.stderr],
                    })
                })
            },
        },
    ],
}
