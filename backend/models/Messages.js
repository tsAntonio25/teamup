import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    channelType: {
        type: String,
        enum: ['party', 'quest'],
        required: true,
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party'
    },
    quest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxLength: 1000,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;