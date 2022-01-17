const path = require('path');

module.exports = {
  target: 'node',
  devtool: 'inline-source-map',
  entry: {
    index: path.join(__dirname, 'lib/index.ts'),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
    library: 'olv',
    libraryTarget: 'umd',
  },
  resolve: {
    modules: [path.join(__dirname, 'lib'), 'node_modules'],
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
