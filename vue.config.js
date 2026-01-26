module.exports = {
  transpileDependencies: ["vuetify", "dc-delivery-sdk-js"],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      https: true,
    },
  },
};
