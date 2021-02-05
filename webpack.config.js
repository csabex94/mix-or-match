const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [require('@babel/plugin-proposal-class-properties')]
                    }
                }
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                test: /\.(png|jpg|gif|mp3|wav)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                        },
                    },
                ],
            },
            { test: /\.(eot|svg|ttf|woff|woff2|cur)$/, use: ['url-loader?limit=100000'] }
        ]
    },
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    resolve: {
        fallback: {
            "fs": false
        },
    }
}