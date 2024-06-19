import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Make sure to install bcrypt

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
    }
}, {
    versionKey: false,
    timestamps: true
});


const User = mongoose.model("User", userSchema);

export  {User};