const express = require("express");
const {serverConfig, dbConnection} = require("./config");
const app = express();
dbConnection(); 
const apiRoutes =require("./routes");

app.use(express.json());
app.get("/", (req, res) => res.send("Server is running..."));

app.use("/api",apiRoutes);

app.listen(serverConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${serverConfig.PORT}`);
});
