/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const EslintPlugin = require('eslint-webpack-plugin');


module.exports = {
  devtool: "eval-source-map",
  mode: "development",
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      //ts loader
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")]
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new EslintPlugin({ extensions: 'ts' }),
],
"externals": {
  "express": "require('express')",
  "cookieParser": "require('cookie-parser')",
  "cors": "require('cors')",
  "crypto": "require('crypto')",
  "fs": "require('fs')",
  "path": "require('path')",
  "mongodb": "require('mongodb')"
}
};
