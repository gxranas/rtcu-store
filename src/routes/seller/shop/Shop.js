import express from 'express'
import dotenv from 'dotenv'
import {SingleFileModel} from '../../../models/SingleFile.js'
import {MulterSetup} from '../../../middlewares/Multer.js'
dotenv.config();
const router = express.Router();

const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}

router.post("/single", MulterSetup.single('file'), async (req,res) =>{
    try
    {
        const {storename,storedesc} = req.body;

        const file = new SingleFileModel({
            storeName: storename,
            storeDesc: storedesc,
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
        });
        await file.save();
        res.status(201).send('File Uploaded Successfully');
    }
    catch(error) {
        res.status(400).send(error.message);
    }
})


export {router as ShopRouter} 