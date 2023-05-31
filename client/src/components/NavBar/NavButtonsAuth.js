import './NavBar.css';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

function NavButtonsAuth() {
    let navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        console.log("logged out");
        navigate('/');
    };

    return (
        <div className="navbarButtonContainer">
            <span className="username" onClick={() => navigate('/profile')}>My Profile</span>
            <button className="navButton" onClick={signOut}>Sign Out</button>
        </div>
    )
}

export default NavButtonsAuth