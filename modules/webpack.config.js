const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: './public/main.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title:"AAC for PWA",
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting:true,
      //swSrc:"./service-worker.js",
      //swDest:"service-worker.js"
    })
  ],
  output:{
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean:true
  },
  mode:'development'
};
