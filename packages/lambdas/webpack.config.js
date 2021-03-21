/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
/* eslint-enable @typescript-eslint/no-var-requires */

const config = {
  prod: process.env.NODE_ENV === "production",
};

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  mode: config.prod ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "lambdas.js",
    libraryTarget: "commonjs2",
  },
  devtool: "source-map",
  externals: {
    "aws-sdk": "aws-sdk",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
};
