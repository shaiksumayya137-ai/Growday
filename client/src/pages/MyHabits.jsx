import { useEffect, useState } from "react";
import {
    getMyHabits,
    checkInHabit,
    removeHabit
} from "../services/api";

function MyHabits() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyHabits();
    }, []);

    const fetchMyHabits = async () => {
        try {
            setError("");

            const data = await getMyHabits();

            setHabits(data);
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                setError(
                    "Please login to see your habits."
                );
            } else {
                setError(
                    "Unable to load your habits."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (habitId) => {
        try {
            const response =
                await checkInHabit(habitId);

            setHabits((currentHabits) =>
                currentHabits.map((habit) =>
                    habit._id === habitId
                        ? response.userHabit
                        : habit
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to complete habit."
            );
        }
    };

    const handleRemove = async (habitId) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this habit?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await removeHabit(habitId);

            setHabits((currentHabits) =>
                currentHabits.filter(
                    (habit) =>
                        habit._id !== habitId
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to remove habit."
            );
        }
    };

    if (loading) {
        return (
            <main className="home-container">
                <p>Loading your habits...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="home-container">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="home-container">
            <header className="home-header">
                <h1>My Habits 🌱</h1>

                <p>
                    Habits you've chosen to grow with.
                </p>
            </header>

            {habits.length === 0 ? (
                <div className="empty-state">
                    <h2>No habits yet 🌱</h2>

                    <p>
                        Add a recommended habit or create
                        your own.
                    </p>
                </div>
            ) : (
                <div className="habits-grid">
                    {habits.map((userHabit) => (
                        <article
                            className="habit-card"
                            key={userHabit._id}
                        >
                            <div className="habit-icon">
                                {userHabit.habit.icon}
                            </div>

                            <div className="habit-content">
                                <h3>
                                    {userHabit.habit.name}
                                </h3>

                                <p>
                                    {
                                        userHabit.habit
                                            .description
                                    }
                                </p>

                                <div className="habit-info">
                                    <span>
                                        📁{" "}
                                        {
                                            userHabit.habit
                                                .category
                                        }
                                    </span>

                                    <span>
                                        🎯{" "}
                                        {
                                            userHabit.habit
                                                .target
                                        }
                                    </span>
                                </div>

                                {userHabit.type ===
                                    "custom" && (
                                    <p className="custom-habit-label">
                                        ✨ Your Custom Habit
                                    </p>
                                )}

                                <div className="habit-info">
                                    <span>
                                        🔥 Streak:{" "}
                                        {
                                            userHabit.currentStreak
                                        }
                                    </span>

                                    <span>
                                        🏆 Best:{" "}
                                        {
                                            userHabit.bestStreak
                                        }
                                    </span>

                                    <span>
                                        ✓ Completed:{" "}
                                        {
                                            userHabit.totalCompletions
                                        }
                                    </span>
                                </div>

                                <button
                                    className="add-habit-btn"
                                    onClick={() =>
                                        handleCheckIn(
                                            userHabit._id
                                        )
                                    }
                                    disabled={
                                        userHabit.completedToday
                                    }
                                >
                                    {userHabit.completedToday
                                        ? "✓ Completed Today"
                                        : "✓ Check In"}
                                </button>

                                {userHabit.completedToday && (
                                    <p className="completed-message">
                                        🌱 Great job! You
                                        completed this habit
                                        today.
                                    </p>
                                )}

                                <div className="habit-history">
                                    <p>Last 7 days</p>

                                    <div className="history-days">
                                        {Array.from({
                                            length: 7
                                        }).map(
                                            (_, index) => {
                                                const date =
                                                    new Date();

                                                date.setHours(
                                                    0,
                                                    0,
                                                    0,
                                                    0
                                                );

                                                date.setDate(
                                                    date.getDate() -
                                                        (6 -
                                                            index)
                                                );

                                                const completed =
                                                    userHabit.completionDates?.some(
                                                        (
                                                            completionDate
                                                        ) => {
                                                            const completedDate =
                                                                new Date(
                                                                    completionDate
                                                                );

                                                            completedDate.setHours(
                                                                0,
                                                                0,
                                                                0,
                                                                0
                                                            );

                                                            return (
                                                                completedDate.getTime() ===
                                                                date.getTime()
                                                            );
                                                        }
                                                    );

                                                return (
                                                    <div
                                                        className={`history-day ${
                                                            completed
                                                                ? "completed"
                                                                : ""
                                                        }`}
                                                        key={date.toISOString()}
                                                    >
                                                        <span>
                                                            {date.toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    weekday:
                                                                        "short"
                                                                }
                                                            )}
                                                        </span>

                                                        <strong>
                                                            {completed
                                                                ? "✓"
                                                                : "·"}
                                                        </strong>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="remove-habit-btn"
                                    onClick={() =>
                                        handleRemove(
                                            userHabit._id
                                        )
                                    }
                                >
                                    Remove Habit
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default MyHabits;