import { Schema,model } from "mongoose";

export interface User
{
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    level:number,
    verified:boolean,
    token:string,
    scores:{testId:string|number, score:number}[],
    imageUrl:string
}

let userSchema = new Schema<User>({
    firstName:{type:String,required:true},
    lastName:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true},
    level:{type:Number},
    verified:{type:Boolean},
    token:{type:String},
    scores:[{type:String}],
    imageUrl:String
});

const UserModel = model<User>("User",userSchema);
export default UserModel;