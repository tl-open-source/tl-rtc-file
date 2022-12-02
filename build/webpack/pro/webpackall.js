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
        new watchNewEntry(),
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
            new UglifyJSPlugin()
        ]
    },
};
