import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String},
    gender: {type: String},
    password: {type: String, required:true},
}, {timestamps: true});
const User = mongoose.model("User", userSchema)
export default User