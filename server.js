const http = require('http');

//Import app.js
const app = require("./app");

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port);