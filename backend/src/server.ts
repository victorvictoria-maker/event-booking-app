import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import errorHandler = require("errorhandler");
import { dbConfig } from "./models/_config";
import { routes } from "./routes/index.route";
import { morgan } from "./utilities/logger.util";
const port = process.env.PORT || 8082;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(morgan);

app.options("*", cors());
app.use(cors());

app.use(function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  err.status = 404;
  next(err);
});

app.use(errorHandler());

dbConfig();

routes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
