import UserModel from "../models/User";
import {User} from "../models/User";

import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export default class Authentication
{
    async signUp(req:Request,res:Response)
    {
        try
        {
            let user:User = req.body.user;
            let email = user.email;
            let password = user.password;
            console.log(email);
            let users = await UserModel.find({"email":email});
            if(users.length !== 0){ // no user with this email
                return res.send("this user is already exist");
            }
            let hashedPassword:string = Authentication.encrypt(password);
            let newUser = new UserModel(
                {
                    firstName:user.firstName,
                    lastName:user.lastName,
                    email : email,
                    password:hashedPassword
                }
            );
            await newUser.save();
            return res.send("user created");
        }
        catch(err)
        {
            console.log(err);
            res.send("error in sign up");
        }
    }

    async login(req:Request, res:Response)
    {
        try
        {
            const email:string = req.body.email;
            const password:string = req.body.password;
            const user = await UserModel.findOne({email:email});
            if(user === null)
            {
                return  res.json({"message":"Wrong email"});
            }
            const correctPassword = user.password;
            const checkPassword = bcrypt.compareSync(password, correctPassword);
            console.log(checkPassword);
            if(checkPassword === true)
            {
                // generate JWT TOKEN
                let payload = {
                    email:email,
                    fname:user.firstName
                };
                let token = Authentication.generateJwt(payload);
                return res.json({"message":"Success login","token":token});
            }
            else
            {
                return res.json({"message":"Wrong password"});
            }
            //res.send("true");
        }
        catch(err)
        {
            console.log(err);
            res.send("error in login");
        }
    }

    static encrypt(plainText:string)
    {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(plainText, salt);
        return hash;
    }

    static generateJwt(data:object)
    {
        // data must be an object
        const token = jwt.sign(data,"KEY", {expiresIn: "10m"});
        return token;
    }
}