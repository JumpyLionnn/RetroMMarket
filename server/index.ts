// importing libraries
process.env.NODE_ENV != "production" ? require("dotenv").config() : null;
const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nunjucks = require("nunjucks");
const fs = require("fs");
const request = require("request");
const nodemailer = require("nodemailer");
const querystring = require('querystring');
const webpush = require('web-push');


// setting up variables
const cwd = process.cwd();
const pageSize = 10;
const sellOffersLimit = 5;
const buyOrdersLimit = 5;

let requests = 0;

// loading data
const items = JSON.parse(fs.readFileSync(path.join(cwd, "server/data/items.json")).toString());
const categories = JSON.parse(fs.readFileSync(path.join(cwd, "server/data/categories.json")).toString());

// setting up the https server
const app = express();
const http = require("http");
const server = http.createServer(app);
if(process.env.NODE_ENV === 'production') {
    app.use((req: ExpressRequest, res: ExpressResponse, next: () => void) => {
      if (req.header("x-forwarded-proto") !== "https")
        res.redirect(`https://${req.header("host")}${req.url}`);
      else
        next();
    })
  }
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
nunjucks.configure(path.join(cwd ,"client"), {
    autoescape: true,
    express: app
});

// setting up the datacbase connection
const pg = require('pg');
const databaseConnectionData: {[key:string]: any} = {connectionString: process.env.DATABASE_URL};
if(process.env.NODE_ENV == "production"){
    databaseConnectionData["ssl"] = { rejectUnauthorized: false };
}
const client = new pg.Client(databaseConnectionData);
client.connect();

let connected: boolean = false;
client.on("connect", (error: Error, response: Response) => {
    if(error) {
        console.log(error);
        return;
    }
    connected = true;
    console.log("Successfuly connected to postgres.");
    createTables();
});


webpush.setVapidDetails(
  'mailto:RetroMMarket@gmail.com',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

setInterval(update, 1000 * 60 * 60);


// setting up the http routes
app.use("/style", express.static(path.join(cwd ,"client/style")));
app.use("/assets", express.static(path.join(cwd ,"client/assets")));
app.use("/src", express.static(path.join(cwd ,"client/build")));

app.get("/", verifyAuth, homePageRoute);
app.get("/orders", verifyAuth, ordersPageRoute);
app.get("/sell", verifyAuth, (req: ExpressRequest, res: ExpressResponse) => sellPageRoute(req, res, ""));
app.get("/profile", verifyAuth, profilePageRoute);
app.get("/register", checkAuth, (req: ExpressRequest, res: ExpressResponse) => registerPageRoute(req, res, {}));
app.get("/login", checkAuth, (req: ExpressRequest, res: ExpressResponse) => loginPageRoute(req, res, {}));


app.post("/register", api, checkAuth, registerRoute);
app.post("/login", api, checkAuth, loginRoute);
app.get("/logout", api, verifyAuth, logoutRoute);

app.post("/changeDiscordName", api, verifyAuth, changeDiscordNameRoute);
app.post("/changeRetroMMOUsername", api, verifyAuth, changeRetroMMOUsernameRoute);

app.post("/sell", api, verifyAuth, sellRoute);
app.post("/buy", api, verifyAuth, buyRoute);
app.post("/cancelOffer", api, verifyAuth, cancelSellOfferRoute);
app.post("/cancelOrder", api, verifyAuth, cancelBuyOrderRoute);
app.get("/find", api, verifyAuth, findSellOfferRoute);
app.post("/buyOrderDelivered", api, verifyAuth, buyOrderDeliveredRoute);

app.get("/sellOffers", api, verifyAuth, getSellOffersRoute);
app.get("/buyOrders", api, verifyAuth, getBuyOrdersRoute);

app.get("/notifications", api, verifyAuth, getNotificationsRoute);

app.get("/items", api, verifyAuth, getItemsRoute);

app.get("/verify/email", verifyEmail);
app.get("/resendVerificationEmail", api, resendVerificationEmail);

app.get("/forgotpassword", forgotPasswordPageRoute);
app.post("/forgotpassword", api, forgotPasswordRoute);

app.get("/resetpassword", (req: ExpressRequest, res: ExpressResponse) => resetPasswordPageRoute(req, res, {}));
app.post("/resetpassword", api, resetPasswordRoute);

app.get("/dashboard", verifyAuth, adminOnly, dashboardPageRoute);
app.get("/rows", verifyAuth, adminOnly, getRowsRoute);
app.get("/requests", verifyAuth, adminOnly, (req: ExpressRequest, res: ExpressResponse) =>  res.send({requests}));

app.post("/ban", verifyAuth, adminOnly, banRoute);
app.post("/unban", verifyAuth, adminOnly, unbanRoute);
app.post("/delete", verifyAuth, adminOnly, deleteUserRoute);

app.get("/vapidkey", verifyAuth, (req: ExpressRequest, res: ExpressResponse) => {res.send(process.env.PUBLIC_VAPID_KEY)});
app.post("/enablenotifications", verifyAuth, enableNotifications);
app.post("/disablenotifications", verifyAuth, disableNotifications);

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000.");
});