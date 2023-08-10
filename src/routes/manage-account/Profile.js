import express from 'express'
import dotenv from 'dotenv'
import { UsersModel } from '../../models/Users.js'
dotenv.config();
const router = express.Router();

router.post("/update", async (req,res) =>{
    try
    {
        const { UserID, name , phonenumber , gender , dateofbirth } = req.body;
        let user = await UsersModel.findOne({_id: UserID})
    
        if(!user)
        {
            return res.status(400).send({message: "No user found."})
        }
    
        await UsersModel.updateOne({
            name: name,
            phonenumber: phonenumber,
            gender: gender,
            dateofbirth: dateofbirth
        })
    
        return res.json({message: "Profile successfully updated."})
    }catch(err){
        console.log(err)
        return res.status(500).send({message: "Please contact technical support."})
    }
})

export {router as ProfileRouter} 