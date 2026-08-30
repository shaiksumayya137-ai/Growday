const mongoose = require("mongoose");

const customHabitSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            default: "Personal",
            trim: true
        },

        target: {
            type: String,
            default: "Daily",
            trim: true
        },

        icon: {
            type: String,
            default: "🌱"
        },

        currentStreak: {
            type: Number,
            default: 0
        },

        bestStreak: {
            type: Number,
            default: 0
        },

        totalCompletions: {
            type: Number,
            default: 0
        },

        completedToday: {
            type: Boolean,
            default: false
        },

        completionDates: {
            type: [Date],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const CustomHabit = mongoose.model(
    "CustomHabit",
    customHabitSchema
);

module.exports = CustomHabit;