import * as express from "express";
import chalk = require("chalk");

import authRoute from "./auth.route";
import eventRoute from "./event.route";
import bookingRoute from "./booking.route";
/**
 * Create and return Router.
 *
 * @class Server
 * @method config
 * @return void
 */
export const routes = (app: express.Application) => {
  let router: express.Router;
  router = express.Router();

  console.log(chalk.yellow.bgBlack.bold("Loading sample routes"));
  authRoute.loadRoutes("/api/auth", router);
  eventRoute.loadRoutes("/api/event", router);
  bookingRoute.loadRoutes("/api/bookings", router);

  app.use(router);

  app.all("*", (req, res) => {
    console.log(req.url);
    return res.status(404).json({ status: 404, error: "not found" });
  });
};
