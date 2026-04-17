// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name:{type:String,required:true,trim:true},
//     phone:{type:String,required:true,unique:true,match: [/^(\+92|0)?3\d{9}$/, "Please enter a valid Pakistani phone number"]},
//     email:{type:String,required:true,default:null,unique:true,match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],lowercase:true},
//     passwordHash:{type:String,required:true},
//     role:{type:String,enum:["User"],default:"User"}
// },
// {timestamps:true}
// );

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["User"], default: "User" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);