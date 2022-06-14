const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            // 1、第一种方式，适用于使用多个loader但是不需要添加配置
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // 2、第二种方式，适用于只使用一个loader并且需要添加配置
            // {
            //     test: /\.css$/,
            //     use: 'css-loader'
            // }
            // 3、第三种方式，适用于使用多个loader并且需要添加配置
            // {
            //     test: /\.css$/,
            //     use: [
            //         {
            //             loader: 'css-loader',
            //             // options: ''
            //         }
            //     ]
            // }

            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    }
}