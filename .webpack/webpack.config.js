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
    devtool: "source-map",
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
            {
                test: /\.s(a|c)ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
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
        {
            apply: compiler =>
                compiler.hooks.afterEmit.tap("custom-plugin", (compilation, callback) => {
                    const src = path.resolve(workingDirectory, "src/assets/favicon.ico")
                    const des = path.resolve(workingDirectory, "build", "favicon.ico")
                    fs.createReadStream(src).pipe(fs.createWriteStream(des))
                }),
        },
        new WebpackbarPlugin({ color: "#d670d6", name: "React SSR" }),
        new CopyWebpackPlugin([
            { from: "node_modules/jquery/dist/jquery.slim.min.js", to: "static/js" },
            { from: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "static/js" },
            { from: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map", to: "static/js" },
        ]),
        new StartServerPlugin({ dist: "build" }),
    ],
}
