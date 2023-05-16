import './NavBar.css';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import AuthContext from '../../context/AuthProvider';
import useAuth from '../../hooks/useAuth';

function NavButtonsAuth() {
    let navigate = useNavigate();
    const { auth } = useAuth();
    const { setAuth } = useContext(AuthContext);

    const signOut = async () => {
        await axios.post("/auth/logout").then((response) => {
            setAuth({})
            console.log("logged out");
            navigate('/');
        })
    };

    return (
        <div className="navbarButtonContainer">
            <span className="username" onClick={() => navigate('/profile')}>{auth.username}</span>
            <button className="navButton" onClick={signOut}>Sign Out</button>
        </div>
    )
}

export default NavButtonsAuth