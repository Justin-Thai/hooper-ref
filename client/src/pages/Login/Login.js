import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const signIn = () => {
        const data = { username: username, password: password };

        axios.post("/auth", data).then((response) => {
            if (response.data.message) {
                setErrMsg(response.data.message);
            }
            else {
                // Create token and return to home
                console.log("Logged in");
            }
        });
    };


    return (
        <div className="login-page">
            <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
            <label>Username</label>
            <input
                type="text"
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <label>Password</label>
            <input
                type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />
            <div className="subtext">
                <span>Forgot your password?</span>
                <span className="subtext-clickable">Click Here</span>
            </div>
            <button className="login-button" onClick={signIn}>Sign In</button>
            <div className="subtext">
                <span>Don't have an account?</span>
                <span
                    className="subtext-clickable"
                    onClick={() => navigate(`/signup`)}
                >
                    Sign Up
                </span>
            </div>
        </div>
    )
}

export default Login