import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import passport from 'passport';
import { UsersModel } from '../models/Users.js'
import { TokenModel } from '../models/Token.js'
import  SendEmail  from '../utils/SendEmail.js'

dotenv.config();
const router = express.Router();

router.post("/register", async (req,res) =>{
    try
    {
    const {email, password } = req.body;
    let user = await UsersModel.findOne({email});

    if(user){
        return res.status(400).send({ message: "This email is already taken."});
    }

    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
    user = await new UsersModel({email, password: hashPassword }).save();
    const token = await new TokenModel({
        userID: user._id,
        token: jwt.sign({id: user._id}, process.env.SECRET_KEY)
    }).save();

    const emailURL = `${process.env.LOCAL_HOST}/auth/${user._id}/verify/${token.token}`;
    await SendEmail(user.email, "Email Verification", `Hi there, \n You have set ${user.email} as your registered email. Please click the link to verify your email: ` + emailURL);
    return res.status(200).send({message: "Successfully Registered!"})
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({message: "Please contact technical support."})
    }
})

router.post("/login", async (req,res) =>{
    try
    {
    const {email, password} = req.body;
    const user = await UsersModel.findOne({email});

    if(!user){
        return res.status(400).send({ message: "This user is not registered."});
    }

    const isValidatePassword = await bcrypt.compare(password,user.password);

    if(!isValidatePassword){
        return res.json({ message: "Incorrect email or password. Please try again."});
    }

    const token = jwt.sign({id: user._id}, process.env.SECRET_KEY);
    res.json({token, userID: user._id});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({message: "Please contact technical support."})  
    }
})

router.get("/:id/verify/:token", async (req,res)=>{
    try
    {
        const user = await UsersModel.findOne({_id: req.params.id});
        if(!user) return res.status(400).send({message: "Invalid link."});

        const token = await TokenModel.findOne({
            userID: user._id,
            token: req.params.token,
        })

        if(!token) return res.status(400).send({message: "Invalid link."});

        await UsersModel.updateOne({
            _id: user._id,
            verified: true,
        })
        await TokenModel.deleteMany({userID : user._id});

        res.status(200).send({message: "Email successfully verified."})
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({message: "Please contact technical support."})  
    }
})

router.get("/:id/resend-verification", async (req,res)=>{    
    try{
        const user = await UsersModel.findOne({_id:req.params.id});

        if(!user.verified){
            let token = await TokenModel.findOne({userID: user._id});
            if(!token){
                token = await new TokenModel({
                    userID: user._id,
                    token: jwt.sign({id: user._id}, process.env.SECRET_KEY)
                }).save();
            
                const emailURL = `${process.env.LOCAL_HOST}/auth/${user._id}/verify/${token.token}`;
                await SendEmail(user.email, "Email Verification", `Hi there, \n You have set ${user.email} as your registered email. Please click the link to verify your email: ` + emailURL);
                return res.status(200).send({message: "Verification sent."})
            }
            else
            {
                return res.status(400).send({message: "Please check your email."})
            }

        }
        else
        {
            return res.status(200).send({message: "Email Already Verified!"})
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send({message: "Please contact technical support."})  
    }   
})

router.get("/login/success", (req,res)=>{
    try
    {
        if(req.user){
        const token = jwt.sign({id: req.user._id}, process.env.SECRET_KEY);
        res.status(200).json({
            success:true,
            message:"Login successful.",
            user: req.user,
            token: token,
            id: req.user._id,
            cookies: req.cookies,
        });
        }
    }catch(err){
       console.log(err)
       return res.status(500).send({message: "Please contact technical support."})  
    }
})

router.get("/logout", (req,res) =>{
    try
    {
        req.logout();
        res.redirect(String(process.env.CLIENT_URL));
    }catch(err){
        console.log(err)
        return res.status(500).send({message: "Please contact technical support."})  
    }
})


router.get("/login/failed", (req,res)=>{
    try
    {
        res.status(401).json({
            success:false,
            message:"Login failed.",
        });
    }catch(err){
        console.log(err)
        return res.status(500).send({message: "Please contact technical support."})  
    }
})

router.get("/google",passport.authenticate("google", {scope: ["profile","email"]}));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: String(process.env.CLIENT_URL),
    failureRedirect: "/login/failed"
}))

export {router as UsersRouter} 