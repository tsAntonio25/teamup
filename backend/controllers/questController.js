import Quest from "../models/Quest.js";

// create quest (POST)
export const createQuest = async (req, res) => {
    try {
        const {  
            title,
            description,
            techStack,
            difficulty,
            deadline,
            githubRepoOwner,
            githubRepoName
        } = req.body;

        const quest = await Quest.create({
            title,
            description,
            techStack,
            difficulty,
            deadline,
            githubRepoOwner,
            githubRepoName,
            commissioner: req.user._id 
        });

        res.status(201).json(quest);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create quest",
            error: error.message
        });
    }
};

// list quests (GET)
export const listQuests = async (req, res) => {
    try {
        const quests = await Quest.find().populate("commissioner", "fullName email").sort({ createdAt: -1 });

        res.json(quests);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quests",
            error: error.message
        });
    }
};

// get quest details by id (GET)
export const getQuestById = async (req, res) => {
    try {
        const quest = await Quest.findById(req.params.id).populate("commissioner", "fullName email");

        if (!quest) {
            return res.status(404).json({ message: "Quest not found" });
        }

        res.json(quest);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quest",
            error: error.message
        });
    }   
};

// update quest (PUT)
export const updateQuest = async (req, res) => {
    try {
        const quest = await Quest.findById(req.params.id);

        if (!quest) {
            return res.status(404).json({ message: "Quest not found" });
        }

        // check if user is the commissioner
        if (quest.commissioner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this quest" });
        }

        const updatedQuest = await Quest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedQuest);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update quest",
            error: error.message
        });
    }
};
