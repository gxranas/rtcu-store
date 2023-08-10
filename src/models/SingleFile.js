import mongoose from "mongoose";

const SingleFileSchema = mongoose.Schema({
    storeName: { type: String , unique: true },
    storeDesc: { type: String , unique: true },
    fileName: { type: String , unique: true },
    filePath: { type: String , unique: true },
    fileType: { type: String , unique: true },
    fileSize: { type: String , unique: true },
})

export const SingleFileModel = mongoose.model("singlefile", SingleFileSchema);