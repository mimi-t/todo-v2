const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname,'dist'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
            scriptLoading: 'defer',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|webp)$/i,
                type: "asset/resource",
            },
            {
                test: /\.svg$/i,
                type: "asset/source",
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    }
}