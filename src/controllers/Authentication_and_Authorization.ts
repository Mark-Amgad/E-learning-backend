import UserModel from "../models/User";
import {User} from "../models/User";

import express, { Request, Response } from "express";
import bcrypt from "bcrypt";


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
                return res.send("this user doesn't exist");
            }
            console.log(user);
            res.send("true");
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
}