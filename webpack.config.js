module.exports = {
  entry: [
    './code/main.ts'
  ],
  output: {
    path: './build',
    filename: 'freenote.js'
  },
  resolve: {
    extensions: ['', '.tsx', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: [/node_modules/, '/code/normaljs/']
      }
    ]
  },
  devtool: 'source-map'
};
