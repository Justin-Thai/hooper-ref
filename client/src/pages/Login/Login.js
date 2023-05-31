import './Login.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { setAuth } = useAuth();
    const [username, resetUser, userAttributes] = useInput('user', '');
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [check, toggleCheck] = useToggle('persist', false);

    const signIn = async () => {
        const data = { username: username, password: password };

        try {
            await axios.post("/auth", data,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            ).then((response) => {
                const accessToken = response?.data?.accessToken;

                setAuth({ username, accessToken });
                resetUser();
                setPassword('');
                setErrMsg('');
                console.log(response.data);
                navigate(from, { replace: true });
            });
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            }
            else {
                setErrMsg(err.response?.data?.message);
            }
        }
    };


    return (
        <div className="login-page">
            <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
            <label>Username</label>
            <input
                type="text"
                {...userAttributes}
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
            <div className="persist-check">
                <input 
                    type="checkbox" 
                    id="persist"
                    onChange={toggleCheck}
                    checked={check}
                />
                <label htmlFor="persist">Trust this device</label>
            </div>
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