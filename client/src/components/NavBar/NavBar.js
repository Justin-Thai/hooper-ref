import './NavBar.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SidebarDataNoAuth, SidebarDataAuth } from './SidebarData';
import useClickOutside from '../../hooks/useClickOutside';
import useAuth from '../../hooks/useAuth';
import jwt_decode from 'jwt-decode';
import NavButtonsAuth from './NavButtonsAuth';
import NavButtonsNoAuth from './NavButtonsNoAuth';

function NavBar() {
    const { auth } = useAuth();
    const decodedUsername = auth?.accessToken
        ? jwt_decode(auth.accessToken).UserInfo?.username
        : undefined;
    const [sidebar, setSidebar] = useState(false);

    const openSidebar = () => { setSidebar(!sidebar); }

    let domNode = useClickOutside(() => {
        setSidebar(false);
    });

    let navigate = useNavigate();

    return (
        <div>
            <div ref={domNode} className="navbarContainer">
                <Link to="#" className="menuBars">
                    <FontAwesomeIcon icon={faBars} onClick={openSidebar} />
                </Link>
                <span className="pageTitle" onClick={() => navigate(`/`)}>HooperRef</span>
                {auth?.accessToken ? <NavButtonsAuth username={decodedUsername} /> : <NavButtonsNoAuth />}
            </div>
            <nav className={sidebar ? "navMenuActive" : "navMenu"}>
                <ul className="navMenuItems" onClick={openSidebar}>
                    <li className="navbarToggle">
                        <Link to="#" className="menuBars">
                            <FontAwesomeIcon icon={faXmark} />
                        </Link>
                    </li>
                    {auth?.accessToken ? (
                        SidebarDataAuth.map((value, index) => {
                            return (
                                <li key={index} className={value.cName}>
                                    {value.path === '/profile' ? (
                                        <Link to={`/profile/${decodedUsername}`}>
                                            {value.icon}
                                            <span className="menuOptionTitle">{value.title}</span>
                                        </Link>
                                    ) : value.title === 'Feedback' ? (
                                        <Link to={value.path} target='__blank'>
                                            {value.icon}
                                            <span className="menuOptionTitle">{value.title}</span>
                                        </Link>
                                    ) : (
                                        <Link to={value.path}>
                                            {value.icon}
                                            <span className="menuOptionTitle">{value.title}</span>
                                        </Link>
                                    )
                                    }
                                </li>
                            );
                        })
                    ) : (
                        SidebarDataNoAuth.map((value, index) => {
                            return (
                                <li key={index} className={value.cName}>
                                    {value.title === 'Feedback' ? (
                                        <Link to={value.path} target='__blank'>
                                            {value.icon}
                                            <span className="menuOptionTitle">{value.title}</span>
                                        </Link>
                                    ) : (
                                        <Link to={value.path}>
                                            {value.icon}
                                            <span className="menuOptionTitle">{value.title}</span>
                                        </Link>
                                    )}

                                </li>
                            );
                        })
                    )
                    }
                </ul>
            </nav>
        </div>
    )
}

export default NavBar;


