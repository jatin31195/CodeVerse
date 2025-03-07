const express = require("express");
const {serverConfig, dbConnection} = require("./config");

const app = express();
dbConnection(); 

app.use(express.json());
app.get("/", (req, res) => res.send("Server is running..."));

app.listen(serverConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${serverConfig.PORT}`);
});
