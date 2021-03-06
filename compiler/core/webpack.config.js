const { resolve, join } = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const paths = {
  build: resolve(__dirname, "build"),
  src: resolve(__dirname, "src")
};

const copyPlugin = new CopyWebpackPlugin([
  {
    from: join(paths.src, "static"),
    to: join(paths.build, "static")
  }
]);

module.exports = [
  {
    entry: "./src/main.bs.js",
    output: {
      filename: "./build/index.js"
    },
    target: "node",
    node: {
      __dirname: false
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      new webpack.BannerPlugin({
        banner: "#!/usr/bin/env node",
        raw: true
      }),
      copyPlugin
    ]
  },
  {
    entry: "./src/api.js",
    output: {
      filename: "./build/api.js",
      library: "lonac",
      libraryTarget: "umd"
    },
    resolve: {
      extensions: [".js"],
      alias: {
        fs: "memfs"
      }
    },
    node: {
      module: "empty"
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      })
    ]
  }
];
