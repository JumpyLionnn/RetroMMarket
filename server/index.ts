// importing libraries
process.env.NODE_ENV != "production" ? require("dotenv").config() : null;
const express = require("express");
const path = require("path");

// setting up variables
const cwd = process.cwd();

// setting up the https server
const app = express();
const http = require("http");
const server = http.createServer(app);

// setting up the datacbase connection
const pg = require('pg');
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
});
client.connect();
let connected: boolean | Error = false;
client.on("connect", (error: Error, response: Response) => {
    if(error) {
        connected = error;
        console.log(error);
        return;
    }
    connected = true;
    console.log("Successfuly connected to postgres.");
});


// setting up the http routes
app.use("/style", express.static(path.join(cwd ,"client/style")));
app.use("/assets", express.static(path.join(cwd ,"client/assets")));
app.use("/src", express.static(path.join(cwd ,"client/build")));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(cwd ,"client/index.html"));
});

app.get("/status", (req: Request, res: Response) => {
    res.send(connected.toString());
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000.");
});