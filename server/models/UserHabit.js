const mongoose = require("mongoose");

const userHabitSchema = new mongoose.Schema(
    {
        habit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Habit",
            required: true
        },

        userId: {
            type: String,
            required: true
        },

        currentStreak: {
            type: Number,
            default: 0
        },

        bestStreak: {
            type: Number,
            default: 0
        },

        completedToday: {
            type: Boolean,
            default: false
        },

        totalCompletions: {
            type: Number,
            default: 0
        },

        completionDates: {
            type: [Date],
            default: []
        },

        startedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const UserHabit = mongoose.model("UserHabit", userHabitSchema);

module.exports = UserHabit;