import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";
import { getUserTotalCommits } from "../services/githubService.js";

// register new user (POST)
export const register = async (req, res) => {
    try {
        const { fullName, email, password, role, githubUsername, phoneNum, location, professionalInfo } = req.body;
        const exists = await User.findOne({ email });

        // if user already exists
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // if incomplete required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Please provide required fields"
            });
        }

        if (role && !["apprentice", "commissioner"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: role || "apprentice",
            githubUsername,
            phoneNum,
            location,
            professionalInfo: {
                primarySkills: professionalInfo?.primarySkills || [],
                techStack: professionalInfo?.techStack || []
            }
        });

        res.json({user});

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};

// login existing user (POST)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // get total commits for role change (apprentice only)
        if (user.role === "apprentice" && user.githubUsername) {
            const commits = await getUserTotalCommits(user.githubUsername);

            if (commits >= 3000) {
                user.role = "partyMaster";
                await user.save();
            }
        }


        res.json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                githubUsername: user.githubUsername,
                level: user.level,
                exp: user.exp,
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

// user profile (GET)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password")
            .populate("currentParty");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};

