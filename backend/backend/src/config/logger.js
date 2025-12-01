import winston from "winston";


const logger = winston.createLogger({
  level: "info", 
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
   
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
    }),

    
    new winston.transports.File({ filename: "logs/app.log" }),

 
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});


Object.freeze(logger);

export default logger;
