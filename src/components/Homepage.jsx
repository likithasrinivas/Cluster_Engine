import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const isUser = localStorage.getItem("token");

    const handleLoginClick = () => {
        navigate("/login");
    };
    const handleLogoutClick = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div>
            <h3>Welcome to Cluster Engine</h3>

            {isUser ? (
                <Button
                    onClick={handleLogoutClick}
                    variant="primary"
                    style={{ width: "10%" }}
                >
                    Logout
                </Button>
            ) : (
                <Button
                    onClick={handleLoginClick}
                    variant="primary"
                    style={{ width: "10%" }}
                >
                    Login
                </Button>
            )}
        </div>
    );
};

export default HomePage;
