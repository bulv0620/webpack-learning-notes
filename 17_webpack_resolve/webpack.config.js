const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devServer: {
        hot: true,
    },
    resolve: {
    	extensions: ['.js', '.json', '.ts', '.vue'],
    	alias: {
    		'@': path.resolve(__dirname, 'src')
    	}
	},
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.js$/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Learning webpack',
            template: './public/index.html',
        }),
        new DefinePlugin({
            BASE_URL: "'./'"
        })
    ]
}