const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");
const configt = require("./webpack.config");

module.exports = merge(config, {
  node: "production",
  output: {
    path: path.join(__dirname, "public"),
  },
  plugins: [new CleanWebpackPlugin()],
});
