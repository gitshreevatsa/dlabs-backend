const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const dbConfig = require("./dbConfig");
const path = require("path");
dotenv.config(".env");
const morgan = require("morgan");

/**
 * router imports
 */
// const eventHandler = require("./api/eventRouter");
const userHandler = require("./api/userRoute");
const marketplacehandler = require("./api/marketplace");


const app = express();
app.use(cors());
dbConfig();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// app.use("/api/v1/events", eventHandler);
app.use("/api/v1/user", userHandler);
// app.use("/api/v1/auth");
app.use("/api/v1/marketplace", marketplacehandler);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "server has started on:  " +
        `${process.env.NODE_ENV}`+
        " mode"
    );
  } else {
    console.log(
      "server has started on:  " +
        `${process.env.NODE_ENV}` +
        " mode"
    );
  }
  console.log(`url: ` + `http://localhost:${port}`);
});
