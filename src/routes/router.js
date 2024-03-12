import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import NavBar from "../components/Navbar";
import Login from "../components/Login";
import Homepage from "../components/Homepage";
import Dashboard from "../components/Dashboard";
import EfficiencyBoard from "../components/EfficiencyBoard";
import Coverage from "../components/Coverage";

const AppRouter = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/coverage" element={<Coverage />} />
                    <Route path="/efficiency" element={<EfficiencyBoard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Homepage />} exact />
            </Routes>
        </Router>
    );
};

export default AppRouter;
