const path = require('path');

module.exports = {
    entry: "./src/main/resources/webapp/resources/player/main.js",
    output: {
        path: path.resolve(__dirname, './src/main/resources/webapp/resources/js'),
        filename: "html5player.js"
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                // Only run `.js` and `.jsx` files through Babel
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            ["@babel/preset-env", {
                                "targets": {
                                    "esmodules": true,
                                }
                            }],
                            "@babel/preset-react"
                        ]
                    }
                }]
            }
        ],
    }
};
