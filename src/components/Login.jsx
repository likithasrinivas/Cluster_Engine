import React, { useEffect, useState } from "react";
import {
    Form,
    FloatingLabel,
    Button,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const isAuth = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth) navigate("/");
    });

    const handleLoginClick = (event) => {
        event.preventDefault();
        const loginUsername = "demo";
        const loginPassword = "password";

        if (username === loginUsername && password === loginPassword) {
            localStorage.setItem("token", true);
            toast.success("Login successful");
            navigate("/coverage");
        } else {
            toast.error("Invalid username or password");
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col></Col>
                <Col>
                    <div
                        style={{
                            minHeight: "33vh",
                            padding: "10px",
                        }}
                    >
                        <h4>LOGIN PAGE</h4>
                        <Form onSubmit={handleLoginClick}>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Username"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        marginBottom: "1rem",
                                    }}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="floatingPassword"
                                label="Password"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        marginBottom: "1rem",
                                    }}
                                />
                            </FloatingLabel>
                            <div style={{ marginBottom: "1rem" }}>
                                <Button type="submit" style={{ width: "100%" }}>
                                    Login
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
};

export default Login;
