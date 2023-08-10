import express from 'express'
import dotenv from 'dotenv'
import { UsersModel } from '../../models/Users.js'
import { AddressesModel } from '../../models/Addresses.js'
dotenv.config();
const router = express.Router();

router.post("/add", async (req,res) =>{
    try
    {
        const {userID, fullname, phonenumber, region, province, city, barangay, streetaddress, label, defaultaddress, pickupaddress, returnaddress } = req.body;
        let user = await UsersModel.findOne({_id: UserID})
        if(!user)
        {
            return res.status(400).send({message: "No user found."})
        }

        await new AddressesModel({
            userID: userID,
            fullname: fullname,
            phonenumber: phonenumber,
            region: region,
            province,
            city,
            barangay,
            streetaddress,
            label,
            defaultaddress,
            pickupaddress,
            returnaddress,
        }).save();

        return res.json({message: "Address successfully added."})
    
    }catch(err){
        console.log(err)
        return res.status(500).send({message: "Please contact technical support."})
    }
})

export {router as AddressesRouter} 