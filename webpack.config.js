const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MinCssExtractPlugin = require("clean-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV == "dev";

const dirApp = path.join(__dirname, "app");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");
const dirNode = "node_modules";

module.exports = {
  entry: [path.join(__dirname, "index.js"), path.join(dirStyles, "index.scss")],
  resolve: {
    modules: {
      dirApp,
      dirShared,
      dirStyles,
      dirNode,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),
    new webpack.CopyWebpackPlugin({
      patterns: [
        {
          from: "./shared",
          to: "",
        },
      ],
    }),
  ],
};
