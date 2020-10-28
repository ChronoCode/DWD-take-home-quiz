const path = require('path');

module.exports = {
  entry: './src/index.jsx',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /.css$/,
        exclude: /\.module\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        // For images
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: ['file-loader']
      }
    ]
  }
}