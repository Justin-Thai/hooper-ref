import './UsersGrid.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import default_profile_image from '../../assets/default_profile.png';

function UsersGrid({ header, users }) {
    let listOfUsers = users;
    const navigate = useNavigate();

    return (
        <div className="users-grid-container">
            <div className="users-grid-header">{header} ({listOfUsers.length})</div>
            {listOfUsers.length === 0 ? (
                <div className="users-grid-text">No users found</div>
            ) : (
                <div className="users-grid-body">
                    {listOfUsers.map((value) => {
                        return (
                            <div
                                className="users-cell"
                                onClick={() => navigate(`/profile/${value.username}`)}
                                title={value.username}
                            >
                                <div className="users-cell-image">
                                    {value.image_url ? (
                                        <img className="cell-image" src={value.image_url} alt="User profile" />
                                    ) : (
                                        <img className="cell-image" src={default_profile_image} alt="Default profile" />
                                    )}
                                </div>
                                <div className="users-cell-name">{value.username}</div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    )
}

export default UsersGrid;