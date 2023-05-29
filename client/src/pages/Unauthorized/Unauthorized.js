import './Unauthorized.css';
import unauthorized_page_gif from '../../assets/mutombo_block.gif';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="unauthorized-page">
            <span>Sorry, but you are denied access to this page.</span>
            <img className="unauthorized-page-gif" src={unauthorized_page_gif} alt="Mutombo blocking child putting cereal in shopping cart."/>
            <span className="gif-caption">Source: https://giphy.com/gifs/greatest-block-mtumbo-13Gy7Pan1UTBgA (2023)</span>
            <button className="back-home-button" onClick={() => navigate("/")}>Back to Home</button>
        </div>
    )
}

export default Unauthorized;