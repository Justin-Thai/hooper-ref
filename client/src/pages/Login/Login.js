import './Login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { setAuth, persist, setPersist } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const signIn = async () => {
        const data = { username: username, password: password };

        try {
            await axios.post("/auth", data,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            ).then((response) => {
                const role = response?.data?.role;
                const accessToken = response?.data?.accessToken;

                setAuth({ username, password, role, accessToken });
                setUsername('');
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

    const togglePersist = () => {
        setPersist(prev => !prev);
    };

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist]);


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
            <div className="persist-check">
                <input 
                    type="checkbox" 
                    id="persist"
                    onChange={togglePersist}
                    checked={persist}
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