import mongoose, { Schema } from "mongoose";

const AddressSchema = mongoose.Schema({
    userID:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: "users",
        unique: true,
    },
    fullname: {type: String, require: true},
    phonenumber: {type: String, require: true},
    region: {type: String, require: true},
    province: {type: String, require: true},
    city: {type: String, require: true},
    barangay: {type: String, require: true},
    streetaddress: {type: String, require: true},
    label:{type: String, require: true},
    defaultaddress: {type: Boolean},
    pickupaddress: {type: Boolean},
    returnaddress: {type: Boolean},
})

export const AddressesModel = mongoose.model("addresses", AddressSchema);