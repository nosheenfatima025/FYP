// const mongoose = require("mongoose");

// const vehicleSchema = new mongoose.Schema({
//     userId:{type:mongoose.Schema.Types.ObjectId,ref: "User",required:true},
//     plateNumber:{type:String,required:true,unique:true,uppercase:true,trim:true},
//     qrCode:{type:String,required:true,unique:true},
//     isActive:{type:Boolean,default:true}
// },
// {timestamps:true}
// );

// module.exports = mongoose.model("Vehicle", vehicleSchema);

const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicleNumber: { type: String, unique: true, sparse: true },
    plateNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    qrCode: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);