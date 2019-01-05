const NODE_ENV = process.env.NODE_ENV;

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const DEFAULT_LESS = new ExtractTextWebpackPlugin({ filename: 'css/default.css', allChunks: true });
const PROJECT_LESS = new ExtractTextWebpackPlugin({ filename: 'css/[name].css', allChunks: true });

module.exports = {
    devtool: 'source-map',
    entry: {
        vendor: ['react', 'react-dom', 'redux', 'react-redux',
            'react-router', 'redux-thunk', 'autoprefixer',
            'add-dom-event-listener', 'moment', 'axios',
            path.join(__dirname, 'src/theme')
        ],
        main: ['babel-polyfill', 'antd', path.join(__dirname, 'src/entry')]
    },
    output: {
        path: path.resolve(__dirname, 'dist/static'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.less'],
        modules: [
            path.join('node_modules')
        ],
        alias: {
            'config': path.join(__dirname, 'config'),
            'components': path.join(__dirname, 'src/components'),
            'images': path.join(__dirname, 'src/images'),
            'lib': path.join(__dirname, 'src/lib'),
            'store': path.join(__dirname, 'src/store'),
            'theme': path.join(__dirname, 'src/theme'),
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpe?g|gif|ico)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.(woff2?|svg|ttf|eot)$/,
                loader: 'file-loader',
                query: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.less/,
                include: path.join(__dirname, 'src/theme'),
                loader: DEFAULT_LESS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: [require('autoprefixer')]
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                javascriptEnabled: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.less/,
                include: [
                    path.join(__dirname, 'node_modules/antd')
                ],
                exclude: path.join(__dirname, 'src/theme'),
                loader: PROJECT_LESS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: [require('autoprefixer')]
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                javascriptEnabled: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.less/,
                include: [
                    path.join(__dirname, 'src')
                ],
                exclude: path.join(__dirname, 'src/theme'),
                loader: PROJECT_LESS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: [require('autoprefixer')]
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                javascriptEnabled: true
                            }
                        }
                    ]
                })
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'],
            filename: 'js/[name].js',
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: '',
            template: path.join(__dirname, 'src/views/index.html'),
            filename: '../templates/index.html',
            // favicon: path.join(__dirname, 'src/views/favicon.ico'),
            inject: true,
            chunks: ['vendor', 'main'],
            minify: NODE_ENV == 'production' ? {
                removeAttributeQuotes: true,
                collapseWhitespace: true
            } : false
        }),
        DEFAULT_LESS,
        PROJECT_LESS
    ].concat(NODE_ENV == 'production' ? [
        /**
         * 生产模式下的配置
         */
        new webpack.optimize.UglifyJsPlugin({ // js代码压缩
            compress: {
                warnings: false
            }
        }),
        new OptimizeCssAssetsWebpackPlugin({ // css代码压缩
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        })
    ] : [])
}