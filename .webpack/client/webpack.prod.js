// @ts-check
const webpackMerge = require("webpack-merge")
const { ContextReplacementPlugin } = require("webpack")
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const path = require("path")
const createBaseConfig = require("./webpack.common")
const fs = require("fs")

process.env.NODE_ENV = "production"

/** DLL 位置 */
const vendorPath = "" // path.resolve(process.cwd(), "build", "vendor")

/**
 * @type {import("webpack").Plugin[]}
 */
const plugins = [
    new ContextReplacementPlugin(/moment[/\\]locale$/, /^es$|zh/),
    new CompressionWebpackPlugin({ algorithm: "gzip", threshold: 10240 }),
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: vendorPath
            ? ["**/*", "!vendor", "!vendor/vendor.js", "!vendor/manifest.json"]
            : ["**/*"],
    }),
    // new BundleAnalyzerPlugin({
    //     analyzerMode: "static",
    //     openAnalyzer: false,
    //     reportFilename: "report.html",
    //     defaultSizes: "parsed",
    //     generateStatsFile: false,
    //     statsFilename: "stats.json",
    //     statsOptions: null,
    //     logLevel: "info",
    // }),
]

/**
 * @type { import("webpack").Configuration }
 */
const config = {
    mode: "production",
    stats: {
        children: false,
        modules: false,
        entrypoints: false,
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 716800,
        maxAssetSize: 716800,
        assetFilter: filename => {
            const ext = path.extname(filename)
            return ext === "css" || ext === ".js"
        },
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
        splitChunks: {
            maxInitialRequests: 6,
            cacheGroups: {
                bootstrap: {
                    name: "bootstrap",
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]bootstrap/,
                },
                moment: {
                    name: "moment",
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]moment/,
                },
                jquery: {
                    name: "jquery",
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]jquery/,
                },
                fontAwesome: {
                    name: "fa",
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]@fortawesome/,
                },
                three: {
                    name: "three",
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]three/,
                },
                other: {
                    name: "vendor",
                    chunks: "all",
                    test: /[\\/]node_modules[\\/](styled|popper|intl|react|redux|axios|webfont|@redux|history)/,
                },
            },
        },
    },
    resolve: {
        alias: {},
    },
    plugins,
}

module.exports = webpackMerge(
    createBaseConfig({
        vendor: vendorPath,
    }),
    config,
)
