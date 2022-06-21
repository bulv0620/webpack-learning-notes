const resolvePath = require('./paths');
const { merge } = require('webpack-merge');
const prodConfig = require('./webpack.prod.js');
const devConfig = require('./webpack.dev.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

const commonConfig = {
    entry: './src/index.ts',
    devServer: {
        hot: true,
    },
    resolve: {
    	extensions: ['.js', '.json', '.ts', '.vue']
	},
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //         cacheGroups: {
    //             syVandors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 filename: 'js/[contenthash].vendor.js',
    //                 priority: -10,
    //             },
    //             default: {
    //                 minChunks: 2,
    //                 filename: 'js/[contenthash].js',
    //                 priority: -20,
    //             }
    //         }
    //     }
    // },
    output: {
        path: resolvePath('./dist'),
        filename: 'js/[contenthash:8].bundle.js',
        chunkFilename: 'js/[name][contenthash:8].chunk.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Learning webpack',
            template: './public/index.html',
        }),
        new DefinePlugin({
            BASE_URL: "'./'"
        })
    ]
}

module.exports = (env) => {
    const isProduction = env.production;

    process.env.NODE_ENV = isProduction ? 'production' : 'development';

    const config = isProduction ? prodConfig : devConfig;
    return merge(commonConfig, config);
}