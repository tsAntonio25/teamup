import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";
import { getUserTotalCommits } from "../services/githubService.js";

// register new user
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

// login existing user
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

        // get total commits for role change
        if (user.githubUsername) {
            const commits = await getUserTotalCommits(user.githubUsername);
            const newRole = commits >= 3000 ? "partyMaster" : "apprentice";

            if (user.role !== newRole) {
                user.role = newRole;
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
