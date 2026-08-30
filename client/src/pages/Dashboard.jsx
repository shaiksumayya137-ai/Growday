import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getMyHabits,
    getStatistics
} from "../services/api";

function Dashboard() {
    const [habits, setHabits] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setError("");

                const [habitsData, statisticsData] =
                    await Promise.all([
                        getMyHabits(),
                        getStatistics()
                    ]);

                setHabits(habitsData);
                setStatistics(statisticsData);
            } catch (error) {
                console.error(error);

                if (error.response?.status === 401) {
                    setError(
                        "Please login to view your dashboard."
                    );
                } else {
                    setError(
                        "Unable to load your dashboard."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <main className="home-container">
                <p>Loading dashboard...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="home-container">
                <div className="empty-state">
                    <h2>🔐 Login Required</h2>

                    <p>{error}</p>

                    <Link
                        to="/login"
                        className="auth-button dashboard-login-link"
                    >
                        Login
                    </Link>
                </div>
            </main>
        );
    }

    const completedToday = habits.filter(
        (habit) => habit.completedToday
    ).length;

    const totalHabits = habits.length;

    const progress =
        totalHabits === 0
            ? 0
            : Math.round(
                  (completedToday / totalHabits) * 100
              );

    const maxCompletions = Math.max(
        ...statistics.weeklyData.map(
            (day) => day.completions
        ),
        1
    );

    return (
        <main className="home-container">
            <header className="home-header">
                <h1>Good day! 🌱</h1>

                <p>
                    Keep growing, one habit at a time.
                </p>
            </header>

            <section className="dashboard-stats">
                <div className="stat-card">
                    <h3>Today's Progress</h3>
                    <strong>{progress}%</strong>
                    <p>
                        {completedToday} of {totalHabits}{" "}
                        completed
                    </p>
                </div>

                <div className="stat-card">
                    <h3>🔥 Current Streak</h3>
                    <strong>
                        {statistics.currentStreak}
                    </strong>
                    <p>days</p>
                </div>

                <div className="stat-card">
                    <h3>🏆 Best Streak</h3>
                    <strong>
                        {statistics.bestStreak}
                    </strong>
                    <p>days</p>
                </div>

                <div className="stat-card">
                    <h3>✓ Total Completions</h3>
                    <strong>
                        {statistics.totalCompletions}
                    </strong>
                    <p>all time</p>
                </div>

                <div className="stat-card">
                    <h3>📊 This Week</h3>
                    <strong>
                        {statistics.weeklyCompletions}
                    </strong>
                    <p>completions</p>
                </div>

                <div className="stat-card">
                    <h3>🌱 My Habits</h3>
                    <strong>
                        {statistics.totalHabits}
                    </strong>
                    <p>active habits</p>
                </div>
            </section>

            <section className="weekly-chart">
                <h2>Weekly Progress</h2>

                <p className="chart-subtitle">
                    Your habit completions over the last
                    7 days.
                </p>

                <div className="chart-bars">
                    {statistics.weeklyData.map(
                        (day) => {
                            const height =
                                day.completions === 0
                                    ? 5
                                    : Math.max(
                                          (day.completions /
                                              maxCompletions) *
                                              100,
                                          10
                                      );

                            return (
                                <div
                                    className="chart-column"
                                    key={day.date}
                                >
                                    <span className="chart-value">
                                        {day.completions}
                                    </span>

                                    <div className="chart-bar-wrapper">
                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: `${height}%`
                                            }}
                                        />
                                    </div>

                                    <span className="chart-day">
                                        {day.day}
                                    </span>
                                </div>
                            );
                        }
                    )}
                </div>
            </section>

            <section>
                <h2 className="habits-title">
                    Today's Habits
                </h2>

                {habits.length === 0 ? (
                    <div className="empty-state">
                        <h2>No habits yet 🌱</h2>

                        <p>
                            Choose some habits to start
                            growing.
                        </p>

                        <Link
                            to="/"
                            className="auth-button dashboard-login-link"
                        >
                            Explore Habits
                        </Link>
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
                                        {
                                            userHabit.habit
                                                .name
                                        }
                                    </h3>

                                    <p>
                                        {
                                            userHabit.habit
                                                .description
                                        }
                                    </p>

                                    <div className="habit-info">
                                        <span>
                                            🔥{" "}
                                            {
                                                userHabit.currentStreak
                                            }{" "}
                                            day streak
                                        </span>

                                        <span>
                                            ✓{" "}
                                            {
                                                userHabit.totalCompletions
                                            }{" "}
                                            completed
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Dashboard;