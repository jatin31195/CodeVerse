const express = require("express");
const {serverConfig, dbConnection} = require("./config");
const apiRoutes =require("./routes");

const app = express();
dbConnection(); 

app.use(express.json());
app.get("/", (req, res) => res.send("Server is running..."));

app.use("/api",apiRoutes);
const cron = require("node-cron");
const { fetchAndStorePOTD } = require("./services/potdServices/fetchPOTDService");

cron.schedule("*/30 * * * * *", async () => {
    console.log("Fetching POTD every 30 seconds...");
    await fetchAndStorePOTD();
});
app.listen(serverConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${serverConfig.PORT}`);
});
