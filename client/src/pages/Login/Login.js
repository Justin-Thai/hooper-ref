import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const signIn = () => {
        const data = { username: username, password: password };
        console.log(data);
    };


    return (
        <div className="login-page">
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
                    onClick={() => navigate(`/registration`)}
                >
                        Sign Up
                </span>
            </div>
        </div>
    )
}

export default Login