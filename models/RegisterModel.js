import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        }
    ],
    subscribers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        }
    ],
    subscribed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        }
    ]
}, {
    timestamps: true
});

export const User = mongoose.model("User", UserSchema);
