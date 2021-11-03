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

// setting up variables
const cwd = process.cwd();
const pageSize = 15;
const sellOffersLimit = 5;
const buyOrdersLimit = 5;
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

setInterval(cleanUpDatabase, 1000 * 60 * 60);


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


app.post("/register", checkAuth, registerRoute);
app.post("/login", checkAuth, loginRoute);
app.get("/logout", verifyAuth, logoutRoute);

app.post("/changeDiscordName", verifyAuth, changeDiscordNameRoute);
app.post("/changeRetroMMOUsername", verifyAuth, changeRetroMMOUsernameRoute);

app.post("/sell", verifyAuth, sellRoute);
app.post("/buy", verifyAuth, buyRoute);
app.post("/cancelOffer", verifyAuth, cancelSellOfferRoute);
app.post("/cancelOrder", verifyAuth, cancelBuyOrderRoute);
app.get("/find", verifyAuth, findSellOfferRoute);
app.post("/buyOrderDelivered", verifyAuth, buyOrderDeliveredRoute);

app.get("/sellOffers", verifyAuth, getSellOffersRoute);
app.get("/buyOrders", verifyAuth, getBuyOrdersRoute);

app.get("/items", verifyAuth, getItemsRoute);

app.get("/verify/email", verifyEmail);
app.get("/resendVerificationEmail", resendVerificationEmail);

app.get("/forgotpassword", forgotPasswordPageRoute);
app.post("/forgotpassword", forgotPasswordRoute);

app.get("/resetpassword", (req: ExpressRequest, res: ExpressResponse) => resetPasswordPageRoute(req, res, {}));
app.post("/resetpassword", resetPasswordRoute);

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000.");
});