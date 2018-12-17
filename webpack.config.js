let path = require('path');

module.exports = {
    entry: {
        browser: './app/index.js',
    },
    output: {
        filename: 'scripts.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                         "plugins": ["@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'app'),
        ]
    },
    mode: 'development',
    devtool: 'source-map'
};