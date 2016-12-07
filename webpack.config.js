module.exports = {
  entry: [
    './code/main.ts'
  ],
  output: {
    path: './',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.tsx', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map'
};
