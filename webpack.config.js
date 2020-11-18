const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    background: path.join(__dirname, 'extension', 'background.ts'),
    github: path.join(__dirname, 'extension', 'github.ts'),
  },
  output: {
    path: path.join(__dirname, 'built'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}
