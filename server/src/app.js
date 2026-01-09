const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const app = express();

//cors
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://pawpal-swart.vercel.app",
  ],
};
const passport = require("passport");
require("./config/passport");

app.use(cors(corsOptions));

//body and cookie
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
//routes
app.use("/api", apiRoutes);

//health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

//404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
