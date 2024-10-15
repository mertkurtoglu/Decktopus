const PresentationRoutes = require("./presentationRoutes");

module.exports = function (app) {
  app.use("/", PresentationRoutes);
};