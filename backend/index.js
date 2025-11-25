import express from "express";
import cors from "cors";
import config from "./config.js";
import connectdb from "./src/db/db.js";
import logger from "./src/config/logger.js";
import app from './src/app.js';

const server = express();   
const allowedOrigins = [
  "http://localhost:5173", // dev frontend
  "https://monroe-grip-olympics-narrative.trycloudflare.com" // Cloudflare tunnel
];

server.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman or curl requests
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE"]
}));
server.use(express.json());


server.use('/api', app);

const startServer = async () => {
  await connectdb();
  const PORT = config.PORT;
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer();
