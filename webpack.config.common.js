const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src'),
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },        
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
      },
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: `public/index.html`,
      title: 'Hot Module Replacement',
      favicon: 'public/favicon.ico',
      manifest: 'public/manifest.json',
    }),
  ],
}