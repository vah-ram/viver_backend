import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Message = mongoose.model("Message", MessageSchema);
