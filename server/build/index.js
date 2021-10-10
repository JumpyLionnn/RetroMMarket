"use strict";
const express = require("express");
const path = require("path");
const cwd = process.cwd();
const app = express();
const http = require("http");
const server = http.createServer(app);
app.get("/", (req, res) => {
    res.sendFile(path.join(cwd, "client/index.html"));
});
server.listen(process.env.PORT || 3000, () => {
    console.log("listening on *:3000");
});
;
//# sourceMappingURL=index.js.map