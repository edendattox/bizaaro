const { merge } = require("webpack-merge");
const path = require("path");

const config = require("./webpack.config");

module.exports = merge(config, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    writeToDisk: true,
    clientLogLevel: "info",
  },
  output: {
    path: path.resolve(__dirname, "public"),
  },
});
