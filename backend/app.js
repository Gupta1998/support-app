const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
require("./lib/utils").passport(passport);
const db = require("./config/db.js");
const analyticsRoutes = require("./api/analytics/analytics.route");
const userRoutes = require("./api/user/user.route");
const roleRoutes = require("./api/role/role.route");
const ticketRoutes = require("./api/ticket/ticket.route");
const commentRoutes = require("./api/comment/comment.route");
const brandRoute = require("./api/brand/brand.route");
const TicketLogRoutes = require("./api/ticketLog/ticketLog.route");
const TicketRequest = require("./api/ticketRequest/ticketRequest.route");
const uploadFile = require("./api/file/fileUpload.route");
const filter = require("./api/filters/filter.route");

const app = express();
const http = require("http");
const server = http.createServer(app);

// Socket setup
const io = require("socket.io")(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

const notification = require("./api/notification/notifications.route")(io);
const Chat = require("./api/chat/chat.route")(io);

// MONGODB
db();

// env config
dotenv.config({ path: "./config/config.env" });

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Auth-Token, Origin , Authorization"
  );
  next();
};
app.use(allowCrossDomain);

// Use express-session to store the session data
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(analyticsRoutes);
app.use(userRoutes);
app.use(roleRoutes);
app.use(ticketRoutes);
app.use(commentRoutes);
app.use(brandRoute);
app.use(TicketLogRoutes);
app.use(uploadFile);
app.use(notification);
app.use(Chat);
app.use(TicketRequest);
app.use(filter);

PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
