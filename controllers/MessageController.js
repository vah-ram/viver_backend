import express from "express";
import { Message } from "../models/MessageModel.js"

const router = express.Router();

router.post("/add-message", async(req,res) => {
    const { from, to, message } = req.body;

    try {

        const messageResult = await Message.create({
            from: from,
            to: to,
            message: message
        });

        if(messageResult) {
            return res.json({ status: true })
        };

    } catch(err) {
        console.log(err)
    };

});

router.get("/get-message", async(req,res) => {
    const { from, to } = req.query;

    try {

        const messages = await Message.find({
            $or: [
                { from: from, to: to },
                { from: to, to: from }
            ]
        }).sort({ createdAt: 1 });

        return res.json({ messages })

    } catch(err) {
        console.log(err)
    };

});

export default router;