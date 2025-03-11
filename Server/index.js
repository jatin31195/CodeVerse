const express = require("express");
const http = require("http");
const cors = require("cors");
const { serverConfig, dbConnection } = require("./config");
const apiRoutes = require("./routes");
const initializeSocket = require("./socket/socket");

const app = express();
const server = http.createServer(app); 

dbConnection();

app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
}));

app.use(express.json()); 


app.use("/api", apiRoutes);

const cron = require("node-cron");
const { fetchAndStorePOTD } = require("./services/potdServices/fetchPOTDService");

// cron.schedule("*/10 * * * * *", async () => {
//     console.log("Fetching POTD every 30 seconds...");
//     await fetchAndStorePOTD();
// });

const io = initializeSocket(server);
app.set('socketio', io);
server.listen(serverConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${serverConfig.PORT}`);
});
