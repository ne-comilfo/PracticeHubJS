'use strict';

const path = require('path');
const fs = require('fs');

const projectFolder = path.resolve(__dirname, 'project');
const distFolder = fs.existsSync(projectFolder) 
    ? path.resolve(projectFolder, 'dist')  
    : path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'development',

  context: __dirname,

  entry: {
    main: './js/main.js',
    library: './js/pages/library/library.js',
    quiz: './js/pages/quiz/quiz.js',
    game: './js/pages/game/game.js',
    video: './js/pages/video-service/video-service.js',
    password: './js/pages/password/password.js',
    english: './js/pages/learn-english/learn-english.js',
    dragdrop: './js/pages/drag&drop/drag&drop.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: distFolder,
    clean: true, // очищает dist перед каждой сборкой
  },

  watch: true,
  devtool: 'source-map',

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
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
                modules: 'commonjs',
              }],
            ],
          },
        },
      },
    ],
  },
};
