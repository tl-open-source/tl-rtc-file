const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const watchNewEntry = require('./plugin/watchNewEntry');
const { JS_PATH, CSS_PATH } = require('./comm/path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 500,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: JS_PATH,
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            //configFile: path.join(__dirname, './config/.babelrc'),
                        },
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
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                { convertPathData: false },
                                { mergePaths: false },
                            ],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
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
            '.vue',
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
