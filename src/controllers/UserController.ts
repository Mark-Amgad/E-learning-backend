import { Request, Response } from "express";
import UserModel from "../models/User";


export default class UserController
{

    public async getAllUsers(req:Request,res:Response)
    {
        try
        {
            let result  = await UserModel.find();
            if(result)
            {
                res.json({"users" : result});
            }
            else
            {
                res.json({"message" : "users not found"});
            }
        }
        catch(err)
        {
            res.json(err);
        }
    }

    public async getUser(req:Request,res:Response)
    {
        try
        {
            let email:string = req.params.email;
            let result  = await UserModel.findOne({email:email});
            if(result)
            {
                res.json({"user" : result});
            }
            else
            {
                res.json({"message" : "user not found"});
            }
        }
        catch(err)
        {
            res.json(err);
        }
    }
    
    public async deleteUser(req:Request,res:Response)
    {
        try
        {
            let email:string = req.params.email;
            let result  = await UserModel.deleteOne({email:email});
            if(result.deletedCount === 1)
            {
                res.json({"message" : "Deleted successfully"});
            }
            else
            {
                res.json({"message" : "user not found"});
            }
        }
        catch(err)
        {
            res.json(err);
        }
    }


    public async updateUser(req:Request,res:Response)
    {
        try
        {
            let email:string = req.body.email;
            let result  = await UserModel.findOneAndUpdate(
                {email:email},
                req.body
            );
            if(result)
            {
                res.json({"message":"user updated","user" : result});
            }
            else
            {
                res.json({"message" : "user not found"});
            }
        }
        catch(err)
        {
            res.json(err);
        }
    }

    
}