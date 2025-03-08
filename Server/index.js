const express = require("express");
const http = require("http");
const { serverConfig, dbConnection } = require("./config");
const apiRoutes = require("./routes");
const initializeSocket = require("./socket/socket");

const app = express();
const server = http.createServer(app); 

dbConnection();

app.use(express.json());
app.use("/api", apiRoutes);

initializeSocket(server); 

server.listen(serverConfig.PORT, () => {
  console.log(`Server running on PORT: ${serverConfig.PORT}`);
});
