var path = require('path')
var HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins:[
        new HtmlWebPackPlugin({
            template: "./src/template.html"
        }),
    ]

};