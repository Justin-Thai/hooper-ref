import './Missing.css';
import missing_page_image from '../../assets/westbrook_why.jpg';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Missing() {
    let navigate = useNavigate();

    return (
        <div className="missing-page">
            <span>Sorry, but the page was not found</span>
            <img className="missing-page-image" src={missing_page_image} alt="Westbrook shrugging why"/>
            <span className="image-caption">Photo Credit: Meg Oliphant/Getty Images</span>
            <button className="back-home-button" onClick={() => navigate("/")}>Back to Home</button>
        </div>
    )
}

export default Missing;