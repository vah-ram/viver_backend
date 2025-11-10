import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/RegisterModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = express.Router();

router.post("/register", async(req,res) => {
    const { username, email, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const hasUsername = await User.findOne({ username });
            if(hasUsername) {
                return res.json({msg: "Username is already exists!", status: false})
            };

        const hasEmail = await User.findOne({ email });
            if(hasEmail) {
                return res.json({msg: "Email is already exists!", status: false})
            };

        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        await user.save();

        if(user) {
            return res.json({ status: true, user: user });
        } else {
            return res.json({ status: false });
        }

    } catch(err) {
        console.log(err)
    };

});

router.post('/login', async(req,res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
            if(!user) {
                return res.json({msg: "Invalid Email!", status: false});
            }

        const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
                return res.json({msg: "Invalid Password!", status: false});
            };
        
        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_KEY,
            {expiresIn: '24h'}
        );

        return res.json({ status: true, token, user });

    } catch(err) {
        console.error(err);
    };

});

router.get('/search', async(req,res) => {

    const { username } = req.query;

    try {

        const users = await User.find({
            username: { $regex: username, $options: "i" }
        });
        
        return res.json({ users });

    } catch(err) {
        console.error(err);
    };

});

router.post('/subscribe', async(req,res) => {

    const { myId, subscribeId } = req.body;

    try {
        const user = await User.findById(myId); 
        const subscribeUser = await User.findById(subscribeId); 

        if(!user || !subscribeUser) {
            return res.json({ status: false, msg: "User not found!!!" })
        };

        if (!user.subscribed.includes(subscribeId)) {
            user.subscribed.push(subscribeId);
                await user.save();
        }

        if (!subscribeUser.subscribers.includes(myId)) {
            subscribeUser.subscribers.push(myId);
            await subscribeUser.save();
        }

        return res.json({ status: true });

    } catch (err) {
        console.error(err);
        res.json({ status:false, message: "Server error" });
    }

});

router.post('/add-contact', async(req,res) => {

    const { myId, contactId } = req.body;

    try {

        const user = await User.findById(myId); 
        const contact = await User.findById(contactId); 

        if(!user || !contact) {
            return res.json({ status: false, msg: "User not found!!!" })
        };

        if (!user.contacts.includes(contactId)) {
            user.contacts.push(contactId);
            await user.save();
        }

        if (!contact.contacts.includes(myId)) {
            contact.contacts.push(myId);
            await contact.save();
        }

        return res.json({ status: true });

    } catch (err) {
        console.error(err);
    }

});

router.get('/get-contact', async(req,res) => {

    const { myId } = req.query;

    try {

       const user = await User.findById(myId).populate("contacts");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ contacts: user.contacts });

    } catch (err) {
        console.error(err);
    }

});

router.get('/get-user', async(req,res) => {

    const { id } = req.query;

    try {
        const user = await User.findById(id); 

        if (user) {
            return res.json(user);
        };

    } catch (err) {
        console.error(err);
        res.json({ status:false, message: "Server error" });
    }

});

router.get('/get-my-data', async(req,res) => {

    const { myId } = req.query;

    try {
        const user = await User.findById(myId); 

        if (user) {
            return res.json(user);
        };

    } catch (err) {
        console.error(err);
        res.json({ status:false, message: "Server error" });
    }

});

router.post('/add-account-picture', async( req, res ) => {
    const { myId, img } = req.body;

    try {
        const user = await User.findById(myId); 

        if (user) {
            user.avatar = img;
            await user.save();

            return res.json({ status: true, msg: "Avatar is added!" });
        } else {
            return res.json({ status: false, msg: "User not found!" });
        }

    } catch (err) {
        console.error(err);
        res.json({ status:false, message: "Server error" });
    }

});


export default router;
