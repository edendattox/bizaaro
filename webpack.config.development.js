const { merge } = require("webpack-merge");
const path = require("path");

const config = require("./webpack.config");

module.exports = merge(config, {
  node: "development",
  devtool: "inline-source-map",
  devServer: {
    writeToDisk: true,
  },
  output: {
    path: path.resolve(__dirname, "public"),
  },
});
