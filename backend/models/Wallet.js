// const mongoose = require("mongoose");

// const walletSchema = new mongoose.Schema({
//     userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true},
//     balance:{type:Number,default: 0,min: 0,set: v => Math.round(v * 100) / 100},
//     lastUpdated:{type:Date,default:Date.now}
// },
// {timestamps:true}
// );

// module.exports = mongoose.model("Wallet", walletSchema);

const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0, min: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);