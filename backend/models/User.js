import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['apprentice', 'partyMaster', 'commissioner', 'admin'],
        default: 'apprentice',
    },
    level: {
        type: Number,
        default: 1,
    },
    exp: {
        type: Number,
        default: 0,
    },
    githubUsername: {
        type: String,
    },
    currentParty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        default: null,
    }
},
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);


export default User;