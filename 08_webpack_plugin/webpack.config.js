const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            esModule: false
                        }
                    }, 
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader' ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                type: 'asset',
                generator: {
                    filename: 'img/[name].[hash:8][ext]',
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 100 * 1024
                    }
                }
            },
            {
                test: /\.(ttf|woff2?)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'font/[name].[hash:8][ext]'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}