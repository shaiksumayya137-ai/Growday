const express = require("express");
const Habit = require("../models/Habit");
const UserHabit = require("../models/UserHabit");
const CustomHabit = require("../models/CustomHabit");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET RECOMMENDED HABITS
// =====================================================

router.get("/recommended", async (req, res) => {
    try {
        const habits = await Habit.find({
            isRecommended: true
        });

        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch recommended habits",
            error: error.message
        });
    }
});


// =====================================================
// ADD RECOMMENDED HABIT
// =====================================================

router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { habitId } = req.body;

        if (!habitId) {
            return res.status(400).json({
                message: "habitId is required"
            });
        }

        const existingHabit = await UserHabit.findOne({
            habit: habitId,
            userId: req.userId
        });

        if (existingHabit) {
            return res.status(400).json({
                message: "Habit already added"
            });
        }

        const userHabit = await UserHabit.create({
            habit: habitId,
            userId: req.userId
        });

        res.status(201).json({
            message: "Habit added successfully",
            userHabit
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add habit",
            error: error.message
        });
    }
});


// =====================================================
// CREATE CUSTOM HABIT
// =====================================================

router.post(
    "/custom",
    authMiddleware,
    async (req, res) => {
        try {
            const {
                name,
                description,
                category,
                target,
                icon
            } = req.body;

            if (!name || !name.trim()) {
                return res.status(400).json({
                    message: "Habit name is required"
                });
            }

            const customHabit =
                await CustomHabit.create({
                    userId: req.userId,
                    name: name.trim(),
                    description:
                        description?.trim() || "",
                    category:
                        category?.trim() || "Personal",
                    target:
                        target?.trim() || "Daily",
                    icon: icon || "🌱"
                });

            res.status(201).json({
                message:
                    "Custom habit created successfully",
                customHabit
            });
        } catch (error) {
            console.error(
                "Custom habit error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to create custom habit",
                error: error.message
            });
        }
    }
);


// =====================================================
// GET MY HABITS
// =====================================================

router.get(
    "/my-habits",
    authMiddleware,
    async (req, res) => {
        try {
            // Recommended habits
            const userHabits = await UserHabit.find({
                userId: req.userId
            }).populate("habit");

            // Custom habits
            const customHabits = await CustomHabit.find({
                userId: req.userId
            });

            const recommendedHabits =
                userHabits.map((userHabit) => ({
                    type: "recommended",
                    _id: userHabit._id,

                    habit: userHabit.habit,

                    currentStreak:
                        userHabit.currentStreak,

                    bestStreak:
                        userHabit.bestStreak,

                    completedToday:
                        userHabit.completedToday,

                    totalCompletions:
                        userHabit.totalCompletions,

                    completionDates:
                        userHabit.completionDates
                }));

            const customHabitResults =
                customHabits.map((habit) => ({
                    type: "custom",

                    _id: habit._id,

                    habit: {
                        name: habit.name,
                        description:
                            habit.description,
                        category:
                            habit.category,
                        target:
                            habit.target,
                        icon: habit.icon
                    },

                    currentStreak:
                        habit.currentStreak,

                    bestStreak:
                        habit.bestStreak,

                    completedToday:
                        habit.completedToday,

                    totalCompletions:
                        habit.totalCompletions,

                    completionDates:
                        habit.completionDates
                }));

            res.status(200).json([
                ...recommendedHabits,
                ...customHabitResults
            ]);
        } catch (error) {
            console.error(
                "My habits error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch user habits",
                error: error.message
            });
        }
    }
);


// =====================================================
// CHECK IN RECOMMENDED OR CUSTOM HABIT
// =====================================================

