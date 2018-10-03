const path = require("path");

module.exports = {
  mode: "development",
  entry: [
    './code/main.ts'
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'freenote.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.ts(x?)$/,
        exclude: [/node_modules/, '/code/normaljs/']
      }
    ]
  },
  devtool: 'source-map'
};
