const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const watchNewEntry = require('../plugin/watchNewEntry');
const { JS_PATH, CSS_PATH } = require('../comm/path');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 500,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: JS_PATH,
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader'
                    },
                ],
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            url: false
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            path: path.resolve(CSS_PATH, "./"),
            filename: '[name].min.css',
            ignoreOrder: false,
        }),
    ],
    resolve: {
        extensions: [
            '.js',
        ],
    },
    stats: {
        children: false,
    },
    externals: {
        jquery: 'jQuery',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                  output: {
                    comments: false, // 移除所有注释
                    beautify: false, // 不要美化输出，以使其更加紧凑
                  },
                  compress: {
                    booleans: true,
                    collapse_vars: true,
                    comparisons: true,
                    conditionals: true,
                    dead_code: true,
                    drop_console: true,
                    drop_debugger: true,
                    evaluate: true,
                    hoist_funs: true,
                    hoist_props: true,
                    hoist_vars: true,
                    if_return: true,
                    inline: true,
                    join_vars: true,
                    keep_infinity: true,
                    loops: true,
                    negate_iife: true,
                    properties: true,
                    reduce_funcs: true,
                    reduce_vars: true,
                    sequences: true,
                    side_effects: true,
                    switches: true,
                    toplevel: true,
                    typeofs: true,
                    unused: true,
                  },
                  mangle: {
                    toplevel: true,
                  },
                  extractComments: true,
                },
            })
        ]
    },
};
