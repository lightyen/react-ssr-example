// @ts-check

const path = require("path")
const { spawn } = require("child_process")
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
    mode: "production",
    stats: {
        children: false,
        modules: false,
        entrypoints: false,
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
            apply: compiler => {
                // 這一個客製化的 plugin，功能是完成後啟動 server，並接上 stdio
                compiler.hooks.done.tap("CustomPlugin", compilation => {
                    const child = spawn("node", ["build", "index.js"], {
                        stdio: [process.stdin, process.stdout, process.stderr],
                    })
                })
            },
        },
    ],
}
