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



const cron = require("node-cron");
const { fetchAndStorePOTD } = require("./services/potdServices/fetchPOTDService");

// cron.schedule("*/30 * * * * *", async () => {
//     console.log("Fetching POTD every 30 seconds...");
//     await fetchAndStorePOTD();
// });
initializeSocket(server); 
app.listen(serverConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${serverConfig.PORT}`);
});
