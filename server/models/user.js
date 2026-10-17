const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpires: {
        type: Date,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    otpBlockUntil: {
        type: Date,
        default: null
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;