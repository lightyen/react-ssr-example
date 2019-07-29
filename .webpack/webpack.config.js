// @ts-ignore
const package = require("../package.json")
// @ts-check
const path = require("path")
const fs = require("fs")
const workingDirectory = process.cwd()

// Plugins
const { TsConfigPathsPlugin } = require("awesome-typescript-loader")
const { ExtendedAPIPlugin, EnvironmentPlugin } = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackbarPlugin = require("webpackbar")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const StartServerPlugin = require("./StartServerPlugin")
const nodeExternals = require("webpack-node-externals")

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
    devtool: "inline-source-map",
    watch: true,
    watchOptions: { ignored: /node_modules/ },
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
    externals: [nodeExternals()], // 排除已安裝的第三方套件，例如 express
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
            {
                test: /\.s(a|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [require("cssnano")],
                            minimize: true,
                        },
                    },
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new ExtendedAPIPlugin(),
        new EnvironmentPlugin({
            VERSION: package.version,
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[hash:8].css",
            chunkFilename: "static/css/[name].[hash:8].chunk.css",
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*"],
        }),
        new CopyWebpackPlugin([{ from: "assets", to: "static/assets" }]),
        new WebpackbarPlugin({ color: "#d670d6", name: "React SSR" }),
        new StartServerPlugin({ dist: "build" }),
    ],
}
