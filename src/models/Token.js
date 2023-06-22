import mongoose, { Schema } from "mongoose";

const TokenSchema = mongoose.Schema({
    userID:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: "users",
        unique: true,
    },
    token: {
        type: String,
        require: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
        expires: 3600, 
    }
})

export const TokenModel = mongoose.model("tokens", TokenSchema)