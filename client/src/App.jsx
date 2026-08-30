import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate,
    Navigate
} from "react-router-dom";

import { useState } from "react";

import Home from "./pages/Home";
import MyHabits from "./pages/MyHabits";
import CreateHabit from "./pages/CreateHabit";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";

function ProtectedRoute({ isLoggedIn, children }) {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function Navigation({ isLoggedIn, user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        onLogout();

        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                🌱 GrowDay
            </div>

            <div className="navbar-links">
                <Link to="/">
                    Recommended
                </Link>

                {isLoggedIn && (
                    <>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/my-habits">
                            My Habits
                        </Link>

                        <Link to="/create-habit">
                            + Create Habit
                        </Link>
                    </>
                )}

                {!isLoggedIn ? (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="user-name">
                            Hi, {user?.name}
                        </span>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    const [user, setUser] = useState(() => {
        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    return (
        <BrowserRouter>
            <Navigation
                isLoggedIn={isLoggedIn}
                user={user}
                onLogout={() => {
                    setIsLoggedIn(false);
                    setUser(null);
                }}
            />

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute
                            isLoggedIn={isLoggedIn}
                        >
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-habits"
                    element={
                        <ProtectedRoute
                            isLoggedIn={isLoggedIn}
                        >
                            <MyHabits />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <Login
                            onLogin={(loggedInUser) => {
                                setIsLoggedIn(true);
                                setUser(loggedInUser);
                            }}
                        />
                    }
                />

                <Route
                    path="/register"
                    element={
                        <Register
                            onLogin={(newUser) => {
                                setIsLoggedIn(true);
                                setUser(newUser);
                            }}
                        />
                    }
                />

                <Route
                    path="/create-habit"
                    element={
                        <ProtectedRoute
                            isLoggedIn={isLoggedIn}
                        >
                            <CreateHabit />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;