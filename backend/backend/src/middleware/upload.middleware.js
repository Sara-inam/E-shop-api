// middleware/upload.js
import multer from "multer";
import fs from "fs";
import path from "path";

// uploads folder check aur create
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique filename
  }
});

export const upload = multer({ storage });
