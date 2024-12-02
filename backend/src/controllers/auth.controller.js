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

export const login = async(req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password) {
        res.status(400).json("All fields are required");
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message:"User not found"});
            console.log("User not found");
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            res.status(400).json({message:"Invalid password"});
            console.log("Invalid password");
            return;     
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        res.status(500).json({message:"Something went wrong in login controller"});
        console.log(error);
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message:"Logout successful"})
    } catch (error) {
        res.status(500).json({message:"Something went wrong in logout controller"});
        console.log(error);
    }
}

export const updateProfilePic = async(req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message:"Profile picture is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {new: true});

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic
        })

    } catch (error) {
        res.status(500).json({message:"Something went wrong in updateProfilePic controller"});
        console.log(error);
    }
}

export const checkAuth = async(req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({message:"Something went wrong in checkAuth controller"});
        console.log(error);
    }
}