const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy"
        },

        target: {
            type: String,
            default: ""
        },

        frequency: {
            type: String,
            enum: ["Daily", "Weekly"],
            default: "Daily"
        },

        isRecommended: {
            type: Boolean,
            default: false
        },

        icon: {
            type: String,
            default: "🌱"
        }
    },
    {
        timestamps: true
    }
);

const Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit;