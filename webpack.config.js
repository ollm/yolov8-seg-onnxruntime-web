const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.js',
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
      "fs": false,
      "path": false,
      "crypto": false
    }
  },
  externals: {
    'onnxruntime-node': 'commonjs2 onnxruntime-node'
  }
};
