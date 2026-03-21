const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');

//Post /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 400, 'User already exists with this email');
        }

        // only allow 'user' or 'chef' roles to be registered through this endpoint never 'admin'
        const allowedRoles = ['user', 'chef'];
        const assignedRole = allowedRoles.includes(role) ? role : 'user';

        //Create new user
        const user = await User.create({
            name,
            email,
            password,
            role: assignedRole,
        })

        //Generate token
        const token = generateToken(user._id);

        //Send success response
        sendSuccess(res, 201, 'User registered successfully', { 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

//Post /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;   

        //manaully select password since its hidden by default in the schema
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return sendError(res, 400, 'Invalid email or password');
        }

        const isMatch = await user.matchPassowrd(password);
        if (!isMatch) {
            return sendError(res, 400, 'Invalid email or password');
        }

        //Generate token
        const token = generateToken(user._id);

        //Send success response
        sendSuccess(res, 200, 'User logged in successfully', {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            }
        });
    } catch (error) {
        sendError(res, 500, error.message);
    }       
};

//Get /api/auth/me (requires token)
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return sendError(res, 404, 'User not found');
        }
        sendSuccess(res, 200, `User fetched ${user.id, user.name}`, {user});
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = { register, login, getMe };