router.post(
    "/check-in/:habitId",
    authMiddleware,
    async (req, res) => {
        try {
            const habitId = req.params.habitId;

            // First look for a recommended habit
            let habit = await UserHabit.findOne({
                _id: habitId,
                userId: req.userId
            }).populate("habit");

            let habitType = "recommended";

            // If not found, look for a custom habit
            if (!habit) {
                habit = await CustomHabit.findOne({
                    _id: habitId,
                    userId: req.userId
                });

                habitType = "custom";
            }

            if (!habit) {
                return res.status(404).json({
                    message: "Habit not found"
                });
            }

            const today = new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );

            // Check if already completed today
            const alreadyCompleted =
                habit.completionDates.some(
                    (date) => {
                        const completedDate =
                            new Date(date);

                        completedDate.setHours(
                            0,
                            0,
                            0,
                            0
                        );

                        return (
                            completedDate.getTime() ===
                            today.getTime()
                        );
                    }
                );

            if (alreadyCompleted) {
                return res.status(400).json({
                    message:
                        "Habit already completed today"
                });
            }

            // Save completion
            habit.completionDates.push(today);

            habit.totalCompletions += 1;

            habit.completedToday = true;

            // Calculate streak
            const completedDates =
                habit.completionDates
                    .map((date) => {
                        const normalizedDate =
                            new Date(date);

                        normalizedDate.setHours(
                            0,
                            0,
                            0,
                            0
                        );

                        return normalizedDate.getTime();
                    })
                    .sort((a, b) => b - a);

            let streak = 0;

            let expectedDate =
                today.getTime();

            for (const date of completedDates) {
                if (date === expectedDate) {
                    streak += 1;

                    expectedDate -=
                        24 *
                        60 *
                        60 *
                        1000;
                } else if (
                    date < expectedDate
                ) {
                    break;
                }
            }

            habit.currentStreak = streak;

            if (
                streak >
                habit.bestStreak
            ) {
                habit.bestStreak = streak;
            }

            await habit.save();

            // Prepare response
            const result = {
                type: habitType,

                _id: habit._id,

                habit:
                    habitType ===
                    "recommended"
                        ? habit.habit
                        : {
                              name:
                                  habit.name,

                              description:
                                  habit.description,

                              category:
                                  habit.category,

                              target:
                                  habit.target,

                              icon:
                                  habit.icon
                          },

                currentStreak:
                    habit.currentStreak,

                bestStreak:
                    habit.bestStreak,

                completedToday:
                    habit.completedToday,

                totalCompletions:
                    habit.totalCompletions,

                completionDates:
                    habit.completionDates
            };

            res.status(200).json({
                message:
                    "Habit completed successfully",

                userHabit: result
            });
        } catch (error) {
            console.error(
                "Check-in error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to check in habit",

                error: error.message
            });
        }
    }
);


// =====================================================
// REMOVE RECOMMENDED OR CUSTOM HABIT
// =====================================================

router.delete(
    "/remove/:habitId",
    authMiddleware,
    async (req, res) => {
        try {
            const habitId =
                req.params.habitId;

            // Try recommended habit first
            const deletedUserHabit =
                await UserHabit.findOneAndDelete({
                    _id: habitId,
                    userId: req.userId
                });

            if (deletedUserHabit) {
                return res.status(200).json({
                    message:
                        "Habit removed successfully"
                });
            }

            // Try custom habit
            const deletedCustomHabit =
                await CustomHabit.findOneAndDelete({
                    _id: habitId,
                    userId: req.userId
                });

            if (deletedCustomHabit) {
                return res.status(200).json({
                    message:
                        "Habit removed successfully"
                });
            }

            return res.status(404).json({
                message: "Habit not found"
            });
        } catch (error) {
            console.error(
                "Remove habit error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to remove habit",
                error: error.message
            });
        }
    }
);


// =====================================================
// GET USER STATISTICS
// =====================================================

router.get(
    "/statistics",
    authMiddleware,
    async (req, res) => {
        try {
            const userHabits =
                await UserHabit.find({
                    userId: req.userId
                }).populate("habit");

            const customHabits =
                await CustomHabit.find({
                    userId: req.userId
                });

            const allHabits = [
                ...userHabits,
                ...customHabits
            ];

            const totalHabits =
                allHabits.length;

            const totalCompletions =
                allHabits.reduce(
                    (total, habit) =>
                        total +
                        habit.totalCompletions,
                    0
                );

            const bestStreak =
                totalHabits === 0
                    ? 0
                    : Math.max(
                          ...allHabits.map(
                              (habit) =>
                                  habit.bestStreak
                          )
                      );

            const currentStreak =
                totalHabits === 0
                    ? 0
                    : Math.max(
                          ...allHabits.map(
                              (habit) =>
                                  habit.currentStreak
                          )
                      );

            const today = new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );

            const weeklyData = [];

            for (
                let i = 6;
                i >= 0;
                i--
            ) {
                const date =
                    new Date(today);

                date.setDate(
                    today.getDate() - i
                );

                date.setHours(
                    0,
                    0,
                    0,
                    0
                );

                let completions = 0;

                allHabits.forEach(
                    (habit) => {
                        habit.completionDates.forEach(
                            (completionDate) => {
                                const completed =
                                    new Date(
                                        completionDate
                                    );

                                completed.setHours(
                                    0,
                                    0,
                                    0,
                                    0
                                );

                                if (
                                    completed.getTime() ===
                                    date.getTime()
                                ) {
                                    completions +=
                                        1;
                                }
                            }
                        );
                    }
                );

                weeklyData.push({
                    date:
                        date.toISOString(),

                    day:
                        date.toLocaleDateString(
                            "en-US",
                            {
                                weekday:
                                    "short"
                            }
                        ),

                    completions
                });
            }

            const weeklyCompletions =
                weeklyData.reduce(
                    (total, day) =>
                        total +
                        day.completions,
                    0
                );

            res.status(200).json({
                totalHabits,

                totalCompletions,

                currentStreak,

                bestStreak,

                weeklyCompletions,

                weeklyData
            });
        } catch (error) {
            console.error(
                "Statistics error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to calculate statistics"
            });
        }
    }
);


module.exports = router;