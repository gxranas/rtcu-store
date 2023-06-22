import mongoose from "mongoose";

const UsersSchma = mongoose.Schema({
    email: { type: String , unique: true , require: true},
    password: { type: String},
    name: {type: String },
    verified: {type: Boolean, default: false},
})

export const UsersModel = mongoose.model("users", UsersSchma);