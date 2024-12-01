import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async(req, res) => {
    const { username, email, password} = req.body;
    try {
        if(!username || !email || !password) {
            res.status(400).json("All fields are required");
        }
        if( password.length < 6) {
            res.status(400).json("Password must be at least 6 characters long");
        }

        const user = await User.findOne({email});
        
        if(user) {
            res.status(400).json("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            username,
            password:hashPassword
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }

    } catch (error) {
        res.status(500).json({message:"Something went wrong in signup controller"}); 
        console.log(error);  
    }
}

export const logout = (req, res) => {
    res.send("logout");
}

export const login = (req, res) => {
    res.send("login");
}