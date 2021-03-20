/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const handlers = require("./handlers.json");
/* eslint-enable @typescript-eslint/no-var-requires */

const config = {
  prod: process.env.NODE_ENV === "production",
};

const entries = Object.keys(handlers)
  .map((v) => handlers[v].split(".")[0])
  .reduce(
    (all, handlerFile) => ({
      ...all,
      [`./${handlerFile}`]: `./src/${handlerFile}.ts`,
    }),
    {},
  );

module.exports = {
  entry: entries,
  target: "node",
  mode: config.prod ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
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
