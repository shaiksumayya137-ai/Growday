require("dotenv").config();

const mongoose = require("mongoose");
const Habit = require("./models/Habit");

const recommendedHabits = [
    // FITNESS
    {
        name: "Exercise",
        description: "Do a workout to keep your body active.",
        category: "Fitness",
        difficulty: "Medium",
        target: "30 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🏋️"
    },
    {
        name: "Walk 30 Minutes",
        description: "Take a relaxing 30-minute walk.",
        category: "Fitness",
        difficulty: "Easy",
        target: "30 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🚶"
    },
    {
        name: "Stretching",
        description: "Stretch your body and improve flexibility.",
        category: "Fitness",
        difficulty: "Easy",
        target: "10 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🤸"
    },
    {
        name: "Running",
        description: "Go for a run and improve your stamina.",
        category: "Fitness",
        difficulty: "Medium",
        target: "20 minutes",
        frequency: "Weekly",
        isRecommended: true,
        icon: "🏃"
    },
    {
        name: "Yoga",
        description: "Practice yoga for flexibility and relaxation.",
        category: "Fitness",
        difficulty: "Medium",
        target: "20 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🧘"
    },

    // LEARNING
    {
        name: "Read a Book",
        description: "Spend some quiet time reading.",
        category: "Learning",
        difficulty: "Easy",
        target: "20 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "📖"
    },
    {
        name: "Practice Coding",
        description: "Improve your programming skills through practice.",
        category: "Learning",
        difficulty: "Hard",
        target: "1 hour",
        frequency: "Daily",
        isRecommended: true,
        icon: "💻"
    },
    {
        name: "Learn Something New",
        description: "Learn something useful or interesting.",
        category: "Learning",
        difficulty: "Medium",
        target: "30 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🧠"
    },
    {
        name: "Learn a Language",
        description: "Practice vocabulary, speaking or writing.",
        category: "Learning",
        difficulty: "Medium",
        target: "20 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🌍"
    },
    {
        name: "Revise Notes",
        description: "Review what you learned during the day.",
        category: "Learning",
        difficulty: "Easy",
        target: "20 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "📝"
    },

    // WELLNESS
    {
        name: "Meditation",
        description: "Spend a few minutes relaxing your mind.",
        category: "Wellness",
        difficulty: "Easy",
        target: "10 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🧘"
    },
    {
        name: "Journaling",
        description: "Write down your thoughts and experiences.",
        category: "Wellness",
        difficulty: "Easy",
        target: "10 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "📔"
    },
    {
        name: "Practice Gratitude",
        description: "Write down three things you are grateful for.",
        category: "Wellness",
        difficulty: "Easy",
        target: "5 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "💚"
    },
    {
        name: "Digital Detox",
        description: "Take some time away from social media and screens.",
        category: "Wellness",
        difficulty: "Medium",
        target: "1 hour",
        frequency: "Daily",
        isRecommended: true,
        icon: "📵"
    },

    // PRODUCTIVITY
    {
        name: "Plan Tomorrow",
        description: "Prepare your important tasks for tomorrow.",
        category: "Productivity",
        difficulty: "Easy",
        target: "10 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "📅"
    },
    {
        name: "Complete Top 3 Tasks",
        description: "Finish the three most important tasks of the day.",
        category: "Productivity",
        difficulty: "Medium",
        target: "3 tasks",
        frequency: "Daily",
        isRecommended: true,
        icon: "🎯"
    },
    {
        name: "Clean Workspace",
        description: "Keep your study or work area organized.",
        category: "Productivity",
        difficulty: "Easy",
        target: "10 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🧹"
    },
    {
        name: "Focus Session",
        description: "Work without distractions on one important task.",
        category: "Productivity",
        difficulty: "Hard",
        target: "45 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🎧"
    },

    // SLEEP
    {
        name: "Sleep Before 11 PM",
        description: "Maintain a consistent sleeping schedule.",
        category: "Sleep",
        difficulty: "Medium",
        target: "Before 11 PM",
        frequency: "Daily",
        isRecommended: true,
        icon: "🌙"
    },
    {
        name: "No Phone Before Bed",
        description: "Avoid using your phone before sleeping.",
        category: "Sleep",
        difficulty: "Medium",
        target: "30 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "📵"
    },
    {
        name: "Morning Routine",
        description: "Follow a consistent morning routine.",
        category: "Sleep",
        difficulty: "Medium",
        target: "30 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🌅"
    },

    // HEALTHY LIFESTYLE
    {
        name: "Drink Enough Water",
        description: "Stay hydrated throughout the day.",
        category: "Healthy Lifestyle",
        difficulty: "Easy",
        target: "8 glasses",
        frequency: "Daily",
        isRecommended: true,
        icon: "💧"
    },
    {
        name: "Eat Fruits",
        description: "Include fruits in your daily diet.",
        category: "Healthy Lifestyle",
        difficulty: "Easy",
        target: "1 serving",
        frequency: "Daily",
        isRecommended: true,
        icon: "🍎"
    },
    {
        name: "Avoid Junk Food",
        description: "Reduce unnecessary junk food consumption.",
        category: "Healthy Lifestyle",
        difficulty: "Medium",
        target: "1 day",
        frequency: "Daily",
        isRecommended: true,
        icon: "🥗"
    },
    {
        name: "Take Regular Breaks",
        description: "Take short breaks during long study or work sessions.",
        category: "Healthy Lifestyle",
        difficulty: "Easy",
        target: "5 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "☕"
    },

    // HOBBIES
    {
        name: "Draw or Sketch",
        description: "Spend some time being creative.",
        category: "Hobbies",
        difficulty: "Easy",
        target: "20 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🎨"
    },
    {
        name: "Practice Music",
        description: "Practice an instrument or singing.",
        category: "Hobbies",
        difficulty: "Medium",
        target: "30 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🎵"
    },
    {
        name: "Cook Something",
        description: "Try preparing a meal or learning a recipe.",
        category: "Hobbies",
        difficulty: "Medium",
        target: "30 minutes",
        frequency: "Weekly",
        isRecommended: true,
        icon: "🍳"
    },
    {
        name: "Gardening",
        description: "Spend time caring for plants.",
        category: "Hobbies",
        difficulty: "Easy",
        target: "20 minutes",
        frequency: "Weekly",
        isRecommended: true,
        icon: "🌱"
    },

    // PERSONAL GROWTH
    {
        name: "Call Family",
        description: "Spend some time talking with your family.",
        category: "Personal Growth",
        difficulty: "Easy",
        target: "10 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "📞"
    },
    {
        name: "Help Someone",
        description: "Do something helpful for another person.",
        category: "Personal Growth",
        difficulty: "Easy",
        target: "1 action",
        frequency: "Daily",
        isRecommended: true,
        icon: "🤝"
    },
    {
        name: "Learn From Mistakes",
        description: "Reflect on something you could improve.",
        category: "Personal Growth",
        difficulty: "Medium",
        target: "10 minutes",
        frequency: "Daily",
        isRecommended: true,
        icon: "🌱"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Habit.deleteMany({ isRecommended: true });

        await Habit.insertMany(recommendedHabits);

        console.log(`${recommendedHabits.length} recommended habits added successfully`);

        await mongoose.connection.close();

        console.log("Database connection closed");
    } catch (error) {
        console.error("Error seeding habits:", error.message);
        process.exit(1);
    }
    
};

seedDatabase();