const express = require("express");
const http = require("http");
const cors = require("cors");
const { serverConfig, dbConnection } = require("./config");
const apiRoutes = require("./routes");
const initializeSocket = require("./socket/socket");
const { startCleanupJob } = require('./utils/taskCleanupScheduler');
const app = express();
const server = http.createServer(app); 
const cookieParser = require('cookie-parser');
const { rateLimit } = require("express-rate-limit");
const startBirthdayScheduler = require('./utils/birthdayScheduler');

dbConnection();
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 100,
//   standardHeaders: "draft-7",
//   legacyHeaders: false
// });

// app.use(generalLimiter);
const corsOptions = {
  origin: ["http://localhost:5173","https://code-verse-aonf.onrender.com","https://codeverse.solutions","https://www.codeverse.solutions"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(express.json()); 

app.use("/api", apiRoutes);

const cron = require("node-cron");
const potdServices = require("./services/potdServices/fetchPOTDService");

// Schedule LeetCode POTD job at 5:30 AM every day
cron.schedule('30 5 * * *', () => {
    console.log("Running LeetCode POTD job...");
    potdServices.fetchAndStoreLeetCodePOTD();
  });
  
  // Schedule GFG and Codeforces POTD job at 12:00 AM (midnight) every day
  //for 10 second */10 * * * * *
  cron.schedule('0 0 * * *', () => {
    console.log("Running GFG and Codeforces POTD job...");
    potdServices.fetchAndStoreGFGPOTD();
    potdServices.fetchAndStoreCodeforcesPOTD();
  });

startCleanupJob();
startBirthdayScheduler();
const io = initializeSocket(server);
app.set('socketio', io);
server.listen(serverConfig.PORT, '0.0.0.0', () => {
    console.log(`Successfully started the server on PORT : ${serverConfig.PORT}`);
});
