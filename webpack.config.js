const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/webview/Dashboard.tsx',
  output: {
    path: path.resolve(__dirname, 'media'),
    filename: 'dashboard.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};