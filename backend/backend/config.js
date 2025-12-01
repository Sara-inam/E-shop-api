import dotenv from "dotenv";
dotenv.config();

class Config {
  constructor() {
    this.PORT = process.env.PORT ;
    this.MONGO_URI = process.env.MONGO_URI ;
    this.JWT_SECRET = process.env.JWT_SECRET ;
    this.EXPIRE_IN = process.env.EXPIRE_IN;
    this.EMAIL_SERVICE = process.env.EMAIL_SERVICE;
    this.EMAIL_USER = process.env.EMAIL_USER;
    this.EMAIL_PASS = process.env.EMAIL_PASS;
    // this.FRONTEND_URL = process.env.FRONTEND_URL;
    this.NODE_ENV = process.env.NODE_ENV;
    // this.NODE_ENV = process.env.NODE_ENV ;
    // this.cloud_name= process.env.CLOUDINARY_CLOUD_NAME,
    // this.api_key=process.env.CLOUDINARY_API_KEY,
    // this.api_secret=process.env.CLOUDINARY_API_SECRET,
  }
}

// ❄️ Freeze object to prevent modifications
const config = Object.freeze(new Config());

export default config;
