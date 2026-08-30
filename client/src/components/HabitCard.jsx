import { useState } from "react";
import { addHabit } from "../services/api";

function HabitCard({ habit }) {
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAddHabit = async () => {
        try {
            setLoading(true);
            setError("");

            await addHabit(habit._id);

            setAdded(true);
        } catch (error) {
            console.error(error);

            if (
                error.response?.data?.message ===
                "Habit already added"
            ) {
                setAdded(true);
            } else if (
                error.response?.status === 401
            ) {
                setError("Please login first.");
            } else {
                setError("Unable to add habit.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className="habit-card">
            <div className="habit-icon">
                {habit.icon}
            </div>

            <div className="habit-content">
                <h3>{habit.name}</h3>

                <p>{habit.description}</p>

                <div className="habit-info">
                    <span>{habit.category}</span>
                    <span>{habit.difficulty}</span>
                    <span>{habit.target}</span>
                </div>

                <button
                    className="add-habit-btn"
                    onClick={handleAddHabit}
                    disabled={loading || added}
                >
                    {loading
                        ? "Adding..."
                        : added
                        ? "✓ Added"
                        : "+ Add Habit"}
                </button>

                {error && (
                    <p className="habit-error">
                        {error}
                    </p>
                )}
            </div>
        </article>
    );
}



export default HabitCard;