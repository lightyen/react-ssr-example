// @ts-ignore
const packageJSON = require("../../package.json")

// @ts-check
const {
    EnvironmentPlugin,
    ProvidePlugin,
    DllReferencePlugin,
    NormalModuleReplacementPlugin,
    ExtendedAPIPlugin,
} = require("webpack")
const path = require("path")
const glob = require("glob")

// Plugins
const { TsConfigPathsPlugin } = require("awesome-typescript-loader")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackBarPlugin = require("webpackbar")

// NOTE: 關閉 webpack 要求 donate 訊息
process.env.DISABLE_OPENCOLLECTIVE = "true"

/** @type { import("webpack").Entry } */
const entry = {
    index: "./src/client/index.tsx",
}

/** @typedef {{
 *    dist?: string
 *    src?: string
 *    vendor?: string
 * }} Options */

/**
 * @param {?Options} options
 *
 * @returns { import("webpack").Configuration }
 */
module.exports = function(options) {
    const workingDirectory = process.cwd()
    const dist = (options && options.dist) || path.resolve(workingDirectory, "build", "static", "client")
    const vendor = (options && options.vendor) || ""
    const isDevelopment = process.env.NODE_ENV === "development"

    process.env.PUBLIC_URL = process.env.PUBLIC_URL || ""

    /**
     * @type {import("webpack").Plugin[]}
     */
    const plugins = [
        new WebpackBarPlugin({ color: "blue", name: "React" }),
        new EnvironmentPlugin({
            NODE_ENV: process.env.NODE_ENV,
            PUBLIC_URL: process.env.PUBLIC_URL,
            APP_NAME: packageJSON.name,
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:8].css",
            chunkFilename: "css/[name].[hash:8].chunk.css",
        }),
        new ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
        new NormalModuleReplacementPlugin(/!#$/, function(resource) {
            /**
             * @type {string}
             */
            const request = resource.request
            resource.request = request.slice(0, request.length - 2)
        }),
    ]

    if (vendor) {
        plugins.push(
            new DllReferencePlugin({
                context: vendor,
                manifest: require(path.join(vendor, "vendor.json")),
            }),
        )
    }

    if (!isDevelopment) {
        /** __webpack_hash__ The hash of the compilation available as free var. */
        /** WARNING: Don't combine it with the HotModuleReplacementPlugin. It would break and you don't need it as the HotModuleReplacementPlugin export the same stuff. */
        plugins.push(new ExtendedAPIPlugin())
    }

    /**
     * @type {import("webpack").Loader}
     * See [style-loader]{@link https://github.com/webpack-contrib/style-loader} and [mini-css-extract-plugin]{@link https://github.com/webpack-contrib/mini-css-extract-plugin}.
     */
    const styleLoader = {
        loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
    }

    /**
     * @type {import("webpack").Loader}
     * See [url-loader]{@link https://github.com/webpack-contrib/url-loader} and [file-loader]{@link https://github.com/webpack-contrib/file-loader}.
     */
    const imageLoader = {
        // NOTE: A loader for webpack which transforms files into base64 URIs.
        loader: "url-loader",
        options: {
            // NOTE: output path
            name: "static/assets/images/[name].[ext]?[hash:8]",
            limit: 8192,
            fallback: "file-loader",
        },
    }

    /**
     * @type {import("webpack").Loader}
     */
    const fontLoader = {
        loader: "url-loader",
        options: {
            name: "static/assets/fonts/[name].[ext]?[hash:8]",
            limit: 8192,
            ack: "file-loader",
        },
    }

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

    return {
        entry,
        output: {
            path: dist,
            filename: isDevelopment ? "js/bundle.js" : "js/bundle.[hash].js",
            chunkFilename: isDevelopment ? "js/[name].chunk.js" : "js/[name].bundle.chunk.js",
            publicPath: process.env.PUBLIC_URL + "/",
        },
        target: "web",
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    use: [
                        {
                            loader: "pug-loader",
                            options: {
                                pretty: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.tsx?$/,
                    exclude: path => {
                        const regs = [/node_modules|\.test.tsx?$/]
                        return regs.some(r => r.test(path))
                    },
                    use: [tsxLoader],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
                    use: imageLoader,
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                    use: fontLoader,
                },
                // For user space:
                {
                    exclude: /node_modules/,
                    test: /\.css$/,
                    use: [styleLoader, "css-loader", "postcss-loader"],
                },
                {
                    exclude: /node_modules/,
                    test: /\.less$/,
                    use: [
                        styleLoader,
                        {
                            loader: "dts-css-modules-loader",
                            options: {
                                namedExport: true,
                                banner:
                                    "// This file is automatically generated by dts-css-modules-loader.\n// Please do not change this file!\n",
                            },
                        },
                        "css-loader",
                        "postcss-loader",
                        "less-loader",
                    ],
                },
                {
                    exclude: /node_modules/,
                    test: /\.s(a|c)ss$/,
                    use: [styleLoader, "css-loader", "postcss-loader", "sass-loader"],
                },
                // For node_modules:
                {
                    include: /node_modules/,
                    test: /.css$/,
                    use: [styleLoader, "css-loader", "postcss-loader"],
                },
                {
                    include: /node_modules/,
                    test: /\.less$/,
                    use: [
                        styleLoader,
                        "css-loader",
                        "postcss-loader",
                        {
                            loader: "less-loader",
                            options: {
                                javascriptEnabled: true,
                                modifyVars: {
                                    // 改變antd主題色，例：
                                    // "primary-color": "#1da57a",
                                },
                            },
                        },
                    ],
                },
                {
                    include: /node_modules/,
                    test: /\.s(a|c)ss$/,
                    use: [styleLoader, "css-loader", "postcss-loader", "sass-loader"],
                },
            ],
        },
        // NOTE: https://webpack.js.org/configuration/resolve/
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            plugins: [
                new TsConfigPathsPlugin({
                    configFileName: path.join(workingDirectory, "tsconfig.json"),
                }),
            ],
        },
        plugins,
    }
}
