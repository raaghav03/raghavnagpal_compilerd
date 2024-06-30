require("./envloader")();

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const baseRouter = require("./router.js");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const { respond, l } = require("./loader.js").helpers;

require("./loader.js").loadDependency(app);

/* Middlewares */
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return respond(res, 400, { message: "Invalid JSON found" });
  }
  next();
});
// Log all api requests
app.use(
  morgan(
    'REQUEST [:date[clf]] ":method :url HTTP/:http-version" :status :user-agent',
    {
      immediate: true,
      skip: function (req) {
        return req.path === "/api/";
      },
    }
  )
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
    parameterLimit: 1000000,
  })
);

app.use(compression());
app.use(helmet());
app.use(cors());

app.use("/api/", baseRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "frontend", "build")));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(PORT, () => {
  l.info(`Server started at port: ${PORT}`);
});
