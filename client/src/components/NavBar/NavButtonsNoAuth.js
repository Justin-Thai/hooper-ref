import './NavBar.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavButtonsNoAuth() {
    let navigate = useNavigate();

    return (
        <div className="navbarButtonContainer">
            <button className="navButton" onClick={() => navigate(`/signup`)}>Sign Up</button>
            <button className="navButton" onClick={() => navigate(`/login`)}>Sign In</button>
        </div>
    )
}

export default NavButtonsNoAuth