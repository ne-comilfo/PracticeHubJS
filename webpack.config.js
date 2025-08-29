'use strict';

const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    main: './js/main.js',
    library: './js/pages/library/library.js',
    quiz: './js/pages/quiz/quiz.js',
    game: './js/pages/game/game.js',
    video: './js/pages/video-service/video-service.js',
    password: './js/pages/password/password.js',
    english: './js/pages/learn-english/learn-english.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  watch: true,
  devtool: 'source-map',

  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: 'commonjs' 
              }]
            ]
          }
        }
      }
    ]
  }
